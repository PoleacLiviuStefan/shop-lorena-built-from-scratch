import type { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ invoiceId?: string }> }
) {
  const { invoiceId } = await context.params;

  if (!invoiceId) {
    return new Response('Invoice ID is required.', { status: 400 });
  }

  const encodedAuth = 'bG9yZW5hbGFzaHN0dWRpb0BnbWFpbC5jb206MDAzfDIxZWQ5MzVlYWVlMTM0ZTgzMzgzNTFhYWZlYjQ5NmQy';

  try {
    const url = `https://ws.smartbill.ro/SBORO/api/invoice/pdf?cif=46510830&seriesname=LD&number=${invoiceId}`;

    console.log('Requesting invoice from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${encodedAuth}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SmartBill API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return new Response(
        `Eroare la obținerea facturii: ${response.statusText}`,
        { status: response.status }
      );
    }

    const pdfBuffer = await response.arrayBuffer();

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