import type { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ invoiceId?: string }> }
) {
  const { invoiceId } = await context.params; // Folosim await pentru a accesa `params`

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
          Authorization: `Basic ${encodedAuth}`,
          Accept: 'application/octet-stream, application/xml',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        `Eroare SmartBill: ${errorText || 'Nu s-a putut obține factura.'}`,
        { status: response.status }
      );
    }

    const pdfBuffer = await response.arrayBuffer();

    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="invoice_${invoiceId}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return new Response('Eroare server: Nu s-a putut obține factura.', {
      status: 500,
    });
  }
}
