import { imageUrl } from '@/lib/imageUrl';
import { Product } from '@/sanity.types'
import Image from 'next/image';
import Link from 'next/link';


type ProductVariant = {
    curbura?: "M" | "C" | "D";
    grosime?: "0.05" | "0.10" | "0.15";
    marime?: "7" | "8" | "9" | "10" | "11" | "12" | "13" | "14" | "15" | "mix";
    price?: number;
    stock?: number;
    _key: string;
};


const ProductThumb = ({ product }: { product: Product }) => {
    const getProductPrice = (product: Product): number => {
        if (product.variants && product.variants.length > 0) {
            const prices = product.variants.map(v => v.price ?? 0);
            return Math.min(...prices);
        }
        return 0;
    };

    const productImage = product.images?.[0];
    const isOutofStock = product.variants?.every((v: ProductVariant) => (v.stock ?? 0) <= 0) ?? false;
    const price = getProductPrice(product);

    return (
        <Link
            href={`/produs/${product.slug?.current}`}
            className="group"
        >
            <div className="flex justify-center relative aspect-[8/9] w-full overflow-hidden rounded-lg bg-white">
                {productImage && (
                    <Image
                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                        src={imageUrl(productImage).url()}
                        alt={productImage.alt || product.name || "Product image"}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={false}
                        quality={75}
                    />
                )}
                {isOutofStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <span className="text-white font-bold text-lg">Stoc indisponibil</span>
                    </div>
                )}
            </div>

            <div className="flex flex-col mt-4">
                <h2 className="text-gray-600 font-bold text-sm lg:text-base truncate">
                    {product.name}
                </h2>

                <div className="flex items-center gap-2 mt-2">
                    <span className="text-base lg:text-lg font-bold">
                        {price.toFixed(2)} lei
                    </span>
                    <span className="text-xs text-gray-500">TVA inclus</span>
                </div>
            </div>
        </Link>
    );
}

export default ProductThumb;