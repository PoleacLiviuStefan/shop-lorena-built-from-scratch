import type { Metadata } from "next";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import { roRO } from '@clerk/localizations'
import { SanityLive } from "@/sanity/lib/live";
import DisableDraftMode from "@/components/DisableDraftMode";
import { VisualEditing } from "next-sanity";
import { draftMode } from "next/headers";
import Footer from "@/components/Footer";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
// import PopupSales from "@/components/PopupSale";


export const metadata: Metadata = {
  title: "Lorena Lash Studio",
  description: "Comanda chiar acum produse sau cursuri pentru a intra in lumea extensiilor de gene!",
};

// Type for the category links we're passing to the Header
interface CategoryLink {
  name: string;
  href: string;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getAllCategories();
  console.log("Categories: ", categories);
  
  const categoryLinks: CategoryLink[] = categories
    .filter((category): category is (typeof categories[number] & { title: string; slug: string }) => 
      Boolean(category.title && category.slug)
    )
    .map((category) => ({
      name: category.title,
      href: `/categorii/${category.slug}`,
    }));

  return (
    <ClerkProvider dynamic localization={roRO}>
      <html lang="en">
        <body>
          {/* <PopupSales /> */}
          {(await draftMode()).isEnabled && (
            <>
              <DisableDraftMode />
              <VisualEditing />
            </>
          )}
          <main>
            <Header categories={categoryLinks} />
            <div className="mt-[60px] lg:mt-[98px] overflow-x-hidden">
              {children}
            </div>
          </main>
          <Footer />
          <SanityLive />
        </body>
      </html>
    </ClerkProvider>
  );
}
