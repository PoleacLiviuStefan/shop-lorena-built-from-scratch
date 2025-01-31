
import { searchProductsByName } from "@/sanity/lib/products/searchProductsByName";
import React from "react";
import { ResolvedCategory } from '@/app/types/category';
import { Category } from '@/sanity.types';
import FilteredCategoryProducts from "@/components/FilteredCategoryProducts";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";


type Props = {
  searchParams: Promise<{
    query: string;
  }>;
}

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

const SearchPage = async ({ searchParams }: Props) => {
  const resolvedParams = await searchParams;
  const { query } = resolvedParams;
  const products = await searchProductsByName(query);
    const rawCategories = await getAllCategories();
  const categories = transformCategories(rawCategories);

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-top min-h-screen  p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Nu s-au gasit produse pentru cautarea: {query}
          </h1>
          <p className="text-gray-600 text-center">
            Incearca sa cauti folosind alte cuvinte cheie
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-top min-h-screen p-4">
      <div>
      <div className="flex items-center justify-center text-xl lg:text-3xl font-bold mb-6 text-center bg-[#FFC2EA] w-full max-w-7xl h-[90px] lg:h-[120px]">
        <h1 className="uppercase">
          {query
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </h1>
      </div>
              <FilteredCategoryProducts 
        initialProducts={products} 
        initialCategories={categories} 
        currentSlug=""
      />
      </div>
    </div>
  );
};

export default SearchPage;