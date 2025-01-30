import stripe from "@/lib/stripe";
import { backendClient } from "@/sanity/lib/backendClient";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { generateInvoice } from "@/lib/generateInvoice";
import { clerkClient } from '@clerk/nextjs/server';

// Type guard that checks if metadata contains all required fields
function isCompleteMetadata(metadata: Stripe.Metadata | null): metadata is Stripe.Metadata & {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  billingAddress: string;
} {
  if (!metadata) return false;
  
  const requiredFields = [
    'orderNumber',
    'customerName',
    'customerEmail',
    'clerkUserId',
    'firstName',
    'lastName',
    'phone',
    'street',
    'city',
    'province',
    'postalCode',
    'billingAddress'
  ];
  
  return requiredFields.every(field => 
    typeof metadata[field] === 'string' && metadata[field] !== ''
  );
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get('stripe-signature');

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Lipsește semnătura sau secretul webhook-ului' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Eroare la construirea evenimentului webhook:', err);
    return NextResponse.json({ error: 'Semnătura webhook-ului nu a putut fi verificată' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    console.log("userIdInChckout: ", userId);
    if (userId) {
      try {
        const clerk = await clerkClient();
        await clerk.users.updateUserMetadata(userId, {
          publicMetadata: {
            hasCourseAccess: true,
          },
        });
        console.log(`Metadatele utilizatorului ${userId} au fost actualizate.`);

        await createOrderInSanity(session);
        console.log(`Comanda pentru sesiunea ${session.id} a fost creată în Sanity.`);
      } catch (err) {
        console.error(`Eroare la procesarea sesiunii ${session.id}:`, err);
        return NextResponse.json({ error: 'Eroare la procesarea sesiunii' }, { status: 500 });
      }
    } else {
      console.warn('UserId lipsește în metadatele sesiunii.');
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

async function createOrderInSanity(session: Stripe.Checkout.Session) {
  const {
    id,
    amount_total,
    currency,
    metadata,
    payment_intent,
    customer,
  } = session;

  if (!isCompleteMetadata(metadata)) {
    throw new Error('Metadata is missing required fields');
  }

  const lineItemsWithProduct = await stripe.checkout.sessions.listLineItems(id, {
    expand: ["data.price.product"],
  });

  const sanityProducts = lineItemsWithProduct.data.map((item) => {
    const product = item.price?.product as Stripe.Product;
    return {
      _key: crypto.randomUUID(),
      product: {
        _type: "reference",
        _ref: product?.metadata?.id,
      },
      quantity: item.quantity || 0,
      price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
      productName: product?.name || "Unknown Product"
    };
  });

  const billingAddress = JSON.parse(metadata.billingAddress);
  
  let invoiceNumber;
  if (billingAddress.isLegalEntity) {
    try {
      const items = sanityProducts.map(product => ({
        productName: product.productName,
        quantity: product.quantity,
        price: product.price
      }));

      const invoice = await generateInvoice(
        metadata.orderNumber,
        items,
        billingAddress,
        true
      );
      
      invoiceNumber = invoice.number;
    } catch (error) {
      console.error('Error generating invoice:', error);
    }
  }

  return await backendClient.create({
    _type: "order",
    orderNumber: metadata.orderNumber,
    paymentType: "Card",
    stripeCheckoutSessionId: id,
    stripePaymentIntentId: payment_intent,
    customerName: metadata.customerName,
    stripeCustomerId: customer,
    clerkUserId: metadata.clerkUserId,
    email: metadata.customerEmail,
    currency,
    shippingCost: metadata?.shippingCost ? parseFloat(metadata.shippingCost) : 0,
    discount: metadata?.discount,
    promoCode: metadata?.promoCode,
    products: sanityProducts,
    totalPrice: amount_total ? amount_total / 100 : 0,
    status: "Platita",
    orderDate: new Date().toISOString(),
    address: {
      firstName: metadata.firstName,
      lastName: metadata.lastName,
      email: metadata.customerEmail,
      phone: metadata.phone,
      street: metadata.street,
      city: metadata.city,
      province: metadata.province,
      postalCode: metadata.postalCode
    },
    billingAddress: billingAddress.isLegalEntity ? billingAddress : null,
    invoice: invoiceNumber
  });
}