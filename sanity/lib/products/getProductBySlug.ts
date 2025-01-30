// sanity/lib/products/getProductBySlug.ts
import { sanityFetch } from "../live";
import { defineQuery } from "next-sanity";
import { Product } from "@/sanity.types";

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
    const PRODUCT_BY_ID_QUERY = defineQuery(`*[
    _type == "product" && slug.current == $slug
    ] | order(name asc)[0] {
      _id,
      _type,
      _createdAt,
      _updatedAt,
      _rev,
      name,
      price,
      stock,
      images,
      image,
      variants,
      description,
      slug
    }`);

    try {
        const response = await sanityFetch({
            query: PRODUCT_BY_ID_QUERY,
            params: { slug }
        });

        if (!response.data) {
            return null;
        }

        // Ensure all required fields have default values
        const product: Product = {
            ...response.data,
            price: response.data.price ?? 0,
            stock: response.data.stock ?? 0,
            images: response.data.images ?? [],
            variants: response.data.variants ?? [],
            description: response.data.description ?? []
        };

        return product;
    } catch (error) {
        console.error("Error: ", error);
        return null;
    }
}