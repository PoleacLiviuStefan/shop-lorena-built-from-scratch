"use client";

import { useState, useEffect } from "react";
import { CheckCircle, CreditCard, Pencil, Wallet } from "lucide-react";
import useBasketStore from "../app/(store)/store";
import type { PaymentMethod } from "../app/(store)/store";

interface PaymentProps {
  isActive: boolean;
  onComplete: () => void;
}

const Payment = ({  isActive, onComplete, showEditButton, onEdit}: PaymentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get basket store functions
  const setPaymentMethod = useBasketStore(state => state.setPaymentMethod);
  const selectedMethod = useBasketStore(state => state.paymentMethod);

  const paymentMethods = [
    {
      id: "card" as PaymentMethod,
      name: "Plată cu cardul",
      description: "Plătește in siguranță cu cardul tău",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      id: "manual" as PaymentMethod,
      name: "Plată ramburs",
      description: "Plătește la livrare",
      icon: <Wallet className="w-5 h-5" />,
    },
  ];

  const handleSubmit = () => {
    if (!selectedMethod) {
      setError("Te rugăm să selectezi o metodă de plată");
      return;
    }
    setIsLoading(true);
    
    // Set payment method in basket store
    setPaymentMethod(selectedMethod);
    
    // Simulăm un delay pentru procesare
    setTimeout(() => {
      setIsLoading(false);
      onComplete();
    }, 1000);
  };

  useEffect(() => {
    setError(null);
  }, [selectedMethod]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Metoda de Plată</h2>
          {!isActive && selectedMethod && <CheckCircle className="h-5 w-5 text-green-500" />}
        </div>
        {showEditButton && !isActive && (
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Editează
          </button>
        )}
      </div>

      {isActive ? (
        <div>
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedMethod === method.id
                    ? "border-black shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-50 rounded-full">
                    {method.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{method.name}</h3>
                    <p className="text-sm text-gray-500">{method.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-center w-6 h-6 border rounded-full">
                  {selectedMethod === method.id && (
                    <div className="w-3 h-3 bg-black rounded-full" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-500 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading || !selectedMethod}
            className="w-full mt-6 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Se procesează...
              </span>
            ) : (
              "Continuă spre finalizare"
            )}
          </button>
        </div>
      ) : (
        selectedMethod && (
          <div className="text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">Metodă selectată:</span>
              <span>
                {
                  paymentMethods.find((method) => method.id === selectedMethod)
                    ?.name
                }
              </span>
            </div>
          </div>
        )
      )}

      <div className="mt-8 border-t border-gray-200" />
    </div>
  );
};

export default Payment;