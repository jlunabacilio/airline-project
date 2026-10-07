import { Link } from "react-router";
import type { Route } from "./+types/booking";
import { api, type Booking } from "../lib/api.server";
import { dateTime, money } from "../lib/format";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `Booking ${params.reference} - Airline` }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const res = await api(`/bookings/${params.reference}`);
  if (res.status === 404) throw new Response("Booking not found", { status: 404 });
  if (!res.ok) throw new Response("Failed to load the booking", { status: 502 });
  return { booking: (await res.json()) as Booking };
}

export default function BookingPage({ loaderData }: Route.ComponentProps) {
  const { booking: b } = loaderData;
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">✅ Booking confirmed</h1>
        <p className="text-gray-600">
          Booking reference: <span className="font-mono font-bold text-blue-600">{b.reference}</span>
        </p>
        <div className="border-t pt-4 space-y-1 text-gray-700">
          <p className="font-semibold">
            {b.flight.code} · {b.flight.origin} → {b.flight.destination}
          </p>
          <p className="text-sm">Departure: {dateTime(b.flight.departureUtc)}</p>
          <p className="text-sm">Passenger: {b.passengerName} ({b.passengerEmail})</p>
        </div>
        <div className="border-t pt-4 space-y-1">
          <div className="flex justify-between text-gray-600">
            <span>Price</span>
            <span>{money(b.originalCents)}</span>
          </div>
          {b.discountCents > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({b.couponCode})</span>
              <span>-{money(b.discountCents)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg text-gray-900">
            <span>Total</span>
            <span>{money(b.totalCents)}</span>
          </div>
        </div>
        <Link to="/" className="inline-block text-blue-600 hover:text-blue-700 font-medium">
          ← Back to flights
        </Link>
      </div>
    </div>
  );
}
