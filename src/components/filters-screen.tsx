"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FilterChipGroup } from "@/components/filter-chip-group";
import { emptyFilters, filterHref, filterOptions, type FilterGroup, type ProductFilters } from "@/lib/product-filters";

type FiltersScreenProps = { initialFilters: ProductFilters; query: string };

export default function FiltersScreen({ initialFilters, query }: FiltersScreenProps) {
  const router = useRouter();
  const [filters, setFilters] = useState(initialFilters);
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice?.toString() ?? "");
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice?.toString() ?? "");
  const [brandSearch, setBrandSearch] = useState("");
  const [message, setMessage] = useState("");

  const min = minPrice === "" ? null : Number(minPrice);
  const max = maxPrice === "" ? null : Number(maxPrice);
  const invalidPrice = [min, max].some(price => price !== null && (!Number.isFinite(price) || price < 0 || price > 10000));
  const reversedPrices = min !== null && max !== null && min > max;
  const priceError = invalidPrice ? "Enter a price between €0 and €10,000." : reversedPrices ? "Max price must be at least the min price." : "";
  const sliderLimit = Math.max(100, min ?? 0, max ?? 0);
  const sliderValue = Math.min(sliderLimit, Math.max(0, max ?? sliderLimit));
  const brands = filterOptions.brands.filter(brand => brand.toLowerCase().includes(brandSearch.trim().toLowerCase()));

  function toggle(group: FilterGroup, value: string) {
    setFilters(current => ({ ...current, [group]: current[group].includes(value) ? current[group].filter(item => item !== value) : [...current[group], value] }));
    setMessage("");
  }

  function clearPrices() {
    setMinPrice("");
    setMaxPrice("");
  }

  function reset() {
    setFilters(emptyFilters());
    clearPrices();
    setBrandSearch("");
    setMessage("All filters cleared. Apply to update your results.");
  }

  function apply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (priceError) return;
    router.push(filterHref("/", { ...filters, minPrice: min, maxPrice: max }, query));
  }

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[412px] bg-white shadow-sm">
      <header className="sticky top-0 z-20 grid h-16 grid-cols-[1fr_auto_1fr] items-center border-b border-gray-200 bg-white px-4">
        <Link href={filterHref("/", initialFilters, query)} aria-label="Back without applying changes" className="flex size-11 items-center justify-center rounded-full hover:bg-gray-50">
          <Image src="/images/back.svg" alt="" width={24} height={24} />
        </Link>
        <h1 className="text-xl font-medium text-brand">Filters</h1>
        <button type="button" onClick={reset} className="min-h-11 justify-self-end px-1 text-sm text-brand hover:underline">Reset</button>
      </header>

      <form onSubmit={apply}>
        <main className="space-y-4 p-4 pb-[calc(120px+env(safe-area-inset-bottom))]">
          <FilterChipGroup legend="Category" options={filterOptions.categories} selected={filters.categories} onToggle={value => toggle("categories", value)} wide />
          <FilterChipGroup legend="Age Group" options={filterOptions.ages} selected={filters.ages} onToggle={value => toggle("ages", value)} />

          <section aria-labelledby="price-heading" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 id="price-heading" className="text-base font-medium">Price Range</h2>
              <button type="button" onClick={() => { clearPrices(); setMessage("Price range cleared."); }} className="px-1 py-2 text-sm text-brand hover:underline">Clear</button>
            </div>
            <div className="flex h-5 items-center">
              <input type="range" aria-label="Maximum price" aria-valuetext={max === null ? "No maximum price" : `€${sliderValue}`} min={0} max={sliderLimit} step={1} value={sliderValue} onChange={event => { const value = Number(event.target.value); setMaxPrice(String(value)); if (min !== null && min > value) setMinPrice(String(value)); }} className="price-slider w-full" style={{ background: `linear-gradient(to right, #941696 ${max === null ? 0 : sliderValue / sliderLimit * 100}%, #e5e7eb ${max === null ? 0 : sliderValue / sliderLimit * 100}%)` }} />
            </div>
            <div className="grid grid-cols-2 gap-3.5">
              {([{ label: "Min Price", value: minPrice, update: setMinPrice, placeholder: "0", id: "min-price" }, { label: "Max Price", value: maxPrice, update: setMaxPrice, placeholder: "Any", id: "max-price" }]).map(field => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="mb-1 block text-sm text-gray-500">{field.label}</label>
                  <div className="relative">
                    <span aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-600">€</span>
                    <input id={field.id} type="number" inputMode="decimal" min={0} max={10000} step="0.01" value={field.value} onChange={event => field.update(event.target.value)} placeholder={field.placeholder} aria-invalid={Boolean(priceError)} aria-describedby={priceError ? "price-error" : undefined} className="h-10 w-full rounded-xl border border-filter-border bg-white pr-3 pl-7 text-base text-gray-600" />
                  </div>
                </div>
              ))}
            </div>
            {priceError && <p id="price-error" role="alert" className="text-sm text-red-700">{priceError}</p>}
          </section>

          <FilterChipGroup legend="Height / Size" options={filterOptions.sizes} selected={filters.sizes} onToggle={value => toggle("sizes", value)} />
          <FilterChipGroup legend="Condition" options={filterOptions.conditions} selected={filters.conditions} onToggle={value => toggle("conditions", value)} />

          <section aria-labelledby="brands-heading" className="space-y-2 pb-4">
            <h2 id="brands-heading" className="text-base font-medium">Popular Brands</h2>
            <div className="relative">
              <Image src="/images/brand-search.svg" alt="" width={16} height={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2" />
              <input type="search" aria-label="Search brands" placeholder="Search brands..." value={brandSearch} onChange={event => setBrandSearch(event.target.value)} className="h-10 w-full rounded-xl border border-filter-border bg-white pr-3 pl-9 text-base font-light placeholder:text-gray-500" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Keep selected brands visible even while searching for another brand. */}
              {filters.brands.map(brand => <button key={brand} type="button" aria-label={`Remove ${brand}`} aria-pressed="true" onClick={() => toggle("brands", brand)} className="flex min-h-9 items-center gap-1 rounded-full border border-filter-border px-3.5 py-1.5 text-sm text-brand hover:bg-fuchsia-50">{brand}<Image src="/images/remove-brand.svg" alt="" width={14} height={14} /></button>)}
              {brands.filter(brand => !filters.brands.includes(brand)).map(brand => <button key={brand} type="button" aria-pressed="false" onClick={() => toggle("brands", brand)} className="min-h-9 rounded-full px-2 py-1 text-sm text-gray-600 hover:bg-fuchsia-50 hover:text-brand">{brand}</button>)}
            </div>
            {brands.length === 0 && <p role="status" className="py-2 text-sm text-gray-500">No brands match “{brandSearch}”.</p>}
          </section>
          <p role="status" className="sr-only">{message}</p>
        </main>

        <footer className="fixed bottom-0 left-1/2 z-20 w-full max-w-[412px] -translate-x-1/2 bg-white px-4 pt-2 pb-[calc(21px+env(safe-area-inset-bottom))]">
          <button type="submit" disabled={Boolean(priceError)} className="h-[60px] w-full rounded-xl bg-brand text-2xl font-medium text-white shadow-sm transition-colors hover:bg-[#7a127c] disabled:cursor-not-allowed disabled:opacity-50">Apply filters</button>
        </footer>
      </form>
    </div>
  );
}
