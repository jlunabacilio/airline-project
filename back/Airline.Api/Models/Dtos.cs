namespace Airline.Api.Models;

public record ValidateCouponRequest(string? Code);
public record CreateBookingRequest(int FlightId, string? PassengerName, string? PassengerEmail, string? CouponCode);
public record PriceQuote(long OriginalCents, long DiscountCents, long TotalCents, string? CouponCode, int Percent);
