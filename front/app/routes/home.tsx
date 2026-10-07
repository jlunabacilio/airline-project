import { Link } from "react-router";
import type { Route } from "./+types/home";
import { api, type Flight } from "../lib/api.server";
import { dateTime, money } from "../lib/format";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Flights - Airline" },
    { name: "description", content: "Find and book your flight" },
  ];
}

export async function loader() {
  const res = await api("/flights");
  if (!res.ok) throw new Response("Failed to load flights", { status: 502 });
  return { flights: (await res.json()) as Flight[] };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">✈️ Available flights</h1>
        <p className="text-gray-600 mb-8">Pick a flight to continue with your booking.</p>

        <ul className="space-y-4">
          {loaderData.flights.map((f) => (
            <li key={f.id} className="bg-white rounded-2xl shadow p-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-mono text-gray-500">{f.code}</p>
                <p className="text-lg font-semibold text-gray-900">
                  {f.origin} → {f.destination}
                </p>
                <p className="text-sm text-gray-600">
                  {dateTime(f.departureUtc)} · {dateTime(f.arrivalUtc)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {f.availableSeats > 0 ? `${f.availableSeats} seats available` : "Sold out"}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-bold text-blue-600">{money(f.priceCents)}</p>
                {f.availableSeats > 0 ? (
                  <Link
                    to={`/checkout/${f.id}`}
                    className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Book
                  </Link>
                ) : (
                  <span className="inline-block mt-2 px-4 py-2 bg-gray-200 text-gray-500 rounded-lg">
                    Sold out
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
