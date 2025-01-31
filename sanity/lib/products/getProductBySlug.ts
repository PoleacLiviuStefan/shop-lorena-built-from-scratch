import { sanityFetch } from "../live";
import { Product } from "@/sanity.types";

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
   const PRODUCT_BY_ID_QUERY = `*[
   _type == "product" && slug.current == $slug
   ] | order(name asc)[0] {
     _id,
     _type,
     _createdAt,
     _updatedAt,
     _rev,
     name,
     slug,
     images,
     variants,
     description,
     categories
   }`;

   try {
       const response = await sanityFetch({
           query: PRODUCT_BY_ID_QUERY,
           params: { slug }
       });

       if (!response.data) return null;

       return {
           ...response.data,
           images: response.data.images ?? [],
           variants: response.data.variants ?? [],
           description: response.data.description ?? []
       };
   } catch (error) {
       console.error("Error: ", error);
       return null;
   }
}