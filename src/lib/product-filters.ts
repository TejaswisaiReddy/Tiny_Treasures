import type { Product } from "./products";

export const filterOptions = {
  categories: ["Clothes", "Toys", "Books", "Puzzles", "Accessories"],
  ages: ["0–3M", "3–6M", "6–12M", "1–2Y", "2–3Y", "3–4Y"],
  sizes: ["50-56cm", "62-68cm", "74-80cm", "86-92cm", "98-104cm"],
  conditions: ["New with tags", "Excellent", "Very Good", "Good", "Slightly Used"],
  brands: ["Zara Kids", "H&M", "Reima", "Kappahl", "Gap Kids"],
};

export type ProductFilters = {
  categories: string[];
  ages: string[];
  sizes: string[];
  conditions: string[];
  brands: string[];
  minPrice: number | null;
  maxPrice: number | null;
};
export type FilterGroup = keyof typeof filterOptions;
export type SearchParams = Record<string, string | string[] | undefined>;

export function emptyFilters(): ProductFilters {
  return { categories: [], ages: [], sizes: [], conditions: [], brands: [], minPrice: null, maxPrice: null };
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseFilters(params: SearchParams): ProductFilters {
  const filters = emptyFilters();
  for (const group of Object.keys(filterOptions) as FilterGroup[]) {
    const value = params[group];
    const values = Array.isArray(value) ? value : value ? [value] : [];
    filters[group] = [...new Set(values.filter(item => filterOptions[group].includes(item)))];
  }
  for (const key of ["minPrice", "maxPrice"] as const) {
    const value = first(params[key]);
    const price = value?.trim() ? Number(value) : NaN;
    filters[key] = Number.isFinite(price) && price >= 0 && price <= 10000 ? price : null;
  }
  if (filters.minPrice !== null && filters.maxPrice !== null && filters.minPrice > filters.maxPrice) {
    filters.minPrice = null;
    filters.maxPrice = null;
  }
  return filters;
}

export function readQuery(params: SearchParams) {
  return (first(params.q) ?? "").slice(0, 200);
}

export function filterHref(path: "/" | "/filters", filters: ProductFilters, query = "") {
  const params = new URLSearchParams();
  for (const group of Object.keys(filterOptions) as FilterGroup[]) {
    for (const value of filters[group]) params.append(group, value);
  }
  if (filters.minPrice !== null) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== null) params.set("maxPrice", String(filters.maxPrice));
  if (query.trim()) params.set("q", query.trim());
  return params.size ? `${path}?${params.toString()}` : path;
}

export function activeFilterCount(filters: ProductFilters) {
  return Object.keys(filterOptions).reduce((count, group) => count + filters[group as FilterGroup].length, 0)
    + Number(filters.minPrice !== null || filters.maxPrice !== null);
}

// Choices within a group are OR; different groups are combined with AND.
export function matchesFilters(product: Product, filters: ProductFilters) {
  const category = product.category === "Clothing" ? "Clothes" : product.category === "Soft toys" ? "Toys" : product.category;
  const height = Number(product.size);
  return (!filters.categories.length || filters.categories.includes(category))
    && (!filters.ages.length || Boolean(product.ageGroup && filters.ages.includes(product.ageGroup)))
    && (!filters.sizes.length || filters.sizes.some(range => {
      const [min, max] = range.replace("cm", "").split("-").map(Number);
      return Number.isFinite(height) && height >= min && height <= max;
    }))
    && (!filters.conditions.length || filters.conditions.includes(product.condition))
    && (!filters.brands.length || Boolean(product.brand && filters.brands.includes(product.brand)))
    && (filters.minPrice === null || product.price >= filters.minPrice)
    && (filters.maxPrice === null || product.price <= filters.maxPrice);
}
