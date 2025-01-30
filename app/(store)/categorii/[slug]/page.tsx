import FilteredCategoryProducts from "@/components/FilteredCategoryProducts";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getProductsByCategory } from "@/sanity/lib/products/getProductsByCategory";
import type { ResolvedCategory } from "@/app/types/category";
import type { Category } from "@/sanity.types";

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function transformToResolvedCategory(rawCategory: Category): ResolvedCategory | null {
  if (!rawCategory.title || !rawCategory.slug) {
    return null;
  }

  return {
    _id: generateId(),
    _type: "category",
    _createdAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
    _rev: generateId(),
    title: rawCategory.title,
    description: "",
    slug: {
      _type: "slug",
      current: typeof rawCategory.slug === 'string' 
        ? rawCategory.slug 
        : rawCategory.slug.current ?? ''
    }
  };
}

type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  const productsResult = await getProductsByCategory(slug);
  const rawCategories = await getAllCategories();

  const products = productsResult.map((p) => ({ ...p }));
  
  const categories: ResolvedCategory[] = rawCategories
    .map(transformToResolvedCategory)
    .filter((category): category is ResolvedCategory => category !== null);

  return (
    <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4">
      <div className="flex items-center justify-center text-xl lg:text-3xl font-bold mb-6 text-center bg-[#FFC2EA] w-full max-w-7xl h-[90px] lg:h-[120px]">
        <h1 className="uppercase">
          {slug
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </h1>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-7xl">
        <FilteredCategoryProducts
          initialProducts={products}
          initialCategories={categories}
          currentSlug={slug}
        />
      </div>
    </div>
  );
}