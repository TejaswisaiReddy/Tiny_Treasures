import assert from "node:assert/strict";
import test from "node:test";
import { collectListingPhotos } from "../src/lib/listing.ts";

const file = name => ({ name, type: "image/jpeg", size: 100 });
const read = async file => ({ id: file.name, name: file.name, src: `local:${file.name}` });

test("batch selection preserves existing photos and stops at five without decoding extra files", async () => {
  const existing = await Promise.all([file("one"), file("two"), file("three"), file("four")].map(read));
  const decoded = [];
  const result = await collectListingPhotos([file("five"), file("six")], existing, async file => {
    decoded.push(file.name);
    return read(file);
  });
  assert.equal(result.photos.length, 5);
  assert.equal(result.added, 1);
  assert.equal(existing.length, 4);
  assert.deepEqual(decoded, ["five"]);
  assert.match(result.errors[0], /up to 5/);
});

test("invalid and unreadable photos do not consume slots or prevent a valid photo being added", async () => {
  const decoded = [];
  const result = await collectListingPhotos([
    { ...file("document"), type: "application/pdf" },
    { ...file("empty"), size: 0 },
    file("broken"), file("valid"),
  ], [], async file => {
    decoded.push(file.name);
    if (file.name === "broken") throw new Error("Cannot decode photo");
    return read(file);
  });
  assert.deepEqual(decoded, ["broken", "valid"]);
  assert.equal(result.added, 1);
  assert.equal(result.photos[0].name, "valid");
  assert.equal(result.errors.length, 3);
});

test("cancelling a file picker leaves the current photo selection intact", async () => {
  const existing = [await read(file("one"))];
  const result = await collectListingPhotos([], existing, read);
  assert.deepEqual(result.photos, existing);
  assert.equal(result.added, 0);
  assert.deepEqual(result.errors, []);
});
