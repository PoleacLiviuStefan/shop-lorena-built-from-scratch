"use client";

import React, { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import useBasketStore from "@/app/(store)/store";
import { useRouter } from "next/navigation";
import { createCheckoutSession } from "../app/actions/createCheckoutSession";
import type { Metadata } from "../app/actions/createCheckoutSession";
import { generateAwb } from "@/lib/fanCourier";
import type { PaymentMethod, BasketItem, Address, BillingAddress } from "@/app/(store)/store";

interface StoreData {
  paymentMethod: PaymentMethod;
  groupedItems: BasketItem[];
  shippingAddress: Address | null;
  billingAddress: BillingAddress | null;
  shippingCost: number;
  promoCode: string | null;
  promoDiscount: number;
  awb: string;
}

interface ReviewProps {
  isActive: boolean;
}

const Review: React.FC<ReviewProps> = ({ isActive }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const [storeData, setStoreData] = useState<StoreData>({
    paymentMethod: null,
    groupedItems: [],
    shippingAddress: null,
    billingAddress: null,
    shippingCost: 0,
    promoCode: null,
    promoDiscount: 0,
    awb: "",
  });

  useEffect(() => {
    const store = useBasketStore.getState();
    setStoreData({
      paymentMethod: store.paymentMethod,
      groupedItems: store.getGroupedItems(),
      shippingAddress: store.shippingAddress,
      billingAddress: store.billingAddress,
      shippingCost: store.shippingCost || 0,
      promoCode: store.promoCode || null,
      promoDiscount: store.promoDiscount || 0,
      awb: "",
    });
    setMounted(true);
  }, []);

  const shippingAddressInStore = useBasketStore((s) => s.shippingAddress);
  const billingAddressInStore = useBasketStore((s) => s.billingAddress);
  const shippingCostInStore = useBasketStore((s) => s.shippingCost);
  const promoCodeInStore = useBasketStore((s) => s.promoCode);
  const promoDiscountInStore = useBasketStore((s) => s.promoDiscount);

  useEffect(() => {
    const store = useBasketStore.getState();
    setStoreData((prev) => ({
      ...prev,
      shippingAddress: store.shippingAddress,
      billingAddress: store.billingAddress,
      shippingCost: store.shippingCost || 0,
      promoCode: store.promoCode || null,
      promoDiscount: store.promoDiscount || 0,
    }));
  }, [
    shippingAddressInStore,
    billingAddressInStore,
    shippingCostInStore,
    promoCodeInStore,
    promoDiscountInStore,
  ]);

  const handleCheckout = async () => {
    if (!isSignedIn || !storeData.paymentMethod || !storeData.shippingAddress) {
      console.error("Date lipsă pentru checkout");
      return;
    }

    setIsLoading(true);

    try {
      if (storeData.paymentMethod === "card") {
        const metadata: Metadata = {
          orderNumber: crypto.randomUUID(),
          customerName: user?.fullName ?? "Unknown",
          customerEmail: user?.emailAddresses[0]?.emailAddress ?? "Unknown",
          clerkUserId: user?.id ?? "",
          shippingCost: storeData.shippingCost.toString(),
          firstName: storeData.shippingAddress.firstName,
          lastName: storeData.shippingAddress.lastName,
          phone: storeData.shippingAddress.phone,
          street: storeData.shippingAddress.street,
          city: storeData.shippingAddress.city,
          province: storeData.shippingAddress.province,
          postalCode: storeData.shippingAddress.postalCode,
          promoCode: storeData.promoCode,
          promoDiscount: storeData.promoDiscount,
        };

        const transformedItems = storeData.groupedItems.map((item) => ({
          ...item,
          product: {
            ...item.product,
            images: item.product.images?.map((image) => ({
              asset: {
                _ref: image.asset?._ref || "",
                _type: image.asset?._type || "reference",
              },
              alt: image.alt,
            })),
          },
        }));

        const checkoutUrl = await createCheckoutSession(transformedItems, metadata);
        if (checkoutUrl) window.location.href = checkoutUrl;
      } else {
        await handleCashOnDelivery();
      }
    } catch (err) {
      console.error("Eroare la checkout:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCashOnDelivery = async () => {
    try {
      const orderNumber = crypto.randomUUID();
      const subtotal = storeData.groupedItems.reduce((total, item) => {
        return total + (item.variant?.price ?? 0) * item.quantity;
      }, 0);

      const discountAmount = storeData.promoDiscount
        ? (subtotal * storeData.promoDiscount) / 100
        : 0;
      const finalTotal = subtotal - discountAmount + storeData.shippingCost;

      const awbNumber = await generateAwb({
        cart: {
          id: orderNumber,
          shipping_address: {
            first_name: storeData.shippingAddress?.firstName || "",
            last_name: storeData.shippingAddress?.lastName || "",
            phone: storeData.shippingAddress?.phone || "",
            email: user?.emailAddresses[0]?.emailAddress ?? "",
            province: storeData.shippingAddress?.province || "",
            city: storeData.shippingAddress?.city || "",
            address_1: storeData.shippingAddress?.street || "",
            address_2: "",
            postal_code: storeData.shippingAddress?.postalCode || "",
          },
        },
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cash-on-delivery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber,
          customerName: user?.fullName ?? "Unknown",
          customerEmail: user?.emailAddresses[0]?.emailAddress ?? "Unknown",
          clerkUserId: user?.id,
          products: storeData.groupedItems.map((item) => ({
            productId: item.product._id,
            name: item.product.name,
            price: item.variant?.price ?? 0,
            quantity: item.quantity,
            variant: item.variant
              ? {
                  curbura: item.variant.curbura,
                  grosime: item.variant.grosime,
                  marime: item.variant.marime,
                  price: item.variant.price,
                  stock: item.variant.stock,
                }
              : null,
          })),
          promoCode: storeData.promoCode,
          discount: storeData.promoDiscount,
          subtotal,
          discountAmount,
          shippingCost: storeData.shippingCost,
          totalPrice: finalTotal,
          currency: "RON",
          address: storeData.shippingAddress,
          billingAddress: storeData.billingAddress,
          awb: awbNumber,
        }),
      });

      if (!response.ok) throw new Error("Eroare procesare comandă ramburs");
      router.push(`/success?orderNumber=${orderNumber}`);
    } catch (err) {
      console.error("Eroare la ramburs:", err);
    }
  };

  if (!mounted || !isActive) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex flex-row items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Finalizare Comandă</h2>
      </div>

      {storeData.promoCode && storeData.promoDiscount > 0 && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <p className="text-green-700 text-sm">
            Cod promoțional aplicat: {storeData.promoCode} (-{storeData.promoDiscount}%)
          </p>
        </div>
      )}

      <p className="lg:text-[14px] text-[12px]">
        Făcând clic pe butonul &quot;Plasează Comanda&quot;, confirmați că ați
        citit, înțeles și acceptat Termenii de Utilizare, Termenii de Vânzare și
        Politica de Retur și recunoașteți că ați citit Politica de
        Confidențialitate a magazinului LorenaLash.
      </p>

      <button
        onClick={handleCheckout}
        disabled={isLoading}
        className="w-full mt-8 bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              aria-label="Se încarcă"
            />
            Se procesează...
          </span>
        ) : (
          "Finalizează Comanda"
        )}
      </button>
    </div>
  );
};

export default Review;