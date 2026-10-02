import type { ListingDraft, ListingPhoto } from "./listing";

export type BatchListing = { id: string; draft: ListingDraft; photo: ListingPhoto; sample: boolean };
export const batchStorageKey = "tiny-treasures-batch-v1";
export const sampleBatch: BatchListing[] = [
  { id: "sample-romper", sample: true, photo: { id: "romper", name: "H&M jumpsuit", src: "/images/item/hm-jumpsuit.png" }, draft: { title: "H&M Cotton Jumpsuit", price: "12", category: "Clothes", size: "86-92cm", brand: "H&M", color: "Navy", condition: "Excellent", description: "Soft cotton jumpsuit, gently worn. No visible stains or holes." } },
  { id: "sample-books", sample: true, photo: { id: "books", name: "Children’s books", src: "/images/books.png" }, draft: { title: "Toddler Books Bundle", price: "24.50", category: "Books", size: "", brand: "", color: "", condition: "Very Good", description: "A bundle of favourite stories. Clean pages with light wear to the covers." } },
  { id: "sample-blocks", sample: true, photo: { id: "blocks", name: "Wooden blocks", src: "/images/cart/wooden-blocks.png" }, draft: { title: "Wooden Play Blocks", price: "18", category: "Toys", size: "", brand: "", color: "Natural wood", condition: "Good", description: "Wooden blocks with light surface marks from play. All pieces shown are included." } },
];

// Drafts may be incomplete; validate required selling fields only when posting.
export function parseBatch(raw: string): BatchListing[] {
  const value: unknown = JSON.parse(raw);
  if (!Array.isArray(value) || value.length > 5 || !value.every(item => {
    if (!item || typeof item.id !== "string" || typeof item.sample !== "boolean" || !item.draft || !item.photo) return false;
    const draft = item.draft;
    return ["title", "price", "category", "size", "condition", "description"].every(field => typeof draft[field] === "string") &&
      ["brand", "color"].every(field => draft[field] === undefined || typeof draft[field] === "string") &&
      typeof item.photo.id === "string" && typeof item.photo.name === "string" && typeof item.photo.src === "string" &&
      (/^data:image\/(jpeg|png|webp);base64,/.test(item.photo.src) || item.photo.src.startsWith("/images/"));
  }) || new Set(value.map(item => item.id)).size !== value.length) throw new Error("Invalid saved batch");
  return value;
}
