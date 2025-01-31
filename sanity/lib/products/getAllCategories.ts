
import { sanityFetch } from "../live";
import type { Category } from '@/sanity.types';

interface SanityCategory {
 _id: string;
 _type: string;
 _createdAt: string;
 _updatedAt: string;
 _rev: string;
 title: string | null;
 slug: string | null;
}

export const getAllCategories = async (): Promise<Category[]> => {
   const ALL_CATEGORIES_QUERY = `*[_type == "category"] {
     _id,
     _type,
     _createdAt,
     _updatedAt,
     _rev,
     title,
     "slug": slug.current
   }`;
 
   try {
     const response = await sanityFetch({
       query: ALL_CATEGORIES_QUERY,
     });
 
     return (response?.data || []).map((category: SanityCategory) => ({
       ...category,
       title: category.title || undefined,
       slug: category.slug || undefined
     })) as Category[];
   } catch (error) {
     console.error("Error fetching all categories: ", error);
     return [];
   }
};