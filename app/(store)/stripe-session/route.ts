import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-12-18.acacia',
});


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID missing' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Extrage codul unic și alte informații
    console.log("session este: ",session )
    const uniqueCode = session.metadata?.unique_code || 'N/A';
    const clientName = session.customer_details?.name || session.metadata?.client_name || 'N/A';
    const clientEmail = session.customer_email || session.customer_details?.email || 'N/A';
    const customFields = session.custom_fields || [];
    return NextResponse.json({
      clientName,
      clientEmail,
      uniqueCode,
      customFields
    });
  } catch (error) {
    console.error('Error retrieving Stripe session:', error);
    return NextResponse.json({ error: 'Failed to retrieve session' }, { status: 500 });
  }
}
