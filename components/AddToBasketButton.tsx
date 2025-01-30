'use client';

import useBasketStore from "@/app/(store)/store";
import { Product } from "@/sanity.types";
import { useEffect, useState } from "react";

interface AddToBasketButtonProps {
    product: Product & {
        variant?: {
            curbura: string;
            grosime: string;
            marime: string;
            price: number;
            stock: number;
        };
        quantity?: number;
    };
    disabled?: boolean;
    withButton?: boolean;
}

const AddToBasketButton = ({ product, disabled, withButton = false }: AddToBasketButtonProps) => {
    const { addItem, updateQuantity, getItemCount } = useBasketStore();
    const itemCount = getItemCount(product._id);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleAddToCart = () => {
        addItem(product, product.variant, product.quantity || 1);
    };

    const handleDecrease = () => {
        updateQuantity(product._id, itemCount - 1, product.variant);
    };

    const handleIncrease = () => {
        updateQuantity(product._id, itemCount + 1, product.variant);
    };

    if (!isClient) return null;

    return withButton ? (
        <button
            onClick={handleAddToCart}
            disabled={disabled}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
            Adaugă în coș
        </button>
    ) : (
        <div className="flex items-center justify-between p-2 gap-x-2 border-[1px] border-gray-300 w-[100px]">
            <button
                onClick={handleDecrease}
                className="font-bold text-[24px] text-gray-500"
                disabled={itemCount === 0 || disabled}
            >
                -
            </button>
            <span className="text-lg">{itemCount}</span>
            <button
                onClick={handleIncrease}
                className="font-bold text-[24px] text-gray-500"
                disabled={disabled}
            >
                +
            </button>
        </div>
    );
};

export default AddToBasketButton;