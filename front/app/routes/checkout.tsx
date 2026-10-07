import { Form, Link, redirect, useNavigation } from "react-router";
import type { Route } from "./+types/checkout";
import { api, post, type Flight, type Quote, type Booking } from "../lib/api.server";
import { dateTime, money } from "../lib/format";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Checkout - Airline" },
    { name: "description", content: "Complete your booking" },
  ];
}

export async function loader({ params, request }: Route.LoaderArgs) {
  const res = await api(`/flights/${params.flightId}`);
  if (res.status === 404) throw new Response("Flight not found", { status: 404 });
  if (!res.ok) throw new Response("Failed to load the flight", { status: 502 });
  const flight = (await res.json()) as Flight;

  // The coupon in the query string is validated and priced by the API.
  const coupon = new URL(request.url).searchParams.get("coupon");
  const q = await post(`/flights/${flight.id}/quote`, { code: coupon });
  const body = await q.json();
  const quote = q.ok ? (body as Quote) : ((await (await post(`/flights/${flight.id}/quote`, {})).json()) as Quote);
  const couponError = q.ok ? null : (body.error as string);

  return { flight, quote, couponError };
}

export async function action({ params, request }: Route.ActionArgs) {
  const form = await request.formData();
  const intent = form.get("intent");

  if (intent === "coupon") {
    const code = String(form.get("coupon") ?? "").trim();
    return redirect(code ? `/checkout/${params.flightId}?coupon=${encodeURIComponent(code)}` : `/checkout/${params.flightId}`);
  }

  const res = await post("/bookings", {
    flightId: Number(params.flightId),
    passengerName: form.get("name"),
    passengerEmail: form.get("email"),
    couponCode: form.get("appliedCoupon") || null,
  });
  const body = await res.json();
  if (!res.ok) return { error: body.error as string };
  return redirect(`/bookings/${(body as Booking).reference}`);
}

export default function Checkout({ loaderData, actionData }: Route.ComponentProps) {
  const { flight, quote, couponError } = loaderData;
  const nav = useNavigation();
  const busy = nav.state !== "idle";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
            <h1 className="text-3xl font-bold text-white">Checkout</h1>
            <p className="text-blue-100 mt-2">
              {flight.code} · {flight.origin} → {flight.destination}
            </p>
            <p className="text-blue-100 text-sm">{dateTime(flight.departureUtc)}</p>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Coupon code</h2>
              {quote.couponCode ? (
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div>
                    <p className="text-green-800 font-medium">Coupon applied: {quote.couponCode}</p>
                    <p className="text-green-600 text-sm">Discount of {quote.percent}%</p>
                  </div>
                  <Link to={`/checkout/${flight.id}`} className="text-red-600 hover:text-red-700 font-medium text-sm">
                    Remove
                  </Link>
                </div>
              ) : (
                <Form method="post" className="space-y-3">
                  <input type="hidden" name="intent" value="coupon" />
                  <div className="flex gap-2">
                    <input
                      name="coupon"
                      placeholder="Enter your code"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                    />
                    <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-red-600 text-sm">{couponError}</p>}
                  <p className="text-xs text-gray-500">Try: SAVE10, SAVE20, SUMMER25, WELCOME15</p>
                </Form>
              )}
            </section>

            <Form method="post" className="space-y-6 border-t pt-6">
              <input type="hidden" name="intent" value="book" />
              <input type="hidden" name="appliedCoupon" value={quote.couponCode ?? ""} />

              <h2 className="text-xl font-semibold text-gray-800">Passenger</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  name="name"
                  required
                  placeholder="Full name"
                  className="px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email address"
                  className="px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                />
              </div>

              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Flight price</span>
                  <span className="font-medium">{money(quote.originalCents)}</span>
                </div>
                {quote.discountCents > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({quote.couponCode})</span>
                    <span className="font-medium">-{money(quote.discountCents)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span className="text-2xl text-blue-600">{money(quote.totalCents)}</span>
                </div>
              </div>

              {actionData?.error && <p className="text-red-600 text-sm">{actionData.error}</p>}

              <button
                disabled={busy}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 shadow-lg"
              >
                {busy ? "Processing..." : "Confirm Booking"}
              </button>
            </Form>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to flights
          </Link>
        </div>
      </div>
    </div>
  );
}
