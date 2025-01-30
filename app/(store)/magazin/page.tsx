import { getAllProducts } from '@/sanity/lib/products/getAllProducts';
import { getAllCategories } from '@/sanity/lib/products/getAllCategories';
import FilteredCategoryProducts from '@/components/FilteredCategoryProducts';
import Hero from '@/components/Hero';
import LorenaBanner from "../../../public/Imagini/stiliste/lorena-shop-banner.png";
import { ResolvedCategory } from '@/app/types/category';
import { Category } from '@/sanity.types';

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Function to transform Sanity categories to ResolvedCategory type
function transformCategories(rawCategories: Category[]): ResolvedCategory[] {
  return rawCategories
    .filter((cat): cat is Category & { title: string } => Boolean(cat.title))
    .map(cat => ({
      _id: generateId(),
      _type: "category" as const, // Use const assertion to match literal type
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
      _rev: generateId(),
      title: cat.title,
      slug: {
        _type: "slug",
        current: typeof cat.slug === 'string' ? cat.slug : cat.slug?.current ?? ""
      },
      description: "" // Default empty string for description
    }));
}

export default async function Page() {
  const products = await getAllProducts();
  const rawCategories = await getAllCategories();
  const categories = transformCategories(rawCategories);

  return (
    <>
      <Hero
        image={LorenaBanner}
        imageWidth="350"
        imageWidthMobile="300"
        backCircle={true}
      />
      <FilteredCategoryProducts 
        initialProducts={products} 
        initialCategories={categories} 
        currentSlug=""
      />
    </>
  );
}