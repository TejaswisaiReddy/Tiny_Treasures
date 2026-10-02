import { validateListing, type ListingDraft, type ListingPhoto } from "./listing";

const key = "tiny-treasures-listing-draft-v1";
export function saveListing(draft: ListingDraft, photos: ListingPhoto[]) {
  localStorage.setItem(key, JSON.stringify({ draft, photos }));
}
export function removeSavedListing() { localStorage.removeItem(key); }
export function loadListing(): { draft: ListingDraft; photos: ListingPhoto[] } | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  const value = JSON.parse(raw);
  const fields = ["title", "price", "category", "size", "condition", "description"];
  if (!value?.draft || !fields.every(field => typeof value.draft[field] === "string") ||
    !["brand", "color"].every(field => value.draft[field] === undefined || typeof value.draft[field] === "string") ||
    !Array.isArray(value.photos) || !value.photos.every((photo: ListingPhoto) =>
      photo && typeof photo.id === "string" && typeof photo.name === "string" && typeof photo.src === "string" &&
      (/^data:image\/(jpeg|png|webp);base64,/.test(photo.src) || photo.src.startsWith("/images/"))) ||
    Object.keys(validateListing(value.draft, value.photos.length)).length) throw new Error("Invalid saved draft");
  return value;
}
