import { notFound } from "next/navigation";
import { CategoryListingScreen } from "@/components/category-listing-screen";
import { categoryPageDefinitions, getCategoryPage } from "@/lib/products";

export function generateStaticParams() {
  return categoryPageDefinitions.map(category => ({ slug: category.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategoryPage(slug);
  if (!category) notFound();

  return <CategoryListingScreen title={category.title} products={category.products} />;
}
