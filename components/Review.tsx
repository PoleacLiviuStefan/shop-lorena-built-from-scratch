"use client";

import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import useBasketStore from "@/app/(store)/store";
import { useRouter } from "next/navigation";
import { createCheckoutSession } from "@/app/actions/createCheckoutSession";
import { generateAwb } from "@/lib/fanCourier";

interface ReviewProps {
  isActive: boolean;
  cart: any[];
}

const Review = ({ isActive, cart }: ReviewProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  // State pentru datele din store și cod promoțional
  const [storeData, setStoreData] = useState({
    paymentMethod: null,
    groupedItems: [],
    shippingAddress: null,
    billingAddress: null, // Adăugat aici
    shippingCost: 0,  
    promoCode: null,
    promoDiscount: 0,
    awb:""
  });

  // Hidratăm datele după montarea componentei
  useEffect(() => {
    const store = useBasketStore.getState();
    setStoreData({
      paymentMethod: store.paymentMethod,
      groupedItems: store.getGroupedItems(),
      shippingAddress: store.shippingAddress,
      billingAddress: store.billingAddress, // Adăugat aici
      shippingCost: store.shippingCost || 0,
      promoCode: store.promoCode || null,
      promoDiscount: store.promoDiscount || 0,
    });
    setMounted(true);
  }, []);

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
    });
  }, [useBasketStore((state) => state.shippingAddress), useBasketStore((state) => state.billingAddress)]); // Adaugă dependențe pentru re-render
  

  const handleCheckout = async () => {
    if (!isSignedIn) {
      console.error("User is not signed in.");
      return;
    }

    if (!storeData.paymentMethod) {
      console.error("No payment method selected.");
      return;
    }

    if (storeData.groupedItems.length === 0) {
      console.error("Cart is empty.");
      return;
    }

    if (!storeData.shippingAddress) {
      console.error("Shipping address is missing.");
      return;
    }

    setIsLoading(true);

    try {
      console.log("storeData.paymentMethod", storeData.paymentMethod);
      console.log("user este:", user);

      if (storeData.paymentMethod === "card") {
        const metadata = {
          orderNumber: crypto.randomUUID(),
          customerName: user?.fullName ?? "Necunoscut",
          customerEmail: user?.emailAddresses[0]?.emailAddress ?? "Necunoscut",
          clerkUserId: user!.id,
          promoCode: storeData.promoCode,
          promoDiscount: storeData.promoDiscount
        };

        const checkoutUrl = await createCheckoutSession(
          storeData.groupedItems,
          metadata,
          storeData.promoCode
        );

        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        }
      } else {
        await handleCashOnDelivery();
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCashOnDelivery = async () => {
    try {
      const orderNumber = crypto.randomUUID();
      const subtotal = storeData.groupedItems.reduce(
        (total, item) => total + (item.product.price ?? 0) * item.quantity,
        0
      );
      const discountAmount = storeData.promoDiscount ? (subtotal * storeData.promoDiscount) / 100 : 0;
      const finalTotal = subtotal - discountAmount + storeData.shippingCost;
  
      // Generate AWB
      const awbNumber = await generateAwb({
        cart: {
          id: orderNumber,
          shipping_address: {
            first_name: storeData.shippingAddress.firstName,
            last_name: storeData.shippingAddress.lastName,
            phone: storeData.shippingAddress.phone,
            email: user?.emailAddresses[0]?.emailAddress ?? "",
            province: storeData.shippingAddress.province,
            city: storeData.shippingAddress.city,
            address_1: storeData.shippingAddress.street,
            address_2: storeData.shippingAddress.streetNo,
            postal_code: storeData.shippingAddress.postalCode,
          },
        },
      });
      console.log("storeData este:", storeData);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cash-on-delivery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber,
          customerName: user?.fullName ?? "Unknown",
          customerEmail: user?.emailAddresses[0]?.emailAddress ?? "Unknown",
          clerkUserId: user!.id,
          products: storeData.groupedItems.map((item) => ({
            productId: item.product._id,
            name: item.product.name,        // Adăugat numele produsului
            price: item.variant?.price || item.product.price, // Preț din variantă sau din produs
            quantity: item.quantity,
            variant: item.variant ? {
              curbura: item.variant.curbura,
              grosime: item.variant.grosime,
              marime: item.variant.marime,
              price: item.variant.price,
              stock: item.variant.stock,
            } : null,
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
          awb: awbNumber
        }),
      });
  
  
      if (!response.ok) throw new Error("Error processing cash-on-delivery order.");
  
      const data = await response.json();
      router.push(`/success?orderNumber=${orderNumber}`);
    } catch (error) {
      console.error("Error handling cash-on-delivery:", error);
    }
  };
  // Nu renderăm nimic până când componenta nu e montată
  if (!mounted) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex flex-row items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Finalizare Comandă</h2>
      </div>

      {/* Afișăm informații despre reducere dacă există */}
      {storeData.promoCode && storeData.promoDiscount > 0 && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <p className="text-green-700 text-sm">
            Cod promoțional aplicat: {storeData.promoCode} (-{storeData.promoDiscount}%)
          </p>
        </div>
      )}

      <p className="lg:text-[14px] text-[12px]">
        Făcând clic pe butonul „Plasează Comanda", confirmați că ați citit,
        înțeles și acceptat Termenii de Utilizare, Termenii de Vânzare și
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