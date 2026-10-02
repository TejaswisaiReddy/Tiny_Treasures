import assert from "node:assert/strict";
import test from "node:test";
import { emptyFilters, parseFilters, filterHref, matchesFilters } from "../src/lib/product-filters.ts";

test("filter URLs preserve multiple choices, prices, and search text", () => {
  const filters = { ...emptyFilters(), categories: ["Clothes", "Books"], ages: ["3–6M"], brands: ["H&M"], minPrice: 10, maxPrice: 30 };
  const url = new URL(filterHref("/filters", filters, "winter & rain"), "http://localhost");
  const params = Object.fromEntries([...url.searchParams.keys()].map(key => [key, url.searchParams.getAll(key)]));
  assert.deepEqual(parseFilters(params), filters);
  assert.equal(url.searchParams.get("q"), "winter & rain");
});

test("invalid and repeated URL filters are normalized safely", () => {
  const filters = parseFilters({ categories: ["Clothes", "Clothes", "unknown"], minPrice: "NaN", maxPrice: "-4", sizes: "999cm" });
  assert.deepEqual(filters, { ...emptyFilters(), categories: ["Clothes"] });
  assert.deepEqual(parseFilters({ minPrice: "40", maxPrice: "10" }), emptyFilters());
  assert.equal(parseFilters({ minPrice: "0" }).minPrice, 0);
});

test("price boundaries and category mapping match existing clothing listings", () => {
  const product = { category: "Clothing", price: 24, size: "120", condition: "Good" };
  const filters = { ...emptyFilters(), categories: ["Clothes"], minPrice: 24, maxPrice: 24 };
  assert.equal(matchesFilters(product, filters), true);
  assert.equal(matchesFilters(product, { ...filters, maxPrice: 23 }), false);
  assert.equal(matchesFilters(product, { ...filters, sizes: ["98-104cm"] }), false);
});

test("choices within groups use OR, groups use AND, and unknown fields do not match", () => {
  const product = { category: "Clothing", price: 20, size: "80", condition: "Excellent", ageGroup: "6–12M", brand: "Reima" };
  const filters = { ...emptyFilters(), categories: ["Clothes", "Books"], sizes: ["74-80cm"], ages: ["3–6M", "6–12M"], conditions: ["Excellent"], brands: ["Reima"] };
  assert.equal(matchesFilters(product, filters), true);
  assert.equal(matchesFilters({ ...product, brand: undefined }, filters), false);
  assert.equal(matchesFilters({ ...product, ageGroup: undefined }, filters), false);
  assert.equal(matchesFilters({ ...product, condition: "Good" }, filters), false);
  assert.equal(matchesFilters(product, emptyFilters()), true);
});
