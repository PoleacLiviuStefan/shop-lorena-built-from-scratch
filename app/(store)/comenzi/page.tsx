import OrdersClient from "@/components/OrdersClient";
import { getMyOrders } from "../../../sanity/lib/getMyOrders/getMyOders";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Order, OrderStatus } from "@/components/OrdersClient";
import type { My_ORDERS_QUERYResult } from "@/sanity.types";

const transformSanityResultToOrder = (sanityOrder: My_ORDERS_QUERYResult[0]): Order => {
 return {
   _id: sanityOrder._id,
   orderNumber: sanityOrder.orderNumber || '',
   orderDate: sanityOrder.orderDate || sanityOrder._createdAt,
   status: (sanityOrder.status as OrderStatus) || "In Asteptare",
   totalPrice: sanityOrder.totalPrice || 0,
   shippingCost: sanityOrder.shippingCost || 0,
   currency: sanityOrder.currency || 'RON',
   paymentType: sanityOrder.paymentType || '',
   products: sanityOrder.products?.map(item => ({
     _key: item._key,
     product: {
       _id: item.product?._id || '',
       name: item.product?.name || '',
       price: item.variant?.price || item.product?.variants?.[0]?.price || 0,
       image: item.product?.images?.[0]?.asset?._ref || ''
     },
     quantity: item.quantity || 0,
     variant: item.variant && {
       curbura: item.variant.curbura as "M" | "C" | "D" | undefined,
       grosime: item.variant.grosime as "0.05" | "0.10" | "0.15" | undefined,
       marime: item.variant.marime as "7" | "8" | "9" | "10" | "11" | "12" | "13" | "14" | "15" | "mix" | undefined,
       price: item.variant.price,
       stock: item.variant.stock
     }
   })) || [],
  //  awb: sanityOrder.awb,
   address: sanityOrder.address && {
     firstName: sanityOrder.address.firstName || '',
     lastName: sanityOrder.address.lastName || '',
     street: sanityOrder.address.street || '',
     city: sanityOrder.address.city || '',
     province: sanityOrder.address.province || '',
     postalCode: sanityOrder.address.postalCode || ''
   },
   billingAddress: sanityOrder.billingAddress && {
     companyName: sanityOrder.billingAddress.companyName,
     cui: sanityOrder.billingAddress.cui,
     tradeRegisterNumber: sanityOrder.billingAddress.tradeRegisterNumber
   },
   invoice: sanityOrder.invoice && {
     number: sanityOrder.invoice.number || ''
   },
   amountDiscount: sanityOrder.discount
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

 const orders = ordersOrError.map(transformSanityResultToOrder);

 return <OrdersClient orders={orders} />;
};

export default Page;