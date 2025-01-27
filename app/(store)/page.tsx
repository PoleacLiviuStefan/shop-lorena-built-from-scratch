import BenefitList from "@/components/BenefitList";
import Hero from "@/components/Hero";
import HomeCoursesPreview from "@/components/HomeCoursesPreview";
import ProductsView from "@/components/ProductsView";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";


export const dynamic = "force-static"
export const revalidate = 60; //revalidate at most every 60 seconds

export default async function Home() {
  const products = await getAllProducts();
  const categories = await getAllCategories()
  // console.log(

  // );

  console.log(crypto.randomUUID().slice(0,5)+
  `>>> Rerendered the product page cache with ${products.length} products and ${categories.length} categories`
  );

  const Echipa = '/Imagini/stiliste/echipa.png';

  return (
    <div >
      {/* <BlackFridayBanner /> */}
      <Hero image={Echipa} />
      
      <div className="flex flex-col items-center justify-top min-h-screen  p-4 font-montSerrat">
      <HomeCoursesPreview />
      <BenefitList />
      {/* <FeaturedProducts collections={collections} region={region} main={true}/> */}
        <ProductsView products={products} categories={categories} />
      </div>
    </div>
  );
}