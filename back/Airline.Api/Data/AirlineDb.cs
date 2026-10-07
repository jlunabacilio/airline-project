using Airline.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Airline.Api.Data;

public class AirlineDb(DbContextOptions<AirlineDb> options) : DbContext(options)
{
    public DbSet<Flight> Flights => Set<Flight>();
    public DbSet<Coupon> Coupons => Set<Coupon>();
    public DbSet<Booking> Bookings => Set<Booking>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<Coupon>().HasKey(c => c.Code);
        b.Entity<Booking>().HasIndex(x => x.Reference).IsUnique();
    }

    public static void Seed(AirlineDb db)
    {
        if (!db.Coupons.Any())
        {
            db.Coupons.AddRange(
                new Coupon { Code = "SAVE10", Percent = 10 },
                new Coupon { Code = "SAVE20", Percent = 20 },
                new Coupon { Code = "SUMMER25", Percent = 25 },
                new Coupon { Code = "WELCOME15", Percent = 15 });
        }

        if (!db.Flights.Any())
        {
            var d = DateTime.UtcNow.Date.AddDays(7).AddHours(8);
            db.Flights.AddRange(
                new Flight { Code = "AL100", Origin = "Tijuana (TIJ)", Destination = "Mexico City (MEX)", DepartureUtc = d, ArrivalUtc = d.AddHours(3).AddMinutes(30), PriceCents = 29999, AvailableSeats = 20 },
                new Flight { Code = "AL210", Origin = "Tijuana (TIJ)", Destination = "Guadalajara (GDL)", DepartureUtc = d.AddHours(4), ArrivalUtc = d.AddHours(7), PriceCents = 21950, AvailableSeats = 15 },
                new Flight { Code = "AL330", Origin = "Mexico City (MEX)", Destination = "Cancun (CUN)", DepartureUtc = d.AddDays(1), ArrivalUtc = d.AddDays(1).AddHours(2).AddMinutes(30), PriceCents = 18900, AvailableSeats = 5 },
                new Flight { Code = "AL450", Origin = "Guadalajara (GDL)", Destination = "Monterrey (MTY)", DepartureUtc = d.AddDays(2), ArrivalUtc = d.AddDays(2).AddHours(1).AddMinutes(45), PriceCents = 15500, AvailableSeats = 0 });
        }

        db.SaveChanges();
    }
}
