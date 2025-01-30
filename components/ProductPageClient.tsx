"use client";

import React, { useState, useMemo } from "react";
import AddToBasketButton from "@/components/AddToBasketButton";
import { imageUrl } from "@/lib/imageUrl";
import { PortableText } from "next-sanity";
import Image from "next/image";
import { Product } from "@/sanity.types";

type Variant = {
  curbura?: "M" | "C" | "D";
  grosime?: "0.05" | "0.10" | "0.15";
  marime?: "7" | "8" | "9" | "10" | "11" | "12" | "13" | "14" | "15" | "mix";
  price?: number;
  stock?: number;
  _key: string;
};

interface SelectedOptions {
  curbura: "M" | "C" | "D" | "";
  grosime: "0.05" | "0.10" | "0.15" | "";
  marime: "7" | "8" | "9" | "10" | "11" | "12" | "13" | "14" | "15" | "mix" | "";
}

interface MergedVariant {
  curbura: "M" | "C" | "D" | "";
  grosime: "0.05" | "0.10" | "0.15" | "";
  marime: "7" | "8" | "9" | "10" | "11" | "12" | "13" | "14" | "15" | "mix" | "";
  price: number;
  stock: number;
}

interface ProductPageProps {
  product: Product;
}

const ProductPageClient: React.FC<ProductPageProps> = ({ product }) => {
  const hasMultipleVariants = Boolean(product.variants && product.variants.length > 1);
  const singleVariant = product.variants?.length === 1 ? product.variants[0] : undefined;

  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions | null>(
    hasMultipleVariants && product.variants?.[0]
      ? {
          curbura: product.variants[0].curbura || "",
          grosime: product.variants[0].grosime || "",
          marime: product.variants[0].marime || "",
        }
      : null
  );

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<number>(0);

  const images = product.images || [];

  const availableOptions = useMemo(() => {
    if (!hasMultipleVariants || !product.variants || !selectedOptions) return null;

    const options = {
      curbura: new Set<"M" | "C" | "D">(),
      grosime: new Set<"0.05" | "0.10" | "0.15">(),
      marime: new Set<"7" | "8" | "9" | "10" | "11" | "12" | "13" | "14" | "15" | "mix">(),
    };

    product.variants.forEach((variant) => {
      const isGrosimeCompatible =
        !selectedOptions.grosime || variant.grosime === selectedOptions.grosime;
      const isCurburaCompatible =
        !selectedOptions.curbura || variant.curbura === selectedOptions.curbura;
      const isMarimeCompatible =
        !selectedOptions.marime || variant.marime === selectedOptions.marime;

      if (isGrosimeCompatible && isMarimeCompatible && variant.curbura) {
        options.curbura.add(variant.curbura);
      }
      if (isCurburaCompatible && isMarimeCompatible && variant.grosime) {
        options.grosime.add(variant.grosime);
      }
      if (isCurburaCompatible && isGrosimeCompatible && variant.marime) {
        options.marime.add(variant.marime);
      }
    });

    return options;
  }, [product.variants, selectedOptions, hasMultipleVariants]);

  const selectedVariant = useMemo<MergedVariant | undefined>(() => {
    let base: Variant | undefined;
  
    if (singleVariant) {
      base = singleVariant;
    } else if (hasMultipleVariants && product.variants && selectedOptions) {
      base = product.variants.find((v) => 
        v.curbura === selectedOptions.curbura &&
        v.grosime === selectedOptions.grosime &&
        v.marime === selectedOptions.marime
      );
    }
  
    if (!base || !base.price || !base.stock) {
      return undefined;
    }
  
    return {
      curbura: base.curbura || "",
      grosime: base.grosime || "",
      marime: base.marime || "",
      price: base.price,
      stock: base.stock
    };
  }, [singleVariant, hasMultipleVariants, product.variants, selectedOptions]);

  const price = selectedVariant?.price ?? 0;
  const stock = selectedVariant?.stock ?? 0;
  const isOutofStock = stock <= 0;

  const handleOptionSelect = <T extends keyof SelectedOptions>(
    optionType: T,
    value: SelectedOptions[T]
  ) => {
    setSelectedOptions((prev) => {
      if (!prev) {
        return {
          curbura: "",
          grosime: "",
          marime: "",
          [optionType]: value,
        };
      }
      return {
        ...prev,
        [optionType]: value,
      };
    });
  };

  const basketProduct = {
    ...product,
    _type: "product" as const,
    variant: selectedVariant ? {
      curbura: selectedVariant.curbura,
      grosime: selectedVariant.grosime,
      marime: selectedVariant.marime,
      price: selectedVariant.price,
      stock: selectedVariant.stock
    } : undefined,
    quantity
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8">
        {/* Left Column: Images */}
        <div className="space-y-4 order-1 lg:order-none">
          <div
            className={`relative aspect-square lg:aspect-[4/3] overflow-hidden rounded-lg ${
              isOutofStock ? "opacity-50" : ""
            }`}
          >
            {images[selectedImage] && (
              <Image
                src={imageUrl(images[selectedImage]).url()}
                alt={images[selectedImage].alt || product.name || "Product image"}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                className="object-contain w-full lg:w-[600px] transition-transform duration-300 hover:scale-105"
              />
            )}
            {isOutofStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <span className="text-white font-bold text-lg">
                  Stoc indisponibil
                </span>
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((image, index) => (
                <button
                  key={image._key}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden rounded border-2 transition-all ${
                    selectedImage === index
                      ? "border-blue-600"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={imageUrl(image).url()}
                    alt={image.alt || `${product.name} thumbnail ${index + 1}`}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info */}
        <div className="flex flex-col justify-between order-2 lg:order-none">
          <div>
            <h1 className="text-3xl font-bold mb-4 uppercase">
              {product.name || 'Produs fără nume'}
            </h1>
            <p className="text-xl font-semibold mb-6">
              {price.toFixed(2)} lei <span className="text-gray-300">TVA inclus</span>
            </p>

            {/* If multiple variants, show the selection buttons */}
            {hasMultipleVariants && availableOptions && selectedOptions && (
              <div className="space-y-6 mb-8">
                {/* Curbura */}
                {availableOptions.curbura.size > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Curbura
                    </label>
                    <div className="mt-2 grid grid-cols-3 gap-3">
                      {Array.from(availableOptions.curbura).map((curbura) => (
                        <button
                          key={curbura}
                          className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                            selectedOptions.curbura === curbura
                              ? "border-blue-600 bg-blue-50 text-blue-600"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                          onClick={() => handleOptionSelect("curbura", curbura)}
                        >
                          {curbura}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Grosime */}
                {availableOptions.grosime.size > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Grosime
                    </label>
                    <div className="mt-2 grid grid-cols-3 gap-3">
                      {Array.from(availableOptions.grosime).map((grosime) => (
                        <button
                          key={grosime}
                          className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                            selectedOptions.grosime === grosime
                              ? "border-blue-600 bg-blue-50 text-blue-600"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                          onClick={() => handleOptionSelect("grosime", grosime)}
                        >
                          {grosime}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mărime */}
                {availableOptions.marime.size > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Mărime
                    </label>
                    <div className="mt-2 grid grid-cols-5 gap-3">
                      {Array.from(availableOptions.marime).map((marime) => (
                        <button
                          key={marime}
                          className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                            selectedOptions.marime === marime
                              ? "border-blue-600 bg-blue-50 text-blue-600"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                          onClick={() => handleOptionSelect("marime", marime)}
                        >
                          {marime}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quantity + Add to Basket */}
            <div className="flex items-center gap-4 mb-6">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between p-2 border rounded-md w-32">
                <button
                  onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="text-lg font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
                  disabled={quantity >= stock}
                >
                  +
                </button>
              </div>

              {/* Add to Basket Button */}
              <AddToBasketButton
                product={basketProduct}
                disabled={isOutofStock}
                withButton={true}
              />
            </div>

            {stock > 0 && (
              <p className="text-sm text-gray-600 mb-4">
                Stoc disponibil: {stock} bucăți
              </p>
            )}
          </div>
        </div>

        {/* Description Section */}
        <div className="col-span-2 order-3">
          <ul className="flex justify-between px-4 w-[200px] font-bold">
            <li className="flex flex-col items-center">
              <button>Descriere</button>
              <span className="bg-black h-[2px] w-full" />
            </li>
          </ul>
          <span className="my-[20px] w-full block bg-gray-300 h-[1px]" />

          <div className="text-medium text-ui-fg-subtle px-[24px] whitespace-pre-line">
            {Array.isArray(product.description) && (
              <PortableText value={product.description} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPageClient;