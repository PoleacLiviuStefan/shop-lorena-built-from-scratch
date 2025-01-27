import ProductPageClient from '@/components/ProductPageClient';
import { getProductBySlug } from '@/sanity/lib/products/getProductBySlug';
import { notFound } from 'next/navigation';


export const dynamic = "force-static";
export const revalidate = 60;

const ProductPage = async ({params}: {params: Promise<{slug: string}>}) => {
    const {slug} = await params;
    const product = await getProductBySlug(slug);
    console.log("prodsul este:", product);
    if (!product) {
        return notFound(); 
    }
 
    return <ProductPageClient product={product} />;
 };
 
 export default ProductPage;