import assert from "node:assert/strict";
import test from "node:test";
import { defaultProfile, parseProfile } from "../src/lib/profile.ts";
import { parseBatch, sampleBatch } from "../src/lib/batch-listing.ts";
import { conditionTone, displayBrand } from "../src/lib/listing-presentation.ts";

test("profile edits round-trip while invalid stored profiles fall back safely", () => {
  const edited = { ...defaultProfile, name: "Sam", children: [] };
  assert.deepEqual(parseProfile(JSON.stringify(edited)), edited);
  for (const raw of [null, "broken", "null", JSON.stringify({ ...edited, name: " " }), JSON.stringify({ ...edited, children: [{ nickname: 3 }] })]) {
    assert.deepEqual(parseProfile(raw), defaultProfile);
  }
});

test("batch storage preserves incomplete drafts and item-specific brands and condition", () => {
  const items = structuredClone(sampleBatch);
  items[0].draft.brand = "Reima";
  items[0].draft.condition = "Good";
  items[1].draft.price = "";
  assert.deepEqual(parseBatch(JSON.stringify(items)), items);
  assert.deepEqual(parseBatch("[]"), []);
});

test("batch restore rejects oversized batches, duplicate IDs, and unsafe photo sources", () => {
  assert.throws(() => parseBatch(JSON.stringify([...sampleBatch, ...sampleBatch])));
  assert.throws(() => parseBatch(JSON.stringify([sampleBatch[0], sampleBatch[0]])));
  for (const src of ["javascript:alert(1)", "https://unknown.example/photo.png", "data:image/svg+xml;base64,abc"]) {
    assert.throws(() => parseBatch(JSON.stringify([{ ...sampleBatch[0], photo: { ...sampleBatch[0].photo, src } }])));
  }
  assert.throws(() => parseBatch(JSON.stringify([{ ...sampleBatch[0], draft: { title: "Missing fields" } }])));
});

test("brand labels preserve identity and distinguish missing brands from unbranded items", () => {
  assert.equal(displayBrand(" h & m "), "H&M");
  assert.equal(displayBrand("  Zara   Kids "), "Zara Kids");
  assert.equal(displayBrand("Unbranded"), "Unbranded");
  assert.equal(displayBrand(" "), "Brand not specified");
  assert.equal(displayBrand(), "Brand not specified");
  assert.notEqual(conditionTone("Excellent"), conditionTone("Good"));
  assert.notEqual(conditionTone(""), conditionTone("Excellent"));
});
