"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FileText } from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency";
import { imageUrl } from "@/lib/imageUrl";

// 1) Define all the data types you need:

/** Possible status values used throughout the code. */
export type OrderStatus =
  | "In Asteptare"
  | "platita"
  | "completed"
  | "canceled"
  | "refunded";

/** Address structure. Adjust if needed. */
export interface Address {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
}

/** Optional billing details. Adjust if needed. */
export interface BillingAddress {
  companyName?: string;
  cui?: string;
  tradeRegisterNumber?: string;
}

/** Product data. If your code references `.image`, `.name`, `.price`, ensure they're here. */
export interface ProductData {
  name: string;
  price: number;
  // If you store an image as a string or a special object, adapt it:
  image?: string; 
  // e.g. you might have: image?: { url: string } or something else
}

/** Each item in the `order.products` array. */
export interface ProductLineItem {
  _key: string;
  product: ProductData; 
  quantity: number;
  variant?: {
    curbura?: string;
    grosime?: string;
    marime?: string;
  };
}

/** Full order object. You can add or remove fields as needed. */
export interface Order {
  _id: string;
  orderNumber: string;
  awb?: string | number;
  orderDate: string;     // Must not be optional if you do `new Date(order.orderDate)`
  products: ProductLineItem[];  // Must not be optional if you do `order.products.map(...)`
  address?: Address;      // Must not be optional if you directly reference `order.address.xyz`
  billingAddress?: BillingAddress;
  totalPrice: number;    // Must not be optional if you pass it to `formatCurrency(...)`
  shippingCost: number;  // Same reason
  currency: string;      // Used in `formatCurrency(...)`
  invoice?: { number: string };
  status: OrderStatus;
  paymentType: string;
  amountDiscount?: number; // If you reference `order.amountDiscount`
}

/** Props for the OrdersClient component. It expects an array of orders. */
interface OrdersClientProps {
  orders: Order[];
}

