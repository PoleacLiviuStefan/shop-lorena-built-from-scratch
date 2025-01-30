"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/sanity.types";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import Link from "next/link";
import ProductThumb from "@/components/ProductThumb";
import { cn } from "@/lib/utils";
import PriceRangeFilter from "./PrinceRangeFilter";
import { ResolvedCategory } from "@/app/types/category";

const PRODUCTS_PER_PAGE = 12;

/** 
 * We create 'ProductWithRefs' that has a
 * 'resolvedCategories' array instead of the raw reference array.
 */
type ProductWithRefs = Omit<Product, "categories"> & {
  computedPrice?: number;
  resolvedCategories?: ResolvedCategory[];
};

interface FilteredCategoryProductsProps {
  initialProducts: Product[];
  initialCategories: ResolvedCategory[];
  currentSlug: string;
}

const FilteredCategoryProducts: React.FC<FilteredCategoryProductsProps> = ({
  initialProducts = [],
  initialCategories = [],
  currentSlug = "",
}) => {
  // 1) Transform each raw Product into a ProductWithRefs
  const transformProduct = (product: Product): ProductWithRefs => ({
    ...product,
    computedPrice: getProductPrice(product),
    resolvedCategories: product.categories
      ?.map((catRef) => {
        const found = initialCategories.find((cat) => cat._id === catRef._ref);
        if (!found) return undefined;
        return found;
      })
      .filter((cat): cat is ResolvedCategory => cat !== undefined),
  });

  // 2) Calculate a "lowest price" for each product
  const getProductPrice = (product: Product): number => {
    if (product.variants && product.variants.length > 0) {
      const prices = product.variants.map((v) => v.price ?? 0);
      return Math.min(...prices);
    }
    return 0;
  };

  // 3) Our states
  const [products] = useState<ProductWithRefs[]>(
    () => initialProducts.map(transformProduct)
  );
  const [categories] = useState<ResolvedCategory[]>(initialCategories);

  // Fix: type priceRange as a 2-element tuple
  const [priceRange, setPriceRange] = useState<[number, number]>(() => {
    const maxPrice = Math.max(...initialProducts.map(getProductPrice), 0);
    return [0, maxPrice];
  });

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [sortOrder, setSortOrder] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const maxPrice = priceRange[1];

  useEffect(() => {
    setIsClient(true);
  }, []);

  const resetFilters = () => {
    const newMax = Math.max(...products.map((p) => p.computedPrice ?? 0), 0);
    setPriceRange([0, newMax]);
    setSortOrder("");
    setFilteredProducts(products);
    setCurrentPage(1);
  };

  const areFiltersActive = () => {
    return priceRange[0] > 0 || sortOrder !== "" || priceRange[1] < maxPrice;
  };

  // Re-filter when priceRange or sortOrder changes
  useEffect(() => {
    let result = [...products];

    // Filter by priceRange
    result = result.filter((p) => {
      const price = p.computedPrice ?? 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sort if needed
    if (sortOrder === "price-asc") {
      result.sort((a, b) => (a.computedPrice ?? 0) - (b.computedPrice ?? 0));
    } else if (sortOrder === "price-desc") {
      result.sort((a, b) => (b.computedPrice ?? 0) - (a.computedPrice ?? 0));
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [priceRange, sortOrder, products]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // While SSR hydrates
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-4 rounded-lg sticky top-24 shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filtre</h2>
              <div className="flex items-center gap-2">
                {areFiltersActive() && (
                  <button
                    onClick={resetFilters}
                    className="text-sm text-gray-600 hover:text-black flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Resetează
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden"
                >
                  {showFilters ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>
            </div>

            <div className={cn("space-y-6", showFilters ? "block" : "hidden md:block")}>
              <div className="border-b pb-4">
                <h3 className="font-medium mb-3">Categorii</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      href={`/categorii/${category.slug.current}`}
                      key={category._id}
                      className={cn(
                        "block px-3 py-2 rounded-md text-sm transition-colors",
                        category.slug.current === currentSlug
                          ? "bg-black text-white"
                          : "hover:bg-gray-100"
                      )}
                    >
                      {category.title}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border-b pb-4">
                <PriceRangeFilter
                  maxPrice={priceRange[1]}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                />
              </div>

              <div>
                <h3 className="font-medium mb-3">Sortare</h3>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Fără sortare</option>
                  <option value="price-asc">Preț: crescător</option>
                  <option value="price-desc">Preț: descrescător</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-grow">
          <div className="flex justify-between items-center mb-6">
            <div className="md:hidden">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="text-sm border rounded-md p-2"
              >
                <option value="">Sortare</option>
                <option value="price-asc">Preț crescător</option>
                <option value="price-desc">Preț descrescător</option>
              </select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <>
              <ul
                className="grid grid-cols-2 w-full md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-4"
                data-testid="products-list"
              >
                {paginatedProducts.map((product) => (
                  <li key={product._id} className="shadow-sm p-4 hover:shadow-md transition-shadow">
                    <ProductThumb product={product as Product} />
                  </li>
                ))}
              </ul>

              {totalPages > 1 && (
                <div className="flex justify-center space-x-2 mt-8">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={cn(
                      "px-4 py-2 text-sm rounded-md transition-colors",
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    )}
                  >
                    Anterior
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        "px-4 py-2 text-sm rounded-md transition-colors",
                        currentPage === page
                          ? "bg-black text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      )}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={cn(
                      "px-4 py-2 text-sm rounded-md transition-colors",
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    )}
                  >
                    Următor
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 mb-4">
                Nu am găsit produse care să corespundă filtrelor selectate.
              </p>
              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Resetează filtrele
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FilteredCategoryProducts;