export const MAX_LISTING_PHOTOS = 5;
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
export const LISTING_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export type ListingPhoto = { id: string; name: string; src: string };
export type ListingDraft = {
  title: string;
  price: string;
  category: string;
  size: string;
  condition: string;
  description: string;
  brand?: string;
  color?: string;
};
export type ListingErrors = Partial<Record<keyof ListingDraft | "photos", string>>;

export const emptyListing: ListingDraft = {
  title: "", price: "", category: "", size: "", condition: "", description: "",
};

export function listingNeedsSize(category: string) {
  return category === "Clothes" || category === "Accessories";
}

// Accept a decimal comma as well as a dot, and work in cents like the cart.
export function parseListingPrice(value: string): number | null {
  const normalized = value.trim().replace(",", ".");
  if (!/^\d{1,5}(\.\d{1,2})?$/.test(normalized)) return null;
  const cents = Math.round(Number(normalized) * 100);
  return cents >= 1 && cents <= 1_000_000 ? cents : null;
}

export function photoFileError(file: { type: string; size: number }) {
  if (!LISTING_PHOTO_TYPES.includes(file.type)) return "Choose a JPG, PNG or WebP image.";
  if (file.size === 0) return "This file is empty. Choose another photo.";
  if (file.size > MAX_PHOTO_BYTES) return "Each photo must be 5 MB or smaller.";
  return "";
}

// Shared by the regular upload field and the batch-photo screen.
export async function collectListingPhotos<T extends { type: string; size: number; name: string }>(
  files: readonly T[], existing: readonly ListingPhoto[], read: (file: T) => Promise<ListingPhoto>,
) {
  const photos = [...existing];
  const errors: string[] = [];
  for (const file of files) {
    if (photos.length >= MAX_LISTING_PHOTOS) {
      errors.push("You can add up to 5 photos. Remove one to add another.");
      break;
    }
    const error = photoFileError(file);
    if (error) { errors.push(`${file.name}: ${error}`); continue; }
    try { photos.push(await read(file)); }
    catch (failure) { errors.push(failure instanceof Error ? failure.message : "Choose another photo."); }
  }
  return { photos, errors: [...new Set(errors)], added: photos.length - existing.length };
}

export function validateListing(draft: ListingDraft, photoCount: number): ListingErrors {
  const errors: ListingErrors = {};
  if (photoCount < 1) errors.photos = "Add at least one photo of your item.";
  if (photoCount > MAX_LISTING_PHOTOS) errors.photos = "Use up to 5 photos.";
  if (!draft.title.trim()) errors.title = "Give your item a title.";
  else if (draft.title.trim().length > 80) errors.title = "Keep the title to 80 characters.";
  if (parseListingPrice(draft.price) === null) errors.price = "Enter €0.01–€10,000 with up to two decimal places.";
  if (!draft.category) errors.category = "Choose a category.";
  if (listingNeedsSize(draft.category) && !draft.size) errors.size = "Choose a size.";
  if (!draft.condition) errors.condition = "Choose the item's condition.";
  if (!draft.description.trim()) errors.description = "Describe the item and any signs of wear.";
  else if (draft.description.trim().length > 2000) errors.description = "Keep the description to 2,000 characters.";
  return errors;
}
