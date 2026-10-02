import type { ListingPhoto } from "@/lib/listing";

export const sampleListingPhoto: ListingPhoto = {
  id: "sample-jumpsuit",
  name: "Sample jumpsuit",
  src: "/images/item/hm-jumpsuit.png",
};

export function checkPhoto(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    const timer = window.setTimeout(() => {
      image.onload = image.onerror = null;
      reject(new Error("The photo took too long to open. Try a smaller image."));
    }, 15000);
    image.onload = () => {
      window.clearTimeout(timer);
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      window.clearTimeout(timer);
      reject(new Error("This photo could not be opened. Try another image."));
    };
    image.src = src;
  });
}

// FileReader keeps the photo on this device; this does not upload anything.
export function readListingPhoto(file: File): Promise<ListingPhoto> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("This photo could not be read. Try another image."));
    reader.onabort = () => reject(new Error("Photo selection was cancelled."));
    reader.onload = async () => {
      try {
        const src = String(reader.result);
        await checkPhoto(src);
        resolve({ id: crypto.randomUUID(), name: file.name, src });
      } catch (error) { reject(error); }
    };
    reader.readAsDataURL(file);
  });
}
