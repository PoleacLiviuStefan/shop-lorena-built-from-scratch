"use client";
import { Product } from "@/sanity.types";
import { AnimatePresence, motion } from "framer-motion";
import ProductThumb from "./ProductThumb";
import { useEffect, useState } from "react";

const ProductGrid = ({ products }: { products: Product[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const productsToShow = 3;
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [products.length]);

  const visibleProducts = [...products.slice(currentIndex), ...products.slice(0, currentIndex)]
    .slice(0, productsToShow);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  return (
    <div className="w-full">
      <div className="relative max-x-xl lg:max-w-[1200px] mx-auto">
        {/* Navigation arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
        >
          ←
        </button>
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
        >
          →
        </button>

        {/* Products container */}
        <div className="overflow-hidden px-8">
          <motion.div 
            className="flex gap-4 md:gap-6"
            initial={false}
          >
            <AnimatePresence mode="popLayout">
              {visibleProducts.map((product) => (
                <motion.div
                  key={`${product._id}-${currentIndex}`}
                  initial={{ x: "100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "-100%", opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="w-[calc(33.333%-1rem)] lg:w-[300px] xl:w-[340px] flex-shrink-0"
                >
                  <ProductThumb product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {[...Array(products.length)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-black" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;