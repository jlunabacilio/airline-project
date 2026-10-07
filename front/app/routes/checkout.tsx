import { useState } from "react";
import type { Route } from "./+types/checkout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Checkout - Airline" },
    { name: "description", content: "Complete your booking" },
  ];
}

const COUPON_CODES = {
  "SAVE10": 0.10,
  "SAVE20": 0.20,
  "SUMMER25": 0.25,
  "WELCOME15": 0.15,
} as const;

export default function CheckoutPage() {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState("");

  const originalPrice = 299.99;

  const handleValidateCoupon = () => {
    setError("");
    const code = couponCode.toUpperCase().trim();
    
    if (!code) {
      setError("Por favor ingresa un código de cupón");
      return;
    }

    if (code in COUPON_CODES) {
      const discountAmount = COUPON_CODES[code as keyof typeof COUPON_CODES];
      setDiscount(discountAmount);
      setAppliedCoupon(code);
      setError("");
      setCouponCode("");
    } else {
      setError("Código de cupón inválido");
      setAppliedCoupon(null);
      setDiscount(0);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode("");
    setError("");
  };

  const discountedPrice = originalPrice * (1 - discount);
  const savingsAmount = originalPrice - discountedPrice;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
            <h1 className="text-3xl font-bold text-white">Checkout</h1>
            <p className="text-blue-100 mt-2">Complete tu reserva de vuelo</p>
          </div>

          <div className="p-6 sm:p-8">
            {/* Coupon Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Código de Cupón
              </h2>
              
              {!appliedCoupon ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleValidateCoupon()}
                      placeholder="Ingresa tu código"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400"
                    />
                    <button
                      onClick={handleValidateCoupon}
                      className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Validar
                    </button>
                  </div>
                  
                  {error && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {error}
                    </div>
                  )}

                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800 font-medium mb-2">Cupones disponibles:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <span className="font-mono bg-white text-blue-700 px-2 py-1 rounded border border-blue-200">SAVE10 (10%)</span>
                      <span className="font-mono bg-white text-blue-700 px-2 py-1 rounded border border-blue-200">SAVE20 (20%)</span>
                      <span className="font-mono bg-white text-blue-700 px-2 py-1 rounded border border-blue-200">SUMMER25 (25%)</span>
                      <span className="font-mono bg-white text-blue-700 px-2 py-1 rounded border border-blue-200">WELCOME15 (15%)</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-green-800 font-medium">Cupón aplicado: {appliedCoupon}</p>
                      <p className="text-green-600 text-sm">Descuento del {(discount * 100).toFixed(0)}%</p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-red-600 hover:text-red-700 font-medium text-sm"
                  >
                    Remover
                  </button>
                </div>
              )}
            </div>

            {/* Price Summary */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Resumen de Precio
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Precio del vuelo</span>
                  <span className="font-medium">${originalPrice.toFixed(2)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento ({appliedCoupon})</span>
                    <span className="font-medium">-${savingsAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <div className="text-right">
                      {appliedCoupon && (
                        <div className="text-sm text-gray-500 line-through">
                          ${originalPrice.toFixed(2)}
                        </div>
                      )}
                      <div className="text-2xl font-bold text-blue-600">
                        ${discountedPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="mt-2 text-right">
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                        Ahorras ${savingsAmount.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <button className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg">
                Confirmar Reserva
              </button>
            </div>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="mt-6 text-center">
          <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}
