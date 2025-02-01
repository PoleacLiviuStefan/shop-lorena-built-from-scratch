import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { backendClient } from "@/sanity/lib/backendClient";

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
    console.log("session este: ", session);

    // Elimină "CODE-" din uniqueCode
    const fullCode = session.metadata?.unique_code || 'N/A';
    const uniqueCode = fullCode.replace('CODE-', '');

    const clientName = session.customer_details?.name || session.metadata?.client_name || 'N/A';
    const clientEmail = session.customer_email || session.customer_details?.email || 'N/A';
    const customFields = session.custom_fields || [];

    // Verifică dacă codul există deja
    const existingCode = await backendClient.fetch(
      `*[_type == "accessCode" && code == $uniqueCode][0]`,
      { uniqueCode }
    );

    if (existingCode) {
      console.log("Codul există deja:", existingCode);
      return NextResponse.json({
        clientName,
        clientEmail,
        uniqueCode,
        customFields,
        accessCode: existingCode._id
      });
    }

    // Crează codul de acces în Sanity doar dacă nu există
    const accessCode = await backendClient.create({
      _type: "accessCode",
      code: uniqueCode,
      isUsed: false,
      createdAt: new Date().toISOString(),
      customerDetails: {
        name: clientName,
        email: clientEmail
      }
    });



    return NextResponse.json({
      clientName,
      clientEmail,
      uniqueCode,
      customFields,
      accessCode: accessCode._id
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' }, 
      { status: 500 }
    );
  }
}