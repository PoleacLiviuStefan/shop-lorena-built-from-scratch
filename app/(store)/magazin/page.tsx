
import { getAllProducts } from '@/sanity/lib/products/getAllProducts';
import { getAllCategories } from '@/sanity/lib/products/getAllCategories';
import FilteredCategoryProducts from '@/components/FilteredCategoryProducts';
import Hero from '@/components/Hero';
import LorenaBanner from "../../../public/Imagini/stiliste/lorena-shop-banner.png";
export default async function Page() {
  const products = await getAllProducts();
  const categories = await getAllCategories();

  return <>
        <Hero
          image={LorenaBanner}
          imageWidth="350"
          imageWidthMobile="300"
          backCircle={true}
        /><FilteredCategoryProducts initialProducts={products} initialCategories={categories} />;
        </>
}