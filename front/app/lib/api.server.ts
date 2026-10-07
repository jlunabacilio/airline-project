const API_URL = process.env.API_URL ?? "http://localhost:5080";

export type Flight = {
  id: number;
  code: string;
  origin: string;
  destination: string;
  departureUtc: string;
  arrivalUtc: string;
  priceCents: number;
  availableSeats: number;
};

export type Quote = {
  originalCents: number;
  discountCents: number;
  totalCents: number;
  couponCode: string | null;
  percent: number;
};

export type Booking = {
  reference: string;
  passengerName: string;
  passengerEmail: string;
  couponCode: string | null;
  originalCents: number;
  discountCents: number;
  totalCents: number;
  createdUtc: string;
  flight: Flight;
};

export async function api(path: string, init?: RequestInit) {
  try {
    return await fetch(`${API_URL}/api${path}`, {
      ...init,
      headers: { "content-type": "application/json", ...init?.headers },
    });
  } catch {
    throw new Response("Could not connect to the API (is it running at " + API_URL + "?)", {
      status: 503,
    });
  }
}

export function post(path: string, body: unknown) {
  return api(path, { method: "POST", body: JSON.stringify(body) });
}
