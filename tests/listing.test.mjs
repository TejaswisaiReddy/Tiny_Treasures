import assert from "node:assert/strict";
import test from "node:test";
import { emptyListing, MAX_PHOTO_BYTES, parseListingPrice, photoFileError, validateListing } from "../src/lib/listing.ts";

test("listing prices accept local decimal commas without rounding invalid precision", () => {
  assert.equal(parseListingPrice(" 12,50 "), 1250);
  assert.equal(parseListingPrice("0.01"), 1);
  assert.equal(parseListingPrice("10000"), 1_000_000);
  for (const value of ["", " ", "0", "-1", "1.999", "1e3", "NaN", "10000.01", "1,2.3"]) {
    assert.equal(parseListingPrice(value), null, value);
  }
});

test("photo validation rejects oversized, unsupported and empty files", () => {
  assert.equal(photoFileError({ type: "image/jpeg", size: MAX_PHOTO_BYTES }), "");
  assert.ok(photoFileError({ type: "image/png", size: MAX_PHOTO_BYTES + 1 }));
  assert.ok(photoFileError({ type: "image/svg+xml", size: 100 }));
  assert.ok(photoFileError({ type: "image/webp", size: 0 }));
});

test("previews require real details and photos, and size only when relevant", () => {
  const blank = validateListing({ ...emptyListing, title: "   ", description: "\n " }, 0);
  for (const field of ["photos", "title", "price", "category", "condition", "description"]) assert.ok(blank[field], field);
  const book = { title: "Picture book", price: "4.50", category: "Books", size: "", condition: "Good", description: "Clean pages, a small crease on the cover." };
  assert.deepEqual(validateListing(book, 1), {});
  assert.ok(validateListing({ ...book, category: "Clothes" }, 1).size);
  assert.deepEqual(validateListing({ ...book, category: "Clothes", size: "86-92cm" }, 5), {});
  assert.ok(validateListing(book, 6).photos);
});
