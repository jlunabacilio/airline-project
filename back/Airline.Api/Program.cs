using Airline.Api.Data;
using Airline.Api.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AirlineDb>(o =>
    o.UseSqlite(builder.Configuration.GetConnectionString("Airline") ?? "Data Source=airline.db"));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AirlineDb>();
    db.Database.EnsureCreated();
    AirlineDb.Seed(db);
}

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors();

var api = app.MapGroup("/api");

api.MapGet("/flights", async (AirlineDb db) =>
    await db.Flights.AsNoTracking().OrderBy(f => f.DepartureUtc).ToListAsync());

api.MapGet("/flights/{id:int}", async (int id, AirlineDb db) =>
    await db.Flights.AsNoTracking().FirstOrDefaultAsync(f => f.Id == id) is { } f
        ? Results.Ok(f)
        : Results.NotFound(new { error = "Flight not found" }));

// Quote the price of a flight with an optional coupon.
api.MapPost("/flights/{id:int}/quote", async (int id, ValidateCouponRequest req, AirlineDb db) =>
{
    var flight = await db.Flights.AsNoTracking().FirstOrDefaultAsync(f => f.Id == id);
    if (flight is null) return Results.NotFound(new { error = "Flight not found" });

    var (quote, error) = await Pricing.QuoteAsync(db, flight, req.Code);
    return error is null ? Results.Ok(quote) : Results.BadRequest(new { error });
});

api.MapPost("/bookings", async (CreateBookingRequest req, AirlineDb db) =>
{
    if (string.IsNullOrWhiteSpace(req.PassengerName))
        return Results.BadRequest(new { error = "Passenger name is required" });
    if (string.IsNullOrWhiteSpace(req.PassengerEmail) || !req.PassengerEmail.Contains('@'))
        return Results.BadRequest(new { error = "Email is not valid" });

    await using var tx = await db.Database.BeginTransactionAsync();

    var flight = await db.Flights.FirstOrDefaultAsync(f => f.Id == req.FlightId);
    if (flight is null) return Results.NotFound(new { error = "Flight not found" });
    if (flight.AvailableSeats <= 0) return Results.Conflict(new { error = "No seats available" });

    var (quote, error) = await Pricing.QuoteAsync(db, flight, req.CouponCode);
    if (error is not null) return Results.BadRequest(new { error });

    flight.AvailableSeats--;
    var booking = new Booking
    {
        Reference = Guid.NewGuid().ToString("N")[..6].ToUpperInvariant(),
        FlightId = flight.Id,
        PassengerName = req.PassengerName.Trim(),
        PassengerEmail = req.PassengerEmail.Trim(),
        CouponCode = quote!.CouponCode,
        OriginalCents = quote.OriginalCents,
        DiscountCents = quote.DiscountCents,
        TotalCents = quote.TotalCents,
        CreatedUtc = DateTime.UtcNow,
    };
    db.Bookings.Add(booking);
    await db.SaveChangesAsync();
    await tx.CommitAsync();

    return Results.Created($"/api/bookings/{booking.Reference}", booking);
});

api.MapGet("/bookings/{reference}", async (string reference, AirlineDb db) =>
    await db.Bookings.AsNoTracking().Include(b => b.Flight)
        .FirstOrDefaultAsync(b => b.Reference == reference.ToUpper()) is { } b
        ? Results.Ok(b)
        : Results.NotFound(new { error = "Booking not found" }));

app.Run();

static class Pricing
{
    public static async Task<(PriceQuote? Quote, string? Error)> QuoteAsync(AirlineDb db, Flight flight, string? code)
    {
        var original = flight.PriceCents;
        if (string.IsNullOrWhiteSpace(code))
            return (new PriceQuote(original, 0, original, null, 0), null);

        var normalized = code.Trim().ToUpperInvariant();
        var coupon = await db.Coupons.AsNoTracking().FirstOrDefaultAsync(c => c.Code == normalized && c.Active);
        if (coupon is null) return (null, "Invalid coupon code");

        var discount = original * coupon.Percent / 100;
        return (new PriceQuote(original, discount, original - discount, coupon.Code, coupon.Percent), null);
    }
}
