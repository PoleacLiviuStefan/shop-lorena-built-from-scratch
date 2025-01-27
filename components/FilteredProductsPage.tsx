import { getAllCategories } from '@/sanity/lib/products/getAllCategories';
import { getProductsByCategory } from '@/sanity/lib/products/getProductsByCategory';
import FilteredCategoryProducts from '@/components/FilteredCategoryProducts';

const Page = async ({params}: {params: {slug:string}}) => {
    const {slug} = params;
    const products = await getProductsByCategory(slug);
    const categories = await getAllCategories();

    return (
        <div className='flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4'>
            <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-7xl'>
                <h1 className='text-3xl font-bold mb-6 text-center'>
                    Colectia de {slug.split('-').map((word) => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                </h1>
                <FilteredCategoryProducts 
                    initialProducts={products} 
                    initialCategories={categories}
                    currentSlug={slug}
                />
            </div>
        </div>
    );
};

export default Page;