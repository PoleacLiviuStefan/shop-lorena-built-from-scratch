// components/ProductActions.tsx
'use client';

import { Button } from '@/components/ui/button';
import useBasketStore from "@/app/(store)/store";
import { Product } from "@/sanity.types";

interface QuantityButtonProps {
    product: Product;
    disabled?: boolean;
}

// Componenta pentru controlul cantității
const QuantityButton = ({ product, disabled }: QuantityButtonProps) => {
    const { addItem, removeItem, getItemCount } = useBasketStore();
    const itemCount = getItemCount(product._id);

    return (
        <div className="flex items-center justify-between p-2 gap-x-2 border-[1px] border-gray-300 w-[100px]">
            <button
                onClick={() => removeItem(product._id)}
                className="font-bold text-[24px] text-gray-500"
                disabled={itemCount === 0 || disabled}
            >
                -
            </button>
            <span className="text-lg">{itemCount}</span>
            <button
                onClick={() => addItem(product)}
                className="font-bold text-[24px] text-gray-500"
                disabled={disabled}
            >
                +
            </button>
        </div>
    );
};

interface ProductActionsProps {
    product: Product;
    isOutofStock: boolean;
}

// Componenta principală care combină controlul cantității și butonul de adăugare
const ProductActions = ({ product, isOutofStock }: ProductActionsProps) => {
    const { addItem } = useBasketStore();

    return (
        <div className='flex items-center space-x-4'>
            <QuantityButton product={product} disabled={isOutofStock} />
            <Button 
                size="custom" 
                onClick={() => {addItem(product); console.log("dda")}}
                disabled={isOutofStock}
            >
                Adaugă în coș
            </Button>
        </div>
    );
};

export default ProductActions;