import type { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ invoiceId?: string }> }
) {
  const { invoiceId } = await context.params;

  if (!invoiceId) {
    return new Response('Invoice ID is required.', { status: 400 });
  }

  const encodedAuth = Buffer.from(
    `${process.env.SMARTBILL_USERNAME}:${process.env.SMARTBILL_API_TOKEN}`
  ).toString('base64');

  try {
    const url = `https://ws.smartbill.ro/SBORO/api/invoice/pdf?cif=${process.env.SMARTBILL_VAT_CODE}&seriesName=${process.env.SMARTBILL_SERIES_NAME}&number=${invoiceId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${encodedAuth}`,
        'Accept': 'application/octet-stream, application/xml'  // Modificat acest header conform documentației SmartBill
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SmartBill API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        requestUrl: url // Pentru debugging
      });
      return new Response(
        `Eroare la obținerea facturii: ${response.statusText}`,
        { status: response.status }
      );
    }

    // Log pentru debugging
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('Response content-type:', response.headers.get('content-type'));

    const pdfBuffer = await response.arrayBuffer();

    // Log pentru debugging
    console.log('PDF buffer size:', pdfBuffer.byteLength);

    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=factura_${invoiceId}.pdf`,
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return new Response('Eroare la descărcarea facturii', {
      status: 500
    });
  }
}