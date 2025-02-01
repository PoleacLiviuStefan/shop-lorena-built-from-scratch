"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useBasketStore from "../store";
import { imageUrl } from "@/lib/imageUrl";
import Image from "next/image";
import { updateProductStock } from "@/lib/updateProductStock";
import { FileText } from "lucide-react";

interface BillingAddress {
  isLegalEntity: boolean;
  companyName?: string;
  cui?: string;
  tradeRegisterNumber?: string;
  companyAddress?: string;
  companyCounty?: string;
  companyCity?: string;
  companyPostalCode?: string;
  bankName?: string;
  iban?: string;
}

interface OrderDetails {
  orderNumber: string;
  awb?: string;
  totalPrice: number;
  currency: string;
  paymentType: string;
  customerName: string;
  discount?: number;
  promoCode?: string;
  shippingCost: number;
  invoice?: {
    number: string;
  };
  address: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  products: Array<{
    product: {
      _id: string;
      name: string;
      price: number;
      image: string;
    };
    variant?: {
      curbura: string;
      grosime: string;
      marime: string;
    };
    quantity: number;
  }>;
  billingAddress?: BillingAddress;
}

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const emailSentRef = useRef(false);
  const stockUpdatedRef = useRef(false);
  const clearBasket = useBasketStore((store) => store.clearBasket);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/orders/${orderNumber}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
      
        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }

        const data = await response.json();
        console.log("data este: ",data)
        setOrderDetails(data);
        
        if (!stockUpdatedRef.current) {
          const result = await updateProductStock(data.products);
          if (!result.success) {
            console.error("Eroare la actualizarea stocului:", result.error);
          }
          stockUpdatedRef.current = true;
        }

        if (!emailSentRef.current && data) {
          await sendEmail(data);
          emailSentRef.current = true;
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
        clearBasket();
      }
    };

    if (orderNumber) {
      fetchOrderDetails();
    } else {
      setError("Order number not found");
      setLoading(false);
    }
  }, [orderNumber, clearBasket]);

  const handleDownloadInvoice = async (invoiceNumber: string) => {
    try {
      const response = await fetch(`/invoice/${invoiceNumber}/download`, {
        headers: {
          'Accept': 'application/pdf',  // Specificăm explicit că acceptăm PDF
        },
      });
      
      if (!response.ok) {
        console.error('Download failed:', response.status, response.statusText);
        throw new Error(`Failed to download invoice: ${response.statusText}`);
      }
  
      const blob = await response.blob();
      
      // Verificăm dacă blob-ul este gol
      if (blob.size === 0) {
        throw new Error('Received empty response');
      }
  
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none'; // Ascundem elementul
      a.href = url;
      a.download = `factura_${invoiceNumber}.pdf`;
      
      // Adăugăm la document, declanșăm click și apoi curățăm
      document.body.appendChild(a);
      a.click();
      
      // Curățare după descărcare
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
  
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Nu s-a putut descărca factura. Vă rugăm încercați din nou mai târziu.');
    }
  };
  const sendEmail = async (details: OrderDetails) => {
    try {
      const emailData = {
        order_id: details.orderNumber,
        order_awb: details.awb,
        order_date: new Date().toLocaleDateString(),
        payment_method: details.paymentType === "card" ? "Card" : "Ramburs",
        order_total: `${details.totalPrice.toFixed(2)} ${details.currency}`,
        order_discount: details.discount,
        order_promo_code: details.promoCode,
        order_products_total: `${(details.totalPrice - details.shippingCost).toFixed(2)} ${details.currency}`,
        order_shipping_cost: `${details.shippingCost.toFixed(2)} ${details.currency}`,
        order_products: details.products.map((product) => (
          `${product.product.name} - ${
            product?.variant?.curbura && product.variant.curbura.trim() !== '' ? 
              `Curbura: ${product.variant.curbura}, Grosime: ${product.variant.grosime}, Mărime: ${product.variant.marime}` 
              : "Standard"
          } - Cantitate: ${product.quantity}`
        )).join("\n"),
        client_last_name: details.address.lastName,
        client_first_name: details.address.firstName,
        client_email: details.address.email,
        client_phone: details.address.phone,
        client_province: details.address.province,
        client_locality: details.address.city,
        client_address: details.address.street,
        invoice_url: details.invoice ? 
          `${process.env.NEXT_PUBLIC_BASE_URL}/invoice/${details.invoice.number}/download` : 
          null,
        client_type: details.billingAddress?.isLegalEntity ? "Persoană Juridică" : "Persoană Fizică",
        company_name: details.billingAddress?.companyName || "",
        company_CUI: details.billingAddress?.cui || "",
        comany_registry: details.billingAddress?.tradeRegisterNumber || "",
        company_address: details.billingAddress?.companyAddress || "",
        company_province: details.billingAddress?.companyCounty || "",
        company_city: details.billingAddress?.companyCity || "",
        company_postal_code: details.billingAddress?.companyPostalCode || "",
        company_bank_name: details.billingAddress?.bankName || "",
        company_IBAN: details.billingAddress?.iban || ""
      };

      const notificationData = {
        client_last_name: details.address.lastName,
        client_first_name: details.address.firstName,
        client_email: details.address.email,
        order_id: details.orderNumber,
        order_discount: details.discount,
        order_promo_code: details.promoCode,
        order_products: emailData.order_products,
        // awb: details.awb,
        invoice_url: emailData.invoice_url,
        order_total: emailData.order_total,
        order_products_total: emailData.order_products_total,
        order_shipping_cost: emailData.order_shipping_cost,
      };

      await Promise.all([
        emailjs.send("service_5kulkwh", "template_soo87le", emailData, "uSA0IVA9aGhfzQfPC"),
        emailjs.send("service_5kulkwh", "template_kbk4s1r", notificationData, "uSA0IVA9aGhfzQfPC")
      ]);

      console.log("Emailuri trimise cu succes!");
    } catch (error) {
      console.error("Eroare la trimiterea emailurilor:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Se încarcă...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Eroare: {error}</p>
      </div>
    );
  }

  if (!orderDetails) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-12 rounded-xl shadow-lg max-w-3xl w-full mx-4">
        <div className="flex justify-center mb-8">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-6 text-center">
          Mulțumim pentru comandă!
        </h1>
        <div className="border-t border-b border-gray-200 py-6 mb-6">
          <p className="text-lg text-gray-700 mb-4">
            Comanda ta a fost înregistrată cu succes.
          </p>
          {orderDetails.invoice?.number && (
            <button 
              onClick={() => handleDownloadInvoice(orderDetails.invoice!.number)}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <FileText className="w-4 h-4 mr-2" />
              Descarcă Factura
            </button>
          )}

          <div className="space-y-2">
            <p className="text-gray-600">
              <strong>Număr comandă:</strong> {orderDetails.orderNumber}
            </p>
            <p className="text-gray-600">
              <strong>Client:</strong> {orderDetails.address.lastName} {orderDetails.address.firstName}
            </p>
            <p className="text-gray-600">
              <strong>Email:</strong> {orderDetails.address.email}
            </p>
            <p className="text-gray-600">
              <strong>Adresă de livrare:</strong>{" "}
              {`${orderDetails.address.street}, ${orderDetails.address.city}, ${orderDetails.address.province}, ${orderDetails.address.postalCode}`}
            </p>
            <p className="text-gray-600">
              <strong>Metodă de plată:</strong>{" "}
              {orderDetails.paymentType === "card" ? "Card" : "Ramburs"}
            </p>
            {orderDetails.awb && (
              <p className="text-gray-600">
                <strong>AWB:</strong> {orderDetails.awb}
              </p>
            )}
            {orderDetails.billingAddress?.cui && (
              <>
                <p className="text-gray-600">
                  <strong>CUI:</strong> {orderDetails.billingAddress.cui}
                </p>
                <p className="text-gray-600">
                  <strong>Companie:</strong> {orderDetails.billingAddress.companyName}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Produse comandate</h2>
          <ul className="space-y-4">
            {orderDetails.products.map((product) => (
              <li
                key={product.product._id}
                className="flex justify-between items-center"
              >
                <div>
                  <Image
                    src={imageUrl(product.product.image).url()}
                    alt={product.product.name}
                    width={80}
                    height={80}
                    className="object-cover rounded"
                  />
                  <p className="font-medium text-gray-900 uppercase">
                    {product.product.name}
                  </p>
                  {product?.variant?.curbura && product.variant.curbura.trim() !== ''  ? (
                    <div className="text-sm text-gray-600 mt-1">
                      <p>Curbura: {product.variant.curbura}</p>
                      <p>Grosime: {product.variant.grosime}</p>
                      <p>Mărime: {product.variant.marime}</p>
                    </div>
                  ) : ( 
                    <p className="text-sm text-gray-600 mt-1">Standard</p>
                  )}
                  <p className="text-sm text-gray-600">
                    Cantitate: {product.quantity}
                  </p>
                </div>
                <p className="text-gray-700">
                  {(product.product.price * product.quantity).toFixed(2)}{" "}
                  {orderDetails.currency}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Cost livrare:</span>
            <span className="text-gray-800 font-medium">
              {orderDetails.shippingCost.toFixed(2)} {orderDetails.currency}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Total produse:</span>
            <span className="text-gray-800 font-medium">
              {(orderDetails.totalPrice - orderDetails.shippingCost).toFixed(2)} {orderDetails.currency}
            </span>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <span>Total de plată:</span>
            <span>
              {orderDetails.totalPrice.toFixed(2)} {orderDetails.currency}
            </span>
          </div>
        </div>

        <div className="space-y-4 mt-8">
          <p className="text-gray-600">A fost trimis un email de confirmare!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/comenzi">Vezi detaliile comenzii</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Înapoi la magazin</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;