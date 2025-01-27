// app/actions/createCheckoutSession.ts
'use server'
import stripe from "@/lib/stripe";

interface CheckoutSessionParams {
 priceId: string;
 successUrl: string;
 cancelUrl: string;
 metadata: {
   userId: string;
 }
}

// createCheckoutSessionCourse.ts
export async function createCheckoutSessionCourse({
 priceId,
 successUrl,
 cancelUrl,
 metadata
}: CheckoutSessionParams) {
 try {
   const session = await stripe.checkout.sessions.create({
     payment_method_types: ["card"],
     line_items: [{
       price: priceId, // Make sure this is a valid Stripe price ID
       quantity: 1
     }],
     mode: "payment", 
     success_url: `${process.env.NEXT_PUBLIC_BASE_URL}${successUrl}`,
     cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}${cancelUrl}`,
     metadata
   });

   return session.url;
 } catch (error) {
   console.error("Error creating session:", error);
   throw error;
 }
}