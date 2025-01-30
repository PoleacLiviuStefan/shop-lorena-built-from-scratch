import { backendClient } from "@/sanity/lib/backendClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> } // params este un Promise
) {
  const { orderNumber } = await params; // Folosim `await` pentru a obține orderNumber

  try {
    // Fetch the document ID
    const orders = await backendClient.fetch(
      `*[_type == "order" && orderNumber == $orderNumber][0]._id`, 
      { orderNumber }
    );

    if (!orders) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Patch using document ID 
    await backendClient
      .patch(orders)
      .set({ status: "canceled" })
      .commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error canceling order:", error);
    return NextResponse.json(
      { error: "Failed to cancel order" }, 
      { status: 500 }
    );
  }
}
