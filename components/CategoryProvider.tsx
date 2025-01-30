import { getAllCategories } from '@/sanity/lib/products/getAllCategories';
import type { Category as SanityCategory } from '@/sanity.types';
import ShopDropdown from './ShopDropdown';

// Interface for the ShopDropdown component
interface Category {
  _id: string;
  name: string;
  slug: { current: string };
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function transformCategory(rawCategory: SanityCategory): Category | null {
  if (!rawCategory.title) return null;
  
  // Handle the slug which could be a string or an object with current
  const slugCurrent = typeof rawCategory.slug === 'string'
    ? rawCategory.slug
    : rawCategory.slug?.current;
    
  if (!slugCurrent) return null;

  return {
    _id: generateId(),
    name: rawCategory.title,
    slug: {
      current: slugCurrent
    }
  };
}

const CategoryProvider = async () => {
  const rawCategories = await getAllCategories();

  // Transform and filter out null results
  const categories = rawCategories
    .map(transformCategory)
    .filter((cat): cat is Category => cat !== null);

  return <ShopDropdown initialCategories={categories} />;
};

export default CategoryProvider;