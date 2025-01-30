import { NextRequest } from 'next/server';

interface RouteContext {
  params: {
    invoiceId: string;
  };
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  const { invoiceId } = context.params;

  if (!invoiceId) {
    return new Response('Invoice ID is required.', { status: 400 });
  }

  // Encode username:token in Base64 for Basic Authentication
  const encodedAuth = Buffer.from(
    `${process.env.SMARTBILL_USERNAME}:${process.env.SMARTBILL_API_TOKEN}`
  ).toString('base64');

  try {
    const response = await fetch(
      `https://ws.smartbill.ro/SBORO/api/invoice/pdf?cif=${process.env.SMARTBILL_VAT_CODE}&seriesName=${process.env.SMARTBILL_SERIES_NAME}&number=${invoiceId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Basic ${encodedAuth}`, // Basic Auth
          Accept: 'application/octet-stream, application/xml', // Required headers
        },
      }
    );

    if (!response.ok) {
      // Handle errors from SmartBill
      const errorText = await response.text();
      return new Response(
        `Eroare SmartBill: ${errorText || 'Nu s-a putut obține factura.'}`,
        { status: response.status }
      );
    }

    // Return the PDF buffer as a response
    const pdfBuffer = await response.arrayBuffer();

    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf', // Serve as PDF
        'Content-Disposition': `inline; filename="invoice_${invoiceId}.pdf"`, // Inline view
      },
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return new Response('Eroare server: Nu s-a putut obține factura.', {
      status: 500,
    });
  }
}