// app/(store)/produs/[slug]/page.tsx
import ProductPageClient from '@/components/ProductPageClient';
import { getProductBySlug } from '@/sanity/lib/products/getProductBySlug';
import { notFound } from 'next/navigation';


export const dynamic = "force-static";
export const revalidate = 60;

const ProductPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    
    try {
        const product = await getProductBySlug(slug);
        
        if (!product) {
            return notFound();
        }

        return <ProductPageClient product={product} />;
    } catch (error) {
        console.error('Error processing product:', error);
        return notFound();
    }
};

export default ProductPage;