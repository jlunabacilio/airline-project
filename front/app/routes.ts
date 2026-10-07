import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("checkout/:flightId", "routes/checkout.tsx"),
  route("bookings/:reference", "routes/booking.tsx"),
] satisfies RouteConfig;
