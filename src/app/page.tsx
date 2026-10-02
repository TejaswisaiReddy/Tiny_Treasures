import HomeScreen from "@/components/home-screen";
import { parseFilters, readQuery, type SearchParams } from "@/lib/product-filters";

export default async function Home({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const query = readQuery(params);
  return <HomeScreen key={JSON.stringify([filters, query])} initialFilters={filters} initialQuery={query} />;
}
