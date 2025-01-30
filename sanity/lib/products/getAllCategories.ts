import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";
import type { Category } from '@/sanity.types';

export const getAllCategories = async (): Promise<Category[]> => {
    const ALL_CATEGORIES_QUERY = defineQuery(`
    *[_type == "category"] {
      _id,
      _type,
      _createdAt,
      _updatedAt,
      _rev,
      title,
      "slug": slug.current
    }`);
  
    try {
      const response = await sanityFetch({
        query: ALL_CATEGORIES_QUERY,
      });
  
      return response?.data || []; 
    } catch (error) {
      console.error("Error fetching all categories: ", error);
      return [];
    }
};