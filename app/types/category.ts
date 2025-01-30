import { Category } from "@/sanity.types";

export interface ResolvedCategory {
  _id: string;
  _type: "category";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title: string;
  description: string;
  slug: {
    _type: "slug";
    current: string;
  };
}

export function transformCategory(category: Category): ResolvedCategory {
  if (!category.slug?.current) {
    throw new Error(`Category ${category._id} is missing a slug`);
  }

  if (!category.title) {
    throw new Error(`Category ${category._id} is missing a title`);
  }

  return {
    ...category,
    slug: {
      _type: "slug",
      current: category.slug.current
    },
    title: category.title,
    description: category.description ?? "" // Ensure description has a default value
  };
}