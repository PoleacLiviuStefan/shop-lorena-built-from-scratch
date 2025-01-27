"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Pencil } from "lucide-react";
import useBasketStore from "@/app/(store)/store";
import getCustomShippingCost from '@/lib/fanCourier';

interface ShippingProps {
  isActive: boolean;
  onComplete: () => void;
  showEditButton?: boolean;
  onEdit?: () => void;
}

const Shipping = ({ isActive, onComplete, showEditButton, onEdit  }: ShippingProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const shippingAddress = useBasketStore((state) => state.shippingAddress);
  const setShippingCost = useBasketStore((state) => state.setShippingCost);
  const shippingCost = useBasketStore((state) => state.shippingCost);

  const deliveryMethod = {
    id: "home_delivery",
    name: "Livrare la domiciliu",
    description: "Produsele vor fi livrate direct la adresa specificată",
  };

  // Calculăm costul de livrare când se schimbă adresa
  useEffect(() => {
    const fetchShippingCost = async () => {
      if (!shippingAddress || !shippingAddress.city || !shippingAddress.province) {
        setError('Adresa de livrare este incompletă.');
        return;
      }

      try {
        const cost = await getCustomShippingCost({ shipping_address: shippingAddress });
        setShippingCost(cost);
        setError(null);
      } catch (err) {
        setError('Eroare la calcularea costului de livrare.');
        console.error(err);
      }
    };

    if (mounted) {
      fetchShippingCost();
    }
  }, [shippingAddress, mounted, setShippingCost]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = () => {
    if (!shippingCost) {
      setError('Costul de livrare nu a putut fi calculat.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onComplete();
    }, 1000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Metoda de Livrare</h2>
          {!isActive && <CheckCircle className="h-5 w-5 text-green-500" />}
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
          <div className="flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all border-black shadow-sm">
            <div>
              <h3 className="font-medium">{deliveryMethod.name}</h3>
              <p className="text-sm text-gray-500">{deliveryMethod.description}</p>
              {shippingCost !== null && (
                <p className="text-sm font-medium mt-2">
                  Cost livrare: {formatPrice(shippingCost)}
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-500 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading || !shippingCost}
            className="mt-6 w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Se procesează...
              </span>
            ) : (
              "Confirmă Livrarea"
            )}
          </button>
        </div>
      ) : (
        <div className="text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-medium">Metodă selectată:</span>
            <span>{deliveryMethod.name}</span>
          </div>
          {shippingCost !== null && (
            <div className="mt-2">
              <span className="font-medium">Cost livrare:</span>{" "}
              <span>{formatPrice(shippingCost)}</span>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 border-t border-gray-200" />
    </div>
  );
};

export default Shipping;