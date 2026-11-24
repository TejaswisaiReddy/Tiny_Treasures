"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useFavorites } from "@/components/favorites-provider";
import { EmptyState } from "@/components/empty-state";
import { SafeImage } from "@/components/safe-image";
import { productImageSrc, type Product } from "@/lib/products";

type SortOrder = "newest" | "price-low" | "price-high";

function CategoryItemCard({ product, saved, onToggle }: { product: Product; saved: boolean; onToggle: () => void }) {
  return (
    <article className="relative rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
      <Link href={`/items/${product.id}`} aria-label={`View ${product.name}`} className="flex min-w-0 gap-3 rounded-xl pr-8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
        <div className="relative h-[130px] w-[110px] flex-none overflow-hidden rounded-xl bg-gray-100">
          <SafeImage src={productImageSrc(product)} alt={product.name} fill sizes="110px" />
        </div>
        <div className="min-w-0 flex-1 py-1">
          <h2 className="line-clamp-2 text-base font-medium leading-5 text-ink">{product.name}</h2>
          <p className="mt-2 text-lg font-bold text-brand">€{product.price.toFixed(2)}</p>
          <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
            {product.size !== "One size" && <span className="rounded-full bg-cyan-50 px-2 py-1 text-ink">Size {product.size}</span>}
            {product.ageGroup && <span className="rounded-full bg-cyan-50 px-2 py-1 text-ink">{product.ageGroup}</span>}
            <span className="rounded-full bg-fuchsia-50 px-2 py-1 text-ink">{product.condition}</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <Image src="/images/location.svg" alt="" width={12} height={14} style={{ width: 12, height: 14 }} />
              {product.location}
            </span>
            <span className="flex items-center gap-1">
              <Image src="/images/star.png" alt="" width={12} height={12} style={{ width: 12, height: 12 }} />
              <span><span className="sr-only">Seller rating </span>{product.rating}</span>
            </span>
          </div>
        </div>
      </Link>
      <button
        type="button"
        aria-label={`${saved ? "Remove" : "Save"} ${product.name}${saved ? " from favorites" : " to favorites"}`}
        aria-pressed={saved}
        onClick={onToggle}
        className={`absolute top-3 right-3 flex size-10 items-center justify-center rounded-full shadow-sm transition-colors ${saved ? "bg-fuchsia-200 ring-2 ring-brand" : "bg-white hover:bg-fuchsia-50"}`}
      >
        <Image src="/images/heart.svg" alt="" width={18} height={18} style={{ width: 18, height: 18 }} />
      </button>
    </article>
  );
}

export function CategoryListingScreen({ title, products }: { title: string; products: Product[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOrder>("newest");
  const { favorites, toggleFavorite } = useFavorites();
  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const result = products.filter(product =>
      `${product.name} ${product.size} ${product.ageGroup ?? ""} ${product.location}`.toLowerCase().includes(normalizedQuery)
    );
    if (sort === "price-low") return result.sort((first, second) => first.price - second.price);
    if (sort === "price-high") return result.sort((first, second) => second.price - first.price);
    return result;
  }, [products, query, sort]);

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[430px] bg-white shadow-sm">
      <header className="flex min-h-20 items-center gap-3 border-b border-gray-200 px-4 py-3">
        <Link href="/" aria-label="Back to home" className="flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-gray-50">
          <Image src="/images/back.svg" alt="" width={18} height={18} />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-medium text-ink">{title}</h1>
          <p className="text-sm text-gray-600">{visibleProducts.length} {visibleProducts.length === 1 ? "item" : "items"}</p>
        </div>
      </header>

      <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex gap-2">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search in {title}</span>
            <Image src="/images/search.svg" alt="" width={18} height={18} className="absolute top-1/2 left-3 -translate-y-1/2" />
            <input
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search items"
              className="h-11 w-full rounded-xl bg-gray-100 pr-3 pl-10 text-sm outline-none focus:ring-2 focus:ring-brand"
            />
          </label>
          <label className="sr-only" htmlFor="category-sort">Sort items</label>
          <select
            id="category-sort"
            value={sort}
            onChange={event => {
              const value = event.target.value;
              if (value === "newest" || value === "price-low" || value === "price-high") setSort(value);
            }}
            className="h-11 max-w-[47%] rounded-xl border border-gray-200 bg-white px-2 text-xs text-ink focus:ring-2 focus:ring-brand"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price low→high</option>
            <option value="price-high">Price high→low</option>
          </select>
        </div>
      </div>

      <main className="space-y-3 px-4 py-4 pb-8" aria-label={`${title} listings`}>
        {visibleProducts.length
          ? visibleProducts.map(product => (
            <CategoryItemCard
              key={product.id}
              product={product}
              saved={favorites.includes(product.id)}
              onToggle={() => toggleFavorite(product.id)}
            />
          ))
          : <EmptyState title={query ? "No items found" : "No items yet"} message={query ? "Try another search." : "New treasures will appear here soon."} />}
      </main>
    </div>
  );
}
