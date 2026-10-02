import type { Metadata } from "next";
import FiltersScreen from "@/components/filters-screen";
import { parseFilters, readQuery, type SearchParams } from "@/lib/product-filters";

export const metadata: Metadata = { title: "Filters | Tiny Treasures" };

export default async function FiltersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const query = readQuery(params);
  return <FiltersScreen key={JSON.stringify([filters, query])} initialFilters={filters} query={query} />;
}
