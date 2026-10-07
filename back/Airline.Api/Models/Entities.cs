namespace Airline.Api.Models;

public class Flight
{
    public int Id { get; set; }
    public required string Code { get; set; }
    public required string Origin { get; set; }
    public required string Destination { get; set; }
    public DateTime DepartureUtc { get; set; }
    public DateTime ArrivalUtc { get; set; }
    // Prices are stored in cents to avoid floating point errors.
    public long PriceCents { get; set; }
    public int AvailableSeats { get; set; }
}

public class Coupon
{
    public required string Code { get; set; }
    public int Percent { get; set; }
    public bool Active { get; set; } = true;
}

public class Booking
{
    public int Id { get; set; }
    public required string Reference { get; set; }
    public int FlightId { get; set; }
    public Flight? Flight { get; set; }
    public required string PassengerName { get; set; }
    public required string PassengerEmail { get; set; }
    public string? CouponCode { get; set; }
    public long OriginalCents { get; set; }
    public long DiscountCents { get; set; }
    public long TotalCents { get; set; }
    public DateTime CreatedUtc { get; set; }
}
