import Stripe from 'stripe';

export async function createCheckoutSessionCourse() {
  const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-12-18.acacia',
  });

  try {
    // Generează un cod unic
    const uniqueCode = `CODE-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.NEXT_STRIPE_COURSE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment',
      custom_fields: [
        {
          key: 'judet',
          label: { type: 'custom', custom: 'Județ' },
          type: 'text',
          optional: false,
        },
        {
          key: 'localitate',
          label: { type: 'custom', custom: 'Localitate/Sector' },
          type: 'text',
          optional: false,
        },

        {
          key: 'detalii_adresa',
          label: { type: 'custom', custom: 'Bloc, Scara, Etaj, Ap., Nr.' },
          type: 'text',
          optional: false,
        },
      ],
      metadata: {
        unique_code: uniqueCode, // Salvează codul unic în metadata
        client_name: 'John Doe', // Poți salva și alte detalii
      },
      
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cursuri/curs-online-feline-effect/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cursuri/curs-online-feline-effect`,
    });

    return session.url; // Returnează URL-ul sesiunii pentru redirecționare
  } catch (error) {
    console.error('Eroare la crearea sesiunii de checkout:', error);
    throw new Error('Nu am putut crea sesiunea de checkout. Vă rugăm să încercați din nou.');
  }
}
