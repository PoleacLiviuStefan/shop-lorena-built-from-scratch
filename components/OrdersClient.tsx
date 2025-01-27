"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/formatCurrency";
import { imageUrl } from "@/lib/imageUrl";
import Image from "next/image";
import { FileText } from "lucide-react";

const OrdersClient = ({ orders }) => {
 const [currentPage, setCurrentPage] = useState(1);
 const [selectedStatus, setSelectedStatus] = useState("all");
 const [isLoading, setIsLoading] = useState(false);
 const itemsPerPage = 5;

 const handleCancelOrder = async (orderNumber: string) => {
   setIsLoading(true);
   try {
     const response = await fetch(`/orders/${orderNumber}/cancel`, {
       method: 'POST',
     });
     
     if (!response.ok) {
       throw new Error('Failed to cancel order');
     }

     console.log('Comanda a fost anulată cu succes');
     window.location.reload();
   } catch (error) {
     console.error('Error canceling order:', error);
     console.log('A apărut o eroare la anularea comenzii');
   } finally {
     setIsLoading(false);
   }
 };

 const handleDownloadInvoice = async (orderNumber: string) => {
  try {
    console.log("orderNumber: ", orderNumber);
    const response = await fetch(`/invoice/${orderNumber}/download`);
    if (!response.ok) throw new Error('Failed to download invoice');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `factura_${orderNumber}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    toast.error('Eroare la descărcarea facturii');
  }
};

 const filteredOrders =
   selectedStatus === "all"
     ? orders
     : orders.filter((order) => order.status === selectedStatus);

 const paginatedOrders = filteredOrders.slice(
   (currentPage - 1) * itemsPerPage,
   currentPage * itemsPerPage
 );
 console.log("orderFiltered arata asaL", filteredOrders);
 const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

 const handleNextPage = () => {
   if (currentPage < totalPages) setCurrentPage(currentPage + 1);
 };

 const handlePreviousPage = () => {
   if (currentPage > 1) setCurrentPage(currentPage - 1);
 };

 const handleStatusChange = (event) => {
   setSelectedStatus(event.target.value);
   setCurrentPage(1);
 };

 const getStatusClass = (status) => {
   switch (status) {
     case "platita":
       return "bg-green-100 text-green-800";
     case "In Asteptare":
       return "bg-yellow-100 text-yellow-800";
     case "completed":
       return "bg-blue-100 text-blue-800";
     case "canceled":
       return "bg-red-100 text-red-800";
     default:
       return "bg-gray-100 text-gray-800";
   }
 };

 return (
   <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
     <div className="bg-white p-4 sm:p-8 rounded-lg shadow-md w-full max-w-4xl">
       <h1 className="text-4xl font-bold text-gray-900 tracking-light mb-8">
         Comenzile Mele
       </h1>

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
             <div key={order.orderNumber} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
               {/* Order Header */}
               <div className="p-4 sm:p-6 border-b border-gray-200">
                 <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-4">
                   <div>
                     <p className="text-sm text-gray-600 mb-1 font-bold">
                       Numărul Comenzii: <span className="text-green-600">{order.orderNumber}</span>
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
                   {order.products.map((product) => (
                     <div key={product._key} className="flex gap-4 border-t pt-4">
                       <Image
                         src={imageUrl(product.product.image).url()}
                         alt={product.product.name}
                         width={80}
                         height={80}
                         className="rounded-md"
                       />
                       <div className="flex-1">
                         <p className="font-medium">{product.product.name}</p>
                         <p className="text-sm text-gray-600">Cantitate: {product.quantity}</p>
                         <p className="text-sm text-gray-600">
                           Preț: {formatCurrency(product.product.price * product.quantity, order.currency)}
                         </p>
                         {product.variant && (
                           <div className="text-sm text-gray-600">
                             <p>Curbura: {product.variant.curbura}</p>
                             <p>Grosime: {product.variant.grosime}</p>
                             <p>Mărime: {product.variant.marime}</p>
                           </div>
                         )}
                       </div>
                     </div>
                   ))}
                 </div>

                 {/* Address */}
                 <div className="mt-4 pt-4 border-t">
                   <h3 className="font-medium mb-2">Adresa de livrare</h3>
                   <p className="text-sm text-gray-600">
                     {order.address.firstName} {order.address.lastName}<br />
                     {order.address.street}<br />
                     {order.address.city}, {order.address.province}<br />
                     {order.address.postalCode}
                   </p>
                 </div>

                 {/* Billing Details */}
                 {order.billingAddress && (
                   <div className="mt-4 pt-4 border-t">
                     <h3 className="font-medium mb-2">Detalii Facturare</h3>
                     <p className="text-sm text-gray-600">
                       {order.billingAddress.companyName}<br />
                       CUI: {order.billingAddress.cui}<br />
                       Reg. Com.: {order.billingAddress.tradeRegisterNumber}
                     </p>
                   </div>
                 )}

                 {/* Order Summary */}
                 <div className="mt-4 pt-4 border-t">
                   <div className="flex justify-between mb-2">
                     <span className="text-sm text-gray-600">Subtotal:</span>
                     <span>{formatCurrency(order.totalPrice - order.shippingCost, order.currency)}</span>
                   </div>
                   <div className="flex justify-between mb-2">
                     <span className="text-sm text-gray-600">Transport:</span>
                     <span>{formatCurrency(order.shippingCost, order.currency)}</span>
                   </div>
                   {order.amountDiscount > 0 && (
                     <div className="flex justify-between mb-2">
                       <span className="text-sm text-gray-600">Reducere:</span>
                       <span className="text-red-600">-{formatCurrency(order.amountDiscount, order.currency)}</span>
                     </div>
                   )}
                   <div className="flex justify-between font-bold">
                     <span>Total:</span>
                     <span>{formatCurrency(order.totalPrice, order.currency)}</span>
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

               {/* Order Status and Actions */}
               <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center p-4">
                 <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1">
                     <span className="text-sm">Status:</span>
                     <span className={`px-3 py-1 rounded-full text-sm ${getStatusClass(order.status)}`}>
                       {order.status}
                     </span>
                   </div>
                   
                   {(order.status === "In Asteptare" || order.status === "platita") && (
                     <button
                       onClick={() => {
                         if (window.confirm('Ești sigur că vrei să anulezi această comandă?')) {
                           handleCancelOrder(order.orderNumber);
                         }
                       }}
                       disabled={isLoading}
                       className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm hover:bg-red-200 disabled:opacity-50"
                     >
                       {isLoading ? 'Se anulează...' : 'Anulează Comanda'}
                     </button>
                   )}
                 </div>
                 
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