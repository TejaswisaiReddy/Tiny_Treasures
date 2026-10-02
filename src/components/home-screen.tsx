"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { useFavorites } from "@/components/favorites-provider";
import { BottomNavigation } from "@/components/bottom-navigation";
import { useCart } from "@/components/cart-provider";
import { recentProducts, seasonalProducts, type Product } from "@/lib/products";
import { activeFilterCount, emptyFilters, filterHref, matchesFilters, type ProductFilters } from "@/lib/product-filters";

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  return <Image src={`/images/${name}.svg`} alt="" width={size} height={size} className="shrink-0 object-contain" style={{ width: size, height: size }} />;
}

const categories = [
  { name: "Puzzles", image: "puzzles" },
  { name: "Books", image: "books" },
  { name: "Soft toys", image: "soft-toys" },
  { name: "More", image: "more" },
];

export default function HomeScreen({ initialFilters, initialQuery }: { initialFilters: ProductFilters; initialQuery: string }) {
  const router = useRouter();
  const [filters, setFilters] = useState(initialFilters);
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("All");
  const { favorites, toggleFavorite } = useFavorites();
  const { totals: cartTotals } = useCart();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [sort, setSort] = useState("recent");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const filterCount = activeFilterCount(filters);
  const browseFilters = category === "All" ? filters : { ...filters, categories: [category === "Soft toys" ? "Toys" : category] };
  const filtersLink = filterHref("/filters", browseFilters, query);
  const returnTo = filterHref("/", browseFilters, query);
  function filtered(products: Product[]) {
    const result = products.filter(product =>
      `${product.name} ${product.category} ${product.location}`.toLowerCase().includes(query.toLowerCase().trim()) &&
      (category === "All" || category === product.category) &&
      matchesFilters(product, filters) &&
      (!savedOnly || favorites.includes(product.id))
    );
    return sort === "low" ? result.sort((a, b) => a.price - b.price) : sort === "high" ? result.sort((a, b) => b.price - a.price) : result;
  }
  function reset() { setQuery(""); setCategory("All"); setSavedOnly(false); setSort("recent"); setFilters(emptyFilters()); router.replace("/", { scroll: false }); }
  function focusSearch() { window.scrollTo({ top: 0 }); searchRef.current?.focus({ preventScroll: true }); }
  function productSection(title: string, products: Product[], id: string) {
    const visible = filtered(products);
    return <section id={id} aria-labelledby={`${id}-heading`} className="pt-2">
      <h2 id={`${id}-heading`} className="mb-4 text-xl font-medium">{title}</h2>
      {visible.length ? <div className="grid grid-cols-2 gap-x-3 gap-y-4">{visible.map(product => <ProductCard key={product.id} product={product} saved={favorites.includes(product.id)} onToggle={() => toggleFavorite(product.id)} returnTo={returnTo} />)}</div> : <div className="rounded-xl bg-gray-50 px-5 py-8 text-center text-sm text-gray-600"><p>No matching items in this collection.</p><button onClick={reset} className="mt-3 font-medium text-brand underline">Clear filters</button></div>}
    </section>;
  }

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[412px] bg-white shadow-sm">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:block focus:p-3">Skip to content</a>
      <header className="flex h-16 items-center justify-between border-b border-gray-200 px-3">
        <button aria-label="Open menu" aria-expanded={menuOpen} aria-controls="home-menu" onClick={() => setMenuOpen(!menuOpen)} className="flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-gray-50"><Icon name="menu" size={18} /></button>
        <h1 className="logo whitespace-nowrap text-[clamp(24px,8vw,36px)] leading-none" aria-label="Tiny Treasures"><span className="text-[#ee7c11]">ti</span><span className="text-[#fce00f]">ny</span>{" "}<span className="text-brand">tre</span><span className="text-[#0fd1fc]">as</span><span className="text-[#54dc2f]">ures</span></h1>
        <div className="flex"><button aria-label="Notifications" onClick={() => setNotice("Notifications will be available when accounts are added.")} className="flex h-11 w-9 items-center justify-center"><Icon name="bell" size={18} /></button><Link href="/cart" aria-label={`Shopping cart, ${cartTotals.itemCount} items`} className="relative flex h-11 w-9 items-center justify-center"><Icon name="cart" />{cartTotals.itemCount > 0 && <span aria-hidden="true" className="absolute top-0 right-0 min-w-4 rounded-full bg-brand px-1 text-center text-[10px] text-white">{cartTotals.itemCount}</span>}</Link></div>
      </header>

      {menuOpen && <nav id="home-menu" aria-label="Menu" className="flex flex-wrap gap-2 border-b border-gray-100 p-4"><button className="rounded-lg bg-gray-50 px-4 py-3 text-sm" onClick={() => { reset(); setMenuOpen(false); }}>Browse all</button><button className="rounded-lg bg-fuchsia-50 px-4 py-3 text-sm text-brand" onClick={() => { setSavedOnly(true); setCategory("All"); setQuery(""); setMenuOpen(false); }}>Favorites ({favorites.length})</button></nav>}

      {menuOpen && <button onClick={() => { setFiltersOpen(!filtersOpen); setMenuOpen(false); }} className="m-4 rounded-lg bg-gray-50 px-4 py-3 text-sm">Sort and favorites</button>}

      <main id="main-content" className="space-y-4 px-4 pt-4 pb-28">
        {filterCount > 0 && <div role="status" className="flex items-center justify-between rounded-xl bg-fuchsia-50 px-4 py-3 text-sm text-brand"><Link href={filtersLink}>{filterCount} {filterCount === 1 ? "filter" : "filters"} applied</Link><button onClick={reset} className="underline">Clear all</button></div>}
        <div role="search" className="relative flex h-[46px] items-center rounded-xl bg-gray-200">
          <span className="pointer-events-none absolute left-4"><Icon name="search" size={18} /></span>
          <input id="product-search" ref={searchRef} type="search" aria-label="Search products" placeholder="Search for toys, clothes, books..." value={query} onChange={event => setQuery(event.target.value)} className="h-full min-w-0 w-full rounded-xl bg-transparent pr-12 pl-12 text-base font-light placeholder:text-gray-500" />
          <Link href={filtersLink} aria-label={`Filter products${filterCount ? `, ${filterCount} active` : ""}`} className="absolute right-0 flex size-11 items-center justify-center"><Icon name="filter" size={18} />{filterCount > 0 && <span aria-hidden="true" className="absolute top-0 right-0 flex min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] text-white">{filterCount}</span>}</Link>
        </div>
        {filtersOpen && <div id="product-filters" className="space-y-4 rounded-xl border border-gray-200 p-4 text-sm"><label className="flex items-center justify-between gap-2">Sort by<select value={sort} onChange={event => setSort(event.target.value)} className="rounded-lg border border-gray-200 p-2"><option value="recent">Recently posted</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label><label className="flex items-center gap-2"><input type="checkbox" checked={savedOnly} onChange={event => setSavedOnly(event.target.checked)} className="accent-brand" />Saved favorites only</label><button onClick={reset} className="text-brand underline">Reset filters</button></div>}

        <section aria-label="Autumn collection" className="relative flex h-44 items-center overflow-hidden rounded-xl bg-brand">
          <Image src="/images/autumn.png" alt="Folded autumn knitwear" fill priority sizes="380px" className="object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand to-transparent" />
          <div className="relative px-6 text-white"><h2 className="mb-1 text-2xl font-medium">NEW ARRIVALS</h2><p className="mb-3 text-base font-medium leading-[19px]">Autumn Collection<br />is here.</p><a href="#seasonal" onClick={reset} className="inline-flex min-h-9 items-center rounded-full bg-white px-6 py-2 text-base leading-[19px] text-brand hover:bg-fuchsia-50">Shop Now</a></div>
        </section>

        <section aria-labelledby="category-heading" className="pt-2">
          <div className="mb-4 flex items-center justify-between gap-2"><h2 id="category-heading" className="text-[clamp(20px,5.8vw,24px)] font-medium">Browse by Category</h2><Link href={filtersLink} className="flex min-h-11 shrink-0 items-center text-base text-brand">View All</Link></div>
          <div className="category-scroll flex gap-0 overflow-x-auto pb-2">{categories.map(item => <button key={item.name} aria-pressed={category === item.name} onClick={() => { if (item.name === "More") { router.push(filtersLink); return; } setCategory(category === item.name ? "All" : item.name); setFilters(current => ({ ...current, categories: [] })); }} className="flex w-[103px] shrink-0 flex-col items-center gap-2 pb-2 text-base font-medium"><Image src={`/images/${item.image}.png`} alt="" width={80} height={80} className={`size-20 rounded-xl object-cover ${category === item.name ? "ring-2 ring-brand ring-offset-2" : ""}`} /><span>{item.name}</span></button>)}</div>
        </section>
        {(category !== "All" || savedOnly || query) && <p role="status" className="text-sm text-gray-600">{savedOnly ? "Saved favorites" : category !== "All" ? category : "Search results"}{query && ` for “${query}”`}<button onClick={reset} className="ml-3 text-brand underline">Clear</button></p>}
        {productSection("Seasonal Clothing", seasonalProducts, "seasonal")}
        {productSection("Recently posted", recentProducts, "recent")}
      </main>

      {notice && <div role="status" className="fixed bottom-24 left-1/2 z-30 flex w-[calc(100%-32px)] max-w-[380px] -translate-x-1/2 items-center gap-3 rounded-xl border border-fuchsia-100 bg-white p-4 text-sm shadow-lg"><p className="flex-1">{notice}</p><button onClick={() => setNotice("")} className="min-h-11 text-brand">Dismiss</button></div>}
      <BottomNavigation active="Home" onHome={() => { reset(); window.scrollTo({ top: 0 }); }} onSearch={focusSearch} onUnavailable={label => setNotice(`${label} is coming in a later step.`)} />
    </div>
  );
}
