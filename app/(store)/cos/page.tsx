"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AddToBasketButton from "@/components/AddToBasketButton";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";
import useBasketStore from "../store";
import Loader from "@/components/Loader";
import Link from "next/link";
import CheckoutSummary from "@/components/CheckoutSummary";
import {Product} from "@/sanity.types";
import {BasketItem} from "../store";


const Page = () => {

  // Helper function to get the first image from a product
const getProductImage = (product: Product) => {
  return product.images?.[0];
};

// Helper function to get product price (from variants or default)
const getProductPrice = (item: BasketItem) => {
  if (item.variant?.price != null) {
    return item.variant.price;
  }
  if (item.product.variants?.length) {
    return item.product.variants[0].price ?? 0;
  }
  return 0;
};
  const groupedItems = useBasketStore((state) => state.getGroupedItems());

  const router = useRouter();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return <Loader />;
  }

  if (groupedItems.length === 0) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Coșul tău</h1>
        <p className="text-gray-600 text-lg">Coșul tău este gol.</p>
        <Link href="/magazin" className="mt-4">
          <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors">
            Vezi produse
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Coșul tău</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow">
          <div className="hidden lg:grid grid-cols-[2fr,1fr,1fr,1fr,1fr] gap-4 pb-4 border-b mb-4">
            <div className="text-gray-600 font-medium">Produs</div>
            <div className="text-gray-600 font-medium">Varianta</div>
            <div className="text-gray-600 font-medium text-center">Cantitate</div>
            <div className="text-gray-600 font-medium text-center">Preț</div>
            <div className="text-gray-600 font-medium text-right">Total</div>
          </div>

          <div className="space-y-4">
            {groupedItems?.map((item) => {
              const productImage = getProductImage(item.product);
              const price = getProductPrice(item);
              
              return (
                <div 
                  key={`${item.product._id}-${item.variant?.curbura}-${item.variant?.grosime}-${item.variant?.marime}`} 
                  className="border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="hidden lg:grid grid-cols-[2fr,1fr,1fr,1fr,1fr] gap-4 items-center p-4">
                    <div 
                      className="flex items-center cursor-pointer"
                      onClick={() => router.push(`/produs/${item.product.slug?.current}`)}
                    >
                      {productImage && (
                        <div className="w-24 h-24 relative flex-shrink-0 mr-4">
                          <Image 
                            src={imageUrl(productImage).url()}
                            alt={item.product.name || "Imagine Produs"}
                            className="object-cover rounded"
                            fill
                            sizes="96px"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h2 className="font-semibold truncate">{item.product.name}</h2>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      {item.variant?.curbura ? (
                        <>
                          <p>Curbura: {item.variant.curbura}</p>
                          <p>Grosime: {item.variant.grosime}</p>
                          <p>Mărime: {item.variant.marime}</p>
                        </>
                      ) : (
                        <p>Standard</p>
                      )}
                    </div>

                    <div className="flex justify-center">
                      <AddToBasketButton 
                        product={{
                          ...item.product,
                          variant: item.variant,
                          quantity: item.quantity
                        }} 
                      />
                    </div>
                    <div className="text-center text-gray-600">
                      {price.toFixed(2)} lei
                    </div>
                    <div className="text-right font-medium">
                      {(price * item.quantity).toFixed(2)} lei
                    </div>
                  </div>

                  {/* Mobile View */}
                  <div className="lg:hidden p-4">
                    <div 
                      className="flex items-center cursor-pointer"
                      onClick={() => router.push(`/produs/${item.product.slug?.current}`)}
                    >
                      {productImage && (
                        <div className="w-20 h-20 relative flex-shrink-0 mr-4">
                          <Image 
                            src={imageUrl(productImage).url()}
                            alt={item.product.name || "Imagine Produs"}
                            className="object-cover rounded"
                            fill
                            sizes="80px"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h2 className="font-semibold truncate uppercase">{item.product.name}</h2>
                        {item.variant?.curbura ? (
                          <div className="text-sm text-gray-600 mt-1">
                            <p>Curbura: {item.variant.curbura}</p>
                            <p>Grosime: {item.variant.grosime}</p>
                            <p>Mărime: {item.variant.marime}</p>
                          </div>
                        ) : <p>Standard</p>}
                        <p className="text-gray-600 mt-1">
                          {price.toFixed(2)} lei / buc
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t">
                      <AddToBasketButton 
                        product={{
                          ...item.product,
                          variant: item.variant,
                          quantity: item.quantity
                        }} 
                      />
                      <p className="font-medium">
                        Total: {(price * item.quantity).toFixed(2)} lei
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full lg:w-96">
          <CheckoutSummary />
        </div>

        <div className="h-32 lg:h-0" />
      </div>
    </div>
  );
};

export default Page;