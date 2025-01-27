import { imageUrl } from '@/lib/imageUrl';
import { Product } from '@/sanity.types'
import Image from 'next/image';
import Link from 'next/link';

const ProductThumb = ({ product }: { product: Product }) => {
    const productImage = product.images?.[0] || product.image;
    const isOutofStock = product.stock != null && product.stock <= 0;

    return (
        <Link
            href={`/produs/${product?.slug?.current}`}
            className="group  "
        >
           
                <div className="flex justify-center relative  aspect-[8/9] w-full  overflow-hidden rounded-lg bg-white">
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
                    {product.category && (
                        <span className="text-yellow-500 text-xs lg:text-sm uppercase">
                            {product.category}
                        </span>
                    )}
                    
                    <h2 className="text-gray-600 font-bold text-sm lg:text-base truncate">
                        {product.name}
                    </h2>

                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-base lg:text-lg font-bold">
                            {product.price?.toFixed(2)} lei
                        </span>
                        <span className="text-xs text-gray-500">TVA inclus</span>
                    </div>
                </div>
            
        </Link>
    );
}

export default ProductThumb;