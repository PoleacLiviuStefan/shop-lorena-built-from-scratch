'use server'

import stripe from "@/lib/stripe";
import { BasketItem } from "../(store)/store";
import { imageUrl } from "@/lib/imageUrl";
import Stripe from "stripe";

export type Metadata = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
  shippingCost: string;
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  promoCode: string | null;
  promoDiscount?: number; // Adăugat promoDiscount
};

export type GroupedBasketItem = {
  product: BasketItem["product"];
  quantity: number;
};

export async function createCheckoutSession(
  items: GroupedBasketItem[],
  metadata: Metadata,
): Promise<string> { // Am schimbat returnul la string pentru URL
  try {
    const itemsWithoutPrice = items.filter((item) => !item.product.price);
    if (itemsWithoutPrice.length > 0) {
      throw new Error("Unul sau mai multe produse nu au pret");
    }

    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });

    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`;
    const cancelUrl = `${baseUrl}/cos`;

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      customer_creation: customerId ? undefined : "always",
      customer_email: !customerId ? metadata.customerEmail : undefined,
      metadata: {
        ...metadata,
        promoCode: metadata.promoCode || '',
        promoDiscount: metadata.promoDiscount?.toString() || '0',
      },
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: items.map((item) => ({
        price_data: {
          currency: "ron",
          unit_amount: Math.round(item.product.price! * 100),
          product_data: {
            name: item.product.name || "Produs fara nume",
            description: `ID Produs: ${item.product._id}`,
            metadata: {
              id: item.product._id,
            },
            images: item.product.image
              ? [imageUrl(item.product.image).url()]
              : undefined,
          },
        },
        quantity: item.quantity,
      })),
    };

    // Verificăm dacă avem un cod promoțional valid
    if (metadata.promoCode && metadata.promoDiscount) {
      try {
        // Generăm un ID unic pentru cupon
        const couponId = `${metadata.promoCode.toUpperCase()}_${Date.now()}`;
        
        // Creăm cuponul
        const coupon = await stripe.coupons.create({
          id: couponId,
          percent_off: metadata.promoDiscount,
          duration: 'once',
        });

        // Adăugăm discount-ul la sesiune
        sessionConfig.discounts = [{
          coupon: coupon.id,
        }];
      } catch (error) {
        console.error('Eroare la crearea cuponului:', error);
        // Dacă eșuează crearea cuponului, permitem coduri promoționale native
        sessionConfig.allow_promotion_codes = true;
      }
    } else {
      // Dacă nu avem cod promoțional, permitem coduri native Stripe
      sessionConfig.allow_promotion_codes = true;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);
    return session.url;
  } catch (error) {
    console.error("Eroare la crearea sesiunii de checkout:", error);
    throw error;
  }
}