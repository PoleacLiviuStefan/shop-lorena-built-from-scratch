import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getAllCategories = async () => {
    const ALL_CATEGORIES_QUERY = defineQuery(`
        *[_type == "category"] | order(title asc) {
            title, // Corectăm aici pentru a obține titlul
            "slug": slug.current // Obține slug-ul corect
        }
    `);
  
    try {
      const categories = await sanityFetch({
        query: ALL_CATEGORIES_QUERY,
      });
  
      console.log("Fetched categories:", categories); // Verificăm dacă `title` există acum
      return categories?.data || []; // Ne asigurăm că este un array
    } catch (error) {
      console.error("Error fetching all categories: ", error);
      return [];
    }
  };
  
