// SimpleAddToBasketButton.tsx
'use client';

import useBasketStore from "@/app/(store)/store";
import { Product } from "@/sanity.types";
import { useEffect, useState } from "react";
import { ShoppingCart } from 'lucide-react';

interface SimpleAddToBasketButtonProps {
    product: Product;
    disabled?: boolean;
}

const SimpleAddToBasketButton = ({ product, disabled }: SimpleAddToBasketButtonProps) => {
    const { addItem, getItemCount } = useBasketStore();
    const itemCount = getItemCount(product._id);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }

    return (
        <button
            onClick={() => addItem(product)}
            disabled={disabled}
            className={`flex items-center justify-center px-4 py-2 rounded-lg transition-all duration-200 
                ${disabled 
                    ? 'bg-gray-100 cursor-not-allowed text-gray-400' 
                    : 'bg-black text-white hover:bg-gray-800'
                }
            `}
        >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {itemCount > 0 ? (
                <span className="flex items-center gap-2">
                    În coș ({itemCount})
                </span>
            ) : (
                'Adaugă în coș'
            )}
        </button>
    );
};

export default SimpleAddToBasketButton;