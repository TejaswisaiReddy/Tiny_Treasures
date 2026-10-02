import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ItemDetailsScreen from "@/components/item-details-screen";
import { getItemDetails } from "@/lib/products";
import { filterHref, parseFilters, readQuery, type SearchParams } from "@/lib/product-filters";

type ItemPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
};

export async function generateMetadata({ params }: ItemPageProps): Promise<Metadata> {
  const item = getItemDetails((await params).id);
  return { title: item ? `${item.product.name} | Tiny Treasures` : "Item not found | Tiny Treasures", description: item?.description };
}

export default async function ItemPage({ params, searchParams }: ItemPageProps) {
  const item = getItemDetails((await params).id);
  if (!item) notFound();

  // Only allow known return destinations, retaining supported home search filters.
  const search = await searchParams;
  const from = typeof search.from === "string" ? search.from : "/";
  let backHref = from === "/cart" ? "/cart" : "/";
  if (from.startsWith("/?")) {
    const query = new URLSearchParams(from.slice(2));
    const homeParams = Object.fromEntries([...query.keys()].map(key => [key, query.getAll(key)]));
    backHref = filterHref("/", parseFilters(homeParams), readQuery(homeParams));
  }
  return <ItemDetailsScreen key={item.product.id} item={item} backHref={backHref} />;
}