const OrdersClient: React.FC<OrdersClientProps> = ({ orders }) => {
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<"all" | OrderStatus>("all");
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerPage = 5;

  // 2) Helper to cancel an order
  const handleCancelOrder = async (orderNumber: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/orders/${orderNumber}/cancel`, { method: "POST" });
      if (!response.ok) throw new Error("Failed to cancel order");
      console.log("Comanda a fost anulată cu succes");
      window.location.reload();
    } catch (err) {
      console.error("Error canceling order:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 3) Helper to download invoice
  const handleDownloadInvoice = async (orderNumber: string) => {
    try {
      console.log("orderNumber: ", orderNumber);
      const response = await fetch(`/invoice/${orderNumber}/download`);
      if (!response.ok) throw new Error("Failed to download invoice");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `factura_${orderNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // If you have a toast library, you can show a toast here:
      // toast.error("Eroare la descărcarea facturii");
      console.error("Eroare la descărcarea facturii:", error);
    }
  };

  // 4) Filter by status
  const filteredOrders =
    selectedStatus === "all"
      ? orders
      : orders.filter((order) => order.status === selectedStatus);

  // 5) Pagination
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as "all" | OrderStatus;
    setSelectedStatus(value);
    setCurrentPage(1);
  };

  // 6) Return a CSS class for each status
  const getStatusClass = (status: OrderStatus) => {
    switch (status) {
      case "platita":
        return "bg-green-100 text-green-800";
      case "In Asteptare":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // 7) Render
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-4 sm:p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 tracking-light mb-8">
          Comenzile Mele
        </h1>

        {/* Status Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtrează după status
          </label>
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toate</option>
            <option value="In Asteptare">În Așteptare</option>
            <option value="platita">Plătită</option>
            <option value="completed">Finalizată</option>
            <option value="canceled">Anulată</option>
            <option value="refunded">Returnată</option>
          </select>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>Nu există comenzi pentru acest status</p>
          </div>
        ) : (
          <div className="space-y-6">
            {paginatedOrders.map((order) => (
              <div
                key={order.orderNumber}
                className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  {/* Top Row: orderNumber + AWB */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1 font-bold">
                        Numărul Comenzii:{" "}
                        <span className="text-green-600">{order.orderNumber}</span>
                      </p>
                      {order.awb && (
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-bold">AWB: </span>
                          {order.awb}
                        </p>
                      )}
                    </div>
                    <div className="sm:text-right">
                      <p className="text-sm text-gray-600 mb-1">Data Comenzii</p>
                      <p className="font-medium">
                        {new Date(order.orderDate).toLocaleDateString("ro-RO")}
                      </p>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="space-y-4">
                    {order.products.map((productItem) => (
                      <div
                        key={productItem._key}
                        className="flex gap-4 border-t pt-4"
                      >
                        {/* If there's an image, show it */}
                        {productItem.product.image && (
                          <Image
                            src={imageUrl(productItem.product.image).url()}
                            alt={productItem.product.name}
                            width={80}
                            height={80}
                            className="rounded-md"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium">
                            {productItem.product.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Cantitate: {productItem.quantity}
                          </p>
                          <p className="text-sm text-gray-600">
                            Preț:{" "}
                            {formatCurrency(
                              productItem.product.price * productItem.quantity,
                              order.currency
                            )}
                          </p>
                          {productItem.variant && (
                            <div className="text-sm text-gray-600">
                              {productItem.variant.curbura && (
                                <p>Curbura: {productItem.variant.curbura}</p>
                              )}
                              {productItem.variant.grosime && (
                                <p>Grosime: {productItem.variant.grosime}</p>
                              )}
                              {productItem.variant.marime && (
                                <p>Mărime: {productItem.variant.marime}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  <div className="mt-4 pt-4 border-t">
                    <h3 className="font-medium mb-2">Adresa de livrare</h3>
                    <p className="text-sm text-gray-600">
                      {order.address?.firstName} {order.address?.lastName}
                      <br />
                      {order.address?.street}
                      <br />
                      {order.address?.city}, {order.address?.province}
                      <br />
                      {order.address?.postalCode}
                    </p>
                  </div>

                  {/* Billing Address */}
                  {order.billingAddress && (
                    <div className="mt-4 pt-4 border-t">
                      <h3 className="font-medium mb-2">Detalii Facturare</h3>
                      <p className="text-sm text-gray-600">
                        {order.billingAddress.companyName && (
                          <>
                            {order.billingAddress.companyName}
                            <br />
                          </>
                        )}
                        {order.billingAddress.cui && <>CUI: {order.billingAddress.cui}<br /></>}
                        {order.billingAddress.tradeRegisterNumber && (
                          <>Reg. Com.: {order.billingAddress.tradeRegisterNumber}<br /></>
                        )}
                      </p>
                    </div>
                  )}

                  {/* Order Totals */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Subtotal:</span>
                      <span>
                        {formatCurrency(
                          order.totalPrice - order.shippingCost,
                          order.currency
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Transport:</span>
                      <span>
                        {formatCurrency(order.shippingCost, order.currency)}
                      </span>
                    </div>
                    {typeof order.amountDiscount === "number" &&
                      order.amountDiscount > 0 && (
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Reducere:</span>
                          <span className="text-red-600">
                            -{formatCurrency(order.amountDiscount, order.currency)}
                          </span>
                        </div>
                      )}
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>
                        {formatCurrency(order.totalPrice, order.currency)}
                      </span>
                    </div>
                  </div>

                  {/* Invoice Download */}
                  {order.invoice && (
                    <div className="mt-4 pt-4 border-t">
                      <button
                        onClick={() => handleDownloadInvoice(order.orderNumber)}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Descarcă Factura #{order.invoice.number}
                      </button>
                    </div>
                  )}
                </div>

                {/* Status + Cancel Button + Payment */}
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center p-4">
                  <div className="flex items-center gap-4">
                    {/* Status Badge */}
                    <div className="flex items-center gap-1">
                      <span className="text-sm">Status:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    {/* Cancel Button if "In Asteptare" or "platita" */}
                    {(order.status === "In Asteptare" ||
                      order.status === "platita") && (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Ești sigur că vrei să anulezi această comandă?"
                            )
                          ) {
                            handleCancelOrder(order.orderNumber);
                          }
                        }}
                        disabled={isLoading}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm hover:bg-red-200 disabled:opacity-50"
                      >
                        {isLoading ? "Se anulează..." : "Anulează Comanda"}
                      </button>
                    )}
                  </div>

                  {/* Payment Method */}
                  <div className="sm:text-right">
                    <p className="text-sm text-gray-600 mb-1">Metodă de plată</p>
                    <p className="font-medium">{order.paymentType}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded-md text-[10px] lg:text-[15px] disabled:opacity-50"
              >
                Pagina Anterioară
              </button>
              <div className="text-sm font-medium text-gray-700">
                Pagina {currentPage} din {totalPages}
              </div>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded-md text-[10px] lg:text-[15px] disabled:opacity-50"
              >
                Pagina Următoare
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersClient;
