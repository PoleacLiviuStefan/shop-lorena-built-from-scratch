import { backendClient } from "@/sanity/lib/backendClient";
import { NextRequest, NextResponse } from "next/server";
import { generateInvoice } from "@/lib/generateInvoice";
import { Product, BillingAddress, ProductVariant } from "../../types/interfaces";

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
        billingAddress?.isLegalEntity || false
      );
      invoiceNumber = invoice.number;
      console.log("Invoice:", invoice);
    } catch (error: unknown) {
      console.error("Error generating invoice:", error);
    }

    const sanityProducts = products.map((item: Product) => {
      const baseProduct = {
        _key: crypto.randomUUID(),
        product: { _type: "reference", _ref: item.productId },
        quantity: item.quantity,
      };

      // Verificăm dacă produsul are variant cu proprietăți specifice
      if (item.variant?.curbura || item.variant?.grosime || item.variant?.marime) {
        return {
          ...baseProduct,
          variant: {
            curbura: item.variant.curbura,
            grosime: item.variant.grosime,
            marime: item.variant.marime,
            price: item.variant.price,
            stock: item.variant.stock,
          },
        };
      } else if (item.variant?.price) {
        // Pentru variante simple care au doar preț și stoc
        return {
          ...baseProduct,
          variant: {
            price: item.variant.price,
            stock: item.variant.stock,
          },
        };
      }

      // Dacă nu există variant, returnăm doar produsul de bază
      return baseProduct;
    });

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
        number: invoiceNumber,
        series: process.env.SMARTBILL_SERIES_NAME,
        url: "",
      },
    });

    // Scade stocul pentru fiecare produs
    await Promise.all(
      products.map(async (item: Product) => {
        const product = await backendClient.getDocument(item.productId);
        console.log("product este: ", product);

        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        // Verificăm dacă produsul are variante simple (doar price și stock)
        const hasSimpleVariants = product.variants?.length > 0 && 
          !product.variants[0].curbura && 
          !product.variants[0].grosime && 
          !product.variants[0].marime;

        if (hasSimpleVariants) {
          // Cazul 1: Produs cu variantă simplă (doar price și stock)
          const variant = product.variants[0]; // Luăm prima variantă pentru că e singura

          if (variant.stock < item.quantity) {
            throw new Error(
              `Insufficient stock for product ${item.productId}`
            );
          }

          variant.stock -= item.quantity;

          await backendClient
            .patch(item.productId)
            .set({ variants: [variant] })
            .commit();
        } else if (product.variants && product.variants.length > 0) {
          // Cazul 2: Produs cu variante complete (curbura, grosime, marime)
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
        } else {
          // Cazul 3: Produs fără variante
          if (product.stock < item.quantity) {
            throw new Error(
              `Insufficient stock for product ${item.productId}`
            );
          }

          await backendClient
            .patch(item.productId)
            .set({ stock: product.stock - item.quantity })
            .commit();
        }
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