# Airline Front

React Router 7 (SSR) + Tailwind 4 + TypeScript. Talks to the .NET API in `../back/Airline.Api`.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build
npm start          # serve the build
npm run typecheck
```

Set `API_URL` to point to the API (defaults to `http://localhost:5080`).

## Routes

- `/` – available flights
- `/checkout/:flightId` – coupon + passenger details + price summary
- `/bookings/:reference` – booking confirmation
