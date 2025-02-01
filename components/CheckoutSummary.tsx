'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import useBasketStore from '../app/(store)/store';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
// import getCustomShippingCost from '@/lib/fanCourier';
import { imageUrl } from '@/lib/imageUrl';
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname } from 'next/navigation';
import { getActiveSalesCoupons } from '@/sanity/lib/sales/getActiveSalesCoupons';
import { SignInButton, useAuth } from '@clerk/nextjs';
import { SHIPPING_COST } from '@/lib/constants';

const CheckoutSummary = () => {
  const groupedItems = useBasketStore((state) => state.getGroupedItems());
  const totalPrice = useBasketStore((state) => state.getTotalPrice());
  const savedPromoCode = useBasketStore((state) => state.promoCode);
  const savedPromoDiscount = useBasketStore((state) => state.promoDiscount);
  const pathname = usePathname();
  
  const [isLoading, setIsLoading] = useState(true);
  // const [shippingCost, setLocalShippingCost] = useState<number | null>(null);
  // const [error, setError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [availablePromoCodes, setAvailablePromoCodes] = useState<{[key: string]: number}>({});
  const { isSignedIn } = useAuth();

  // const handleCheckoutClick = (e) => {
  //   if (!isSignedIn) {
  //     e.preventDefault();
  //     // Show sign-in dialog
  //     return;
  //   }
  //   // Continue to checkout
  // };

  useEffect(() => {
  const fetchPromoCodes = async () => {
    try {
      const coupons = await getActiveSalesCoupons();
      setAvailablePromoCodes(coupons);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
    }
  };

  fetchPromoCodes();
}, []);

useEffect(() => {
  const timer = setTimeout(() => {
    setIsLoading(false);
  }, 1000);

  return () => clearTimeout(timer);
}, []);

useEffect(() => {
  if (savedPromoCode && savedPromoDiscount) {
    setPromoCode(savedPromoCode);
    setPromoDiscount(savedPromoDiscount);
    setAppliedPromo(savedPromoCode);
  }
}, [savedPromoCode, savedPromoDiscount]);

// useEffect(() => {
//   const fetchShippingCost = async () => {
//     if (!shippingAddress || !shippingAddress.city || !shippingAddress.province) {
//       setError('Adresa de livrare este incompletă.');
//       return;
//     }

//     try {
//       const cost = await getCustomShippingCost({ shipping_address: shippingAddress });
//       setLocalShippingCost(cost);
//       setShippingCost(cost);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   fetchShippingCost();
// }, [shippingAddress, setShippingCost]);

const handleApplyPromo = () => {
  setPromoError(null);
  const discount = availablePromoCodes[promoCode];
  console.log("availablePromoCodes este: ", availablePromoCodes);
  if (!promoCode) {
    setPromoError('Introduceți un cod promoțional');
    return;
  }

  if (typeof discount === 'undefined') {
    setPromoError('Cod promoțional invalid sau expirat');
    return;
  }

  setPromoDiscount(discount);
  setAppliedPromo(promoCode);
  useBasketStore.setState({ promoCode, promoDiscount: discount });
};

const handleRemovePromo = () => {
  setPromoCode('');
  setPromoDiscount(0);
  setAppliedPromo(null);
  setPromoError(null);
  useBasketStore.setState({ promoCode: null, promoDiscount: 0 });
};

  // Calculare total cu discount
  const subtotal = totalPrice;
  const discountAmount = (subtotal * promoDiscount) / 100;
  const finalTotal = subtotal - discountAmount + (SHIPPING_COST || 0);

  if (isLoading) {
    return (
      <div className="sticky top-4 bg-white p-6 rounded-lg shadow-md space-y-4">
        <Skeleton className="h-8 w-40" /> {/* Title */}
        
        {/* Product skeletons */}
        {[1, 2].map((item) => (
          <div key={item} className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}

        {/* Promo code skeleton */}
        <div className="border-t pt-4">
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Summary skeletons */}
        <div className="space-y-3 border-t pt-4">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex justify-between pt-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>

        {/* Button skeleton */}
        <Skeleton className="h-10 w-full mt-6" />
      </div>
    );
  }

  return (
    <div className="sticky top-4 bg-white p-6 rounded-lg shadow-md">
      {/* Rest of the component remains the same */}
      <h2 className="text-xl font-bold mb-4">Sumar Coș</h2>

      <div className="space-y-4">
        {/* Products */}
        {groupedItems.length > 0 ? (
          groupedItems.map((item) => (
            <div key={item.product._id} className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-4">
                {item.product.images?.[0] && (
                  <div className="w-16 h-16 relative flex-shrink-0">
                    <Image
                      src={imageUrl(item.product.images?.[0]).url()}
                      alt={item.product.name || 'Imagine Produs'}
                      className="object-cover rounded"
                      fill
                    />
                  </div>
                )}
<div className="text-sm">
  <p className="font-medium truncate">{item.product.name}</p>
  {item.variant?.curbura ? (
    <div className="text-gray-500 text-xs mt-1">
      <p>Curbura: {item.variant.curbura}</p>
      <p>Grosime: {item.variant.grosime}</p>
      <p>Mărime: {item.variant.marime}</p>
    </div>
  ) : (
    <p className="text-gray-500 text-xs mt-1">Standard</p>
  )}
  <p className="text-gray-500 text-xs mt-1">Cantitate: {item.quantity}</p>
</div>
              </div>
              <p className="font-medium">
              {((item.variant?.price ?? 0) * item.quantity).toFixed(2)} lei
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Coșul este gol</p>
        )}
      </div>

      <div className="mt-6 space-y-4">
        {/* Cod promoțional */}
        {!appliedPromo ? (
          <div className="border-b pb-4">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-700">Ai un cod promoțional?</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Introdu codul aici"
                  className="flex-1 px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-black focus:outline-none"
                />
                <Button
                  onClick={handleApplyPromo}
                  className="bg-black hover:bg-gray-800 text-white whitespace-nowrap"
                >
                  Aplică
                </Button>
              </div>
              {promoError && (
                <p className="text-red-500 text-sm mt-1">{promoError}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="border-b pb-4">
            <div className="bg-green-50 p-3 rounded-md flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-green-800">
                  Cod promoțional aplicat
                </span>
                <span className="text-sm text-green-600">
                  {appliedPromo} (-{promoDiscount}%)
                </span>
              </div>
              <button
                onClick={handleRemovePromo}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Elimină
              </button>
            </div>
          </div>
        )}

        {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}
        
        {/* Sumar costuri */}
        <div className="space-y-3 pt-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>{subtotal.toFixed(2)} lei</span>
          </div>
          
          {promoDiscount > 0 && (
            <div className="flex justify-between items-center text-sm text-green-600">
              <span>Reducere ({promoDiscount}%)</span>
              <span>-{discountAmount.toFixed(2)} lei</span>
            </div>
          )}

         
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Cost Livrare</span>
              <span>{SHIPPING_COST.toFixed(2)} lei</span>
            </div>
       

          <div className="flex justify-between items-center pt-3 border-t font-medium text-base">
            <span>Total (incl. TVA)</span>
            <span>{finalTotal.toFixed(2)} lei</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
      {isSignedIn ? (
        <Link href={pathname === "/cos" ? "/checkout" : "/cos"}>
          <Button className="w-full bg-black hover:bg-gray-800 text-white">
            {pathname === "/cos" ? "Mergi la Checkout" : "Vezi Coșul"}
          </Button>
        </Link>
      ) : (
        <div className="space-y-3">
          <SignInButton mode="modal">
            <Button className="w-full bg-black hover:bg-gray-800 text-white">
              Autentifică-te pentru Checkout
            </Button>
          </SignInButton>
          <p className="text-sm text-gray-600 text-center">
            Trebuie să fii autentificat pentru a continua cu comanda
          </p>
        </div>
      )}
    </div>
    </div>
  );
};

export default CheckoutSummary;