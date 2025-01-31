import { backendClient } from "@/sanity/lib/backendClient";
import { NextRequest, NextResponse } from "next/server";


interface OrderDetails {
 orderNumber: string;
 awb: number; 
 paymentType: string;
 status: string;
 orderDate: string;
 invoice?: {
   number: string;
   series: string;
   url: string;
 };
 customerName: string;
 email: string;
 address?: {
   firstName: string;
   lastName: string;
   email: string;
   phone: string; 
   street: string;
   city: string;
   province: string;
   postalCode: string;
 };
 billingAddress?: {
   isLegalEntity: boolean;
   companyName?: string;
   cui?: string;
   tradeRegisterNumber?: string;
   companyAddress?: string;
   companyCity?: string;
   companyCounty?: string;
   companyPostalCode?: string;
   bankName?: string;
   iban?: string;
 };
 products: Array<{
   _key: string;
   quantity: number;
   variant?: {
     curbura?: "M" | "C" | "D"; 
     grosime?: "0.05" | "0.10" | "0.15";
     marime?: "7" | "8" | "9" | "10" | "11" | "12" | "13" | "14" | "15" | "mix";
     price: number;
     stock: number;
   };
   product: {
     _id: string;
     name: string;
     price: number;
     image: string;
   };
 }>;
 totalPrice: number;
 shippingCost: number;
 currency: string;
 discount?: number;
 promoCode?: string;
}

export async function GET(
 req: NextRequest,
 { params }: { params: Promise<{ orderNumber: string }> }
) {
 const { orderNumber } = await params;

 try {
   const order = await backendClient.fetch<OrderDetails>(`
     *[_type == "order" && orderNumber == $orderNumber][0] {
       orderNumber,
       awb,
       paymentType,
       status,
       orderDate,
       invoice {
         number,
         series,
         url
       },
       customerName,
       email,
       "address": {
         "firstName": address.firstName,
         "lastName": address.lastName,
         "email": address.email,
         "phone": address.phone,
         "street": address.street,
         "city": address.city,
         "province": address.province,
         "postalCode": address.postalCode
       },
       "billingAddress": {
         "isLegalEntity": billingAddress.isLegalEntity,
         "companyName": billingAddress.companyName,
         "cui": billingAddress.cui,
         "tradeRegisterNumber": billingAddress.tradeRegisterNumber,
         "companyAddress": billingAddress.companyAddress,
         "companyCity": billingAddress.companyCity,
         "companyCounty": billingAddress.companyCounty,
         "companyPostalCode": billingAddress.companyPostalCode,
         "bankName": billingAddress.bankName,
         "iban": billingAddress.iban
       },
       "products": products[] {
         _key,
         quantity,
         variant,
         "product": {
           "_id": product->._id,
           "name": product->name,
           "price": coalesce(variant.price, product->variants[0].price),
           "image": product->images[0].asset._ref
         }
       },
       totalPrice,
       shippingCost,
       currency,
       discount,
       promoCode
     }`,
     { orderNumber }
   );

   if (!order) {
     return NextResponse.json({ error: "Order not found" }, { status: 404 });
   }

   return NextResponse.json(order);
 } catch (error) {
   console.error("Error fetching order:", error);
   return NextResponse.json(
     { error: "Failed to fetch order" }, 
     { status: 500 }
   );
 }
}