# ✈️ Airline Project

Flight booking with discount coupons.

```
front/                React Router 7 (SSR) + Tailwind 4               → http://localhost:5173
back/Airline.Api/     ASP.NET Core 8 (Minimal API) + EF Core + SQLite → http://localhost:5080
```

The browser only talks to the front end. React Router `loader`/`action` functions call the API,
so CORS is not needed in the normal flow. Prices and coupons are calculated on the server (.NET).

## Requirements

- .NET SDK 8
- Node.js 20+

## Run locally

```bash
cd back/Airline.Api && dotnet run     # API + Swagger at http://localhost:5080/swagger
cd front && npm install && npm run dev
```

The `airline.db` database is created automatically when the API starts, with sample flights and coupons.
To reset it, delete `back/Airline.Api/airline.db`.

## Flows to try

1. **Book with a coupon:** `/` → *Book* on AL100 → coupon `SAVE20` → name and email → *Confirm Booking*.
2. **Invalid coupon:** type `INVALID` in the checkout and see the error returned by the API.
3. **Sold out flight:** AL450 has no seats and cannot be booked.
4. **Seats:** book AL330 (5 seats) several times and watch the availability drop on `/`.
5. **Look up a booking:** `/bookings/<reference>`.

Coupons: `SAVE10` (10%), `SAVE20` (20%), `SUMMER25` (25%), `WELCOME15` (15%).

## API

| Method | Route | Description |
|---|---|---|
| GET | `/api/flights` | List flights |
| GET | `/api/flights/{id}` | Flight details |
| POST | `/api/flights/{id}/quote` | Calculates the price with an optional coupon `{ "code": "SAVE20" }` |
| POST | `/api/bookings` | Creates the booking and takes one seat |
| GET | `/api/bookings/{reference}` | Looks up a booking |

Prices are stored in cents (`long`).

## Configuration

- Front → API: `API_URL` environment variable (defaults to `http://localhost:5080`).
- SQLite connection: `ConnectionStrings:Airline` (defaults to `Data Source=airline.db`).

## Ideas for the exercise

- Replace `EnsureCreated()` with EF Core migrations (`dotnet ef migrations add Initial`).
- Add tests with `WebApplicationFactory` and in-memory SQLite.
- Search flights by origin, destination and date.
- Dockerfile and `docker-compose` for the API.
