import { getAllCategories } from '@/sanity/lib/products/getAllCategories';
import ShopDropdown from './ShopDropdown';

const CategoryProvider = async () => {
    const categories = await getAllCategories();
    
    return <ShopDropdown initialCategories={categories} />;
};

export default CategoryProvider;