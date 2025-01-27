// app/(store)/orders/[orderNumber]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';

export async function GET(request: NextRequest, { params }: { params: { orderNumber: string } }) {
  const { orderNumber } = await params;

  if (!orderNumber) {
    return NextResponse.json({ error: 'Missing order number' }, { status: 400 });
  }

  try {
    const query = `*[_type == "order" && orderNumber == $orderNumber][0] {
      orderNumber,
      awb,
      customerName,
      email,
      address,
      invoice,
      billingAddress {
        isLegalEntity,
        companyName,
        cui,
        tradeRegisterNumber,
        companyAddress,
        companyCity,
        companyCounty,
        companyPostalCode,
        bankName,
        iban
      },
      products[] {
        product->{
          _id,
          name,
          price,
          image
        },
        quantity,
        variant { // Preia varianta selectată
          curbura,
          grosime,
          marime,
          price
        }
      },
      totalPrice,
      discount,
      promoCode,
      shippingCost,
      currency,
      paymentType,
      orderDate
    }`;
    
    

    const order = await backendClient.fetch(query, { orderNumber });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}
