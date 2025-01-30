import { backendClient } from "@/sanity/lib/backendClient";
import { NextRequest, NextResponse } from "next/server";
import { generateInvoice } from "@/lib/generateInvoice";
import { Product,BillingAddress,ProductVariant } from "../../types/interfaces";



export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderNumber,
      customerName,
      customerEmail,
      clerkUserId,
      products,
      totalPrice,
      currency,
      address,
      billingAddress,
      shippingCost,
      awb,
      discount,
      promoCode,
    }: {
      orderNumber: string;
      customerName: string;
      customerEmail: string;
      clerkUserId: string;
      products: Product[];
      totalPrice: number;
      currency: string;
      address: string;
      billingAddress?: BillingAddress;
      shippingCost: number;
      awb: string;
      discount: number;
      promoCode: string;
    } = body;

    if (!products?.length) throw new Error("Products missing");
    if (typeof shippingCost !== "number" || shippingCost < 0) {
      throw new Error("Invalid shipping cost");
    }

    let invoiceNumber;
    
    try {
      const items = products.map((product) => ({
        productName: product.name,
        quantity: product.quantity,
        price: product.price,
      }));

      const invoice = await generateInvoice(
        orderNumber,
        items,
        billingAddress,
        billingAddress?.isLegalEntity || false // Decide dacă este persoană juridică
      );
      invoiceNumber = invoice.number;
      console.log("Invoice:", invoice);
    } catch (error: unknown) {
      console.error("Error generating invoice:", error);
    }

    const sanityProducts = products.map((item: Product) => ({
      _key: crypto.randomUUID(),
      product: { _type: "reference", _ref: item.productId },
      quantity: item.quantity,
      variant: {
        curbura: item.variant?.curbura,
        grosime: item.variant?.grosime,
        marime: item.variant?.marime,
        price: item.variant?.price,
        stock: item.variant?.stock,
      },
    }));

    const order = await backendClient.create({
      _type: "order",
      paymentType: "Ramburs",
      orderNumber,
      customerName,
      email: customerEmail,
      clerkUserId,
      products: sanityProducts,
      totalPrice,
      discount,
      promoCode,
      shippingCost,
      currency,
      address,
      billingAddress,
      status: "In Asteptare",
      orderDate: new Date().toISOString(),
      awb,
      invoice: {
        number: invoiceNumber, // Numărul facturii
        series: process.env.SMARTBILL_SERIES_NAME, // Seria facturii
        url: "",       // Link-ul către PDF-ul facturii
      },
    });

    // Scade stocul pentru fiecare produs
    await Promise.all(
      products.map(async (item: Product) => {
        const product = await backendClient.getDocument(item.productId);

        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        const variantIndex = product.variants.findIndex(
          (v: ProductVariant) =>
            v.curbura === item.variant?.curbura &&
            v.grosime === item.variant?.grosime &&
            v.marime === item.variant?.marime
        );

        if (variantIndex === -1) {
          throw new Error(
            `Variant not found for product ${item.productId}`
          );
        }

        if (product.variants[variantIndex].stock < item.quantity) {
          throw new Error(
            `Insufficient stock for variant of product ${item.productId}`
          );
        }

        product.variants[variantIndex].stock -= item.quantity;

        await backendClient
          .patch(item.productId)
          .set({ variants: product.variants })
          .commit();
      })
    );

    return NextResponse.json({ success: true, order });
  } catch (error: unknown) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message},
      { status: 500 }
    );
  }
}
