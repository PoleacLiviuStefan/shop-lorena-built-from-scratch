'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ShoppingCart, X } from 'lucide-react';
import useBasketStore from '../app/(store)/store';
import { imageUrl } from '@/lib/imageUrl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { BasketItem } from '../app/(store)/store';

const CartPreview = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const groupedItems = useBasketStore((state) => state.getGroupedItems());
  const totalPrice = useBasketStore((state) => state.getTotalPrice());
  const removeItem = useBasketStore((state) => state.removeItem);

  const totalItems = groupedItems.reduce((total, item) => total + item.quantity, 0);

  const handleRemove = (productId: string, variant?: BasketItem['variant']) => {
    removeItem(productId, variant);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative h-full "
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
    >
      <button className="h-full flex items-center justify-center gap-1 px-2">
        <ShoppingCart className="w-5 h-5" />
        <span className="hidden lg:inline-block text-sm font-medium">
          COS{totalItems > 0 && ` (${totalItems})`}
        </span>
        {totalItems > 0 && (
          <span className="lg:hidden absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 bg-white border shadow-lg w-[280px] lg:w-[420px] rounded-lg transition-all duration-200 ease-out transform">
          <div className="p-4 flex items-center justify-between border-b">
            <h3 className="font-semibold">Coș</h3>
            <button
              onClick={handleClose}
              className="lg:hidden text-gray-500 hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {groupedItems.length > 0 ? (
            <>
              <div className="max-h-[300px] lg:max-h-[402px] overflow-y-auto px-4">
                {groupedItems.map((item) => (
                  <div
                    key={item.product._id}
                    className="py-4 border-b flex gap-4 group"
                  >
                    <div className="w-[90px] lg:w-[110px] h-[90px] lg:h-[110px] relative flex-shrink-0">
                      {item.product.images?.[0] && (
                        <Image
                          src={imageUrl(item.product.images[0]).url()}
                          alt={item.product.name || 'Imagine Produs'}
                          className="object-cover rounded"
                          fill
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <div className="pr-2">
                          <h4 className="font-medium text-sm truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Bucăți: {item.quantity}
                          </p>
                          <button
                            onClick={() =>
                              handleRemove(item.product._id, item.variant)
                            }
                            className="text-sm text-red-500 hover:text-red-700 mt-1"
                          >
                            Șterge
                          </button>
                        </div>
                        <p className="font-medium">
                          {((item.variant?.price ?? 0) * item.quantity).toFixed(2)} lei
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2 lg:p-4 border-t space-y-2 lg:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">
                    Total <span className="font-normal text-gray-600">(incl. TVA)</span>
                  </span>
                  <span className="font-semibold">{totalPrice.toFixed(2)} lei</span>
                </div>
                <Link href="/cos" className="block">
                  <Button className="w-full bg-black hover:bg-gray-800" onClick={handleClose}>
                    Spre coș
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="py-16 flex flex-col items-center gap-4">
              <div className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center">
                0
              </div>
              <p className="text-gray-500">Coșul este gol</p>
              <Link href="/magazin">
                <Button onClick={handleClose}>Explorează produse</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartPreview;