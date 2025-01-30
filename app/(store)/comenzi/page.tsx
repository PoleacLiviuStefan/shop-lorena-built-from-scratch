import OrdersClient from "@/components/OrdersClient";
import { getMyOrders } from "../../../sanity/lib/getMyOrders/getMyOders";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Order, OrderStatus } from "@/components/OrdersClient";

// Define interfaces for Sanity data structures
interface SanityOrder {
  _id: string;
  orderNumber?: string;
  createdAt?: string;
  status?: OrderStatus;  // Use OrderStatus type from OrdersClient
  totalPrice?: number;
  shippingCost?: number;
  currency?: string;
  paymentType?: string;
  products?: SanityOrderItem[];
  awb?: string;
  address?: {
    firstName?: string;
    lastName?: string;
    street?: string;
    city?: string;
    province?: string;
    postalCode?: string;
  };
  billingAddress?: {
    companyName?: string;
    cui?: string;
    tradeRegisterNumber?: string;
  };
  invoice?: {
    number?: string;
  };
  amountDiscount?: number;
}

interface SanityOrderItem {
  _key: string;
  product: {
    name?: string;
    price?: number;
    image?: string;
  };
  quantity?: number;
  variant?: {
    curbura?: string;
    grosime?: string;
    marime?: string;
  };
}

const transformOrder = (order: SanityOrder): Order => {
  // Default status that matches OrderStatus type
  const defaultStatus: OrderStatus = "In Asteptare";

  return {
    _id: order._id,
    orderNumber: order.orderNumber || "",
    orderDate: order.createdAt || new Date().toISOString(),
    status: order.status || defaultStatus,
    totalPrice: order.totalPrice || 0,
    shippingCost: order.shippingCost || 0,
    currency: order.currency || "RON",
    paymentType: order.paymentType || "",
    products: (order.products || []).map((item) => ({
      _key: item._key,
      product: {
        name: item.product?.name || "",
        price: item.product?.price || 0,
        image: item.product?.image,
      },
      quantity: item.quantity || 1,
      variant: item.variant ? {
        curbura: item.variant.curbura,
        grosime: item.variant.grosime,
        marime: item.variant.marime,
      } : undefined,
    })),
    awb: order.awb,
    address: order.address
      ? {
          firstName: order.address.firstName || "",
          lastName: order.address.lastName || "",
          street: order.address.street || "",
          city: order.address.city || "",
          province: order.address.province || "",
          postalCode: order.address.postalCode || "",
        }
      : undefined,
    billingAddress: order.billingAddress
      ? {
          companyName: order.billingAddress.companyName || "",
          cui: order.billingAddress.cui || "",
          tradeRegisterNumber: order.billingAddress.tradeRegisterNumber || "",
        }
      : undefined,
    invoice: order.invoice
      ? {
          number: order.invoice.number || "",
        }
      : undefined,
    amountDiscount: order.amountDiscount,
  };
};

const Page = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const ordersOrError = await getMyOrders(userId);

  if (ordersOrError instanceof Error) {
    return <div>Eroare la încărcarea comenzilor</div>;
  }

  const orders: Order[] = (ordersOrError as SanityOrder[]).map(transformOrder);

  return <OrdersClient orders={orders} />;
};

export default Page;