"use server";

import stripe from "@/lib/stripe";
import { imageUrl } from "@/lib/imageUrl";
import Stripe from "stripe";
// import type { BasketItem } from "../../app/store";

/** 
 * Example extended Product type if your real `sanity.types.ts` 
 * doesn't have them. Adjust as needed! 
 */
export interface Product {
  _id: string;
  name?: string;
  price?: number;            // <--- Must exist if you call item.product.price
  images?: Array<{          // <--- Or your real image type
    asset: {
      _ref: string;
      _type: "reference";
    };
    alt?: string;
  }>;
  // ... other product fields
}

/** 
 * Each line item is from your basket store, referencing a 'Product' 
 * plus a quantity. 
 */
export type GroupedBasketItem = {
  product: Product;
  quantity: number;
};

/** 
 * The checkout metadata. Must match the shape 
 * used in session.metadata or your code for coupons. 
 */
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
  promoDiscount?: number;
};

/**
 * Creates a Stripe Checkout Session 
 * and returns the session URL (string).
 */
export async function createCheckoutSession(
  items: GroupedBasketItem[],
  metadata: Metadata
): Promise<string> {
  try {
    // 1) Ensure each product has a price
    const itemsWithoutPrice = items.filter((item) => item.product.price == null);
    if (itemsWithoutPrice.length > 0) {
      throw new Error("Unul sau mai multe produse nu au preț.");
    }

    // 2) Find existing customer by email or create new
    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });
    const customerId: string | undefined = customers.data[0]?.id;

    // 3) Build the success/cancel URLs
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`;
    const cancelUrl = `${baseUrl}/cos`;

    // 4) Transform `promoCode = null` to a string if needed
    //    especially if you do something like `.toUpperCase()` 
    const safePromoCode = metadata.promoCode ?? "NOCODE";

    // 5) Create session config
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      customer_creation: customerId ? undefined : "always",
      customer_email: customerId ? undefined : metadata.customerEmail,
      metadata: {
        ...metadata,
        // If Stripe only accepts string metadata
        promoCode: safePromoCode.toUpperCase(),
        promoDiscount: String(metadata.promoDiscount ?? 0),
      },
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: items.map((item) => ({
        price_data: {
          currency: "ron",
          // product.price is definitely defined now
          unit_amount: Math.round(item.product.price! * 100),
          product_data: {
            name: item.product.name ?? "Produs fără nume",
            description: `ID Produs: ${item.product._id}`,
            metadata: {
              id: item.product._id,
            },
            // If you store multiple images in `product.images`
            images: item.product.images?.[0]
              ? [imageUrl(item.product.images[0]).url()]
              : undefined,
          },
        },
        quantity: item.quantity,
      })),
    };

    // 6) If we have a promo code & discount, create a custom coupon
    if (metadata.promoCode && metadata.promoDiscount) {
      try {
        const couponId = `${safePromoCode.toUpperCase()}_${Date.now()}`;
        const coupon = await stripe.coupons.create({
          id: couponId,
          percent_off: metadata.promoDiscount,
          duration: "once",
        });
        sessionConfig.discounts = [{ coupon: coupon.id }];
      } catch (error) {
        console.error("Eroare la crearea cuponului:", error);
        // Fallback to allowing promotion codes in Stripe
        sessionConfig.allow_promotion_codes = true;
      }
    } else {
      // No promo code => allow manual promotion codes
      sessionConfig.allow_promotion_codes = true;
    }

    // 7) Create session in Stripe
    const session = await stripe.checkout.sessions.create(sessionConfig);
    if (!session.url) {
      throw new Error("Stripe a returnat un URL de sesiune invalid.");
    }
    return session.url;
  } catch (error) {
    console.error("Eroare la crearea sesiunii de checkout:", error);
    throw error;
  }
}
