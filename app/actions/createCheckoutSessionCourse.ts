'use server'
import stripe from "@/lib/stripe";
import Stripe from "stripe";

interface CheckoutSessionParams {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  metadata: {
    userId: string | null;
    isCourse: boolean;
  }
}

export async function createCheckoutSessionCourse({
  priceId,
  successUrl,
  cancelUrl,
  metadata
}: CheckoutSessionParams): Promise<string | null> {
  try {
    // Convert all metadata values to strings for Stripe
    const stripeMetadata: Stripe.MetadataParam = {
      userId: metadata.userId?.toString() || 'anonymous',
      isCourse: metadata.isCourse.toString()
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price: priceId,
        quantity: 1
      }],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}${successUrl}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}${cancelUrl}`,
      metadata: stripeMetadata
    });

    return session.url;
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
}