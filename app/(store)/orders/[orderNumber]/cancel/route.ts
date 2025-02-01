import { backendClient } from "@/sanity/lib/backendClient";
import { NextRequest, NextResponse } from "next/server";

interface ProductVariant {
  curbura?: string;
  grosime?: string;
  marime?: string;
  price: number;
  stock: number;
}

interface OrderProduct {
  product: {
    _id: string;
    name: string;
    price: number;
    images: Array<{
      _key: string;
      _type: string;
      alt: string;
      asset: {
        _ref: string;
        _type: string;
      };
    }>;
  };
  quantity: number;
  variant?: ProductVariant;
}

interface Address {
  city: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  postalCode: string;
  province: string;
  street: string;
}

interface BillingAddress {
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
}

interface Order {
  orderNumber: string;
  // awb: number;
  paymentType: string;
  status: string;
  orderDate: string;
  invoice: {
    number: string;
    series: string;
    url: string;
  };
  customerName: string;
  email: string;
  address: Address;
  billingAddress: BillingAddress;
  products: OrderProduct[];
  totalPrice: number;
  discount: number;
  promoCode: string;
  shippingCost: number;
  currency: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params;

  try {
    const order = await backendClient.fetch<Order>(`
      *[_type == "order" && orderNumber == $orderNumber][0]{
        orderNumber,
        awb,
        paymentType,
        status,
        orderDate,
        invoice,
        customerName,
        email,
        address,
        billingAddress,
        totalPrice,
        discount,
        promoCode,
        shippingCost,
        currency,
        "products": products[]{
          quantity,
          variant,
          "product": product->{
            _id,
            name,
            "price": variant.price,
            images
          }
        }
      }`,
      { orderNumber }
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Transform order to match the expected format
    const transformedOrder = {
      ...order,
      products: order.products.map((item: OrderProduct) => ({
        ...item,
        product: {
          ...item.product,
          image: item.product.images[0].asset._ref
        }
      }))
    };

    return NextResponse.json(transformedOrder);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" }, 
      { status: 500 }
    );
  }
}