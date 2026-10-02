"use client";

import Image from "next/image";
import { useState } from "react";
import { ItemDialog } from "@/components/item-dialog";
import { formatCartPrice } from "@/lib/cart";
import { listingNeedsSize, parseListingPrice, type ListingDraft, type ListingPhoto } from "@/lib/listing";

export function ListingPreview({ draft, photos, onClose }: { draft: ListingDraft; photos: ListingPhoto[]; onClose: () => void }) {
  const [selected, setSelected] = useState(0);

  return (
    <ItemDialog title="Listing preview" onClose={onClose}>
      <article className="min-w-0 space-y-4">
        <Image src={photos[selected].src} alt={draft.title.trim()} width={640} height={640} unoptimized className="aspect-square w-full rounded-xl bg-gray-50 object-contain" />
        {photos.length > 1 && <div className="flex flex-wrap gap-2" aria-label="Listing photos">
          {photos.map((photo, index) => <button key={photo.id} type="button" aria-label={`View photo ${index + 1}`} aria-pressed={selected === index} onClick={() => setSelected(index)} className={`overflow-hidden rounded-lg border-2 ${selected === index ? "border-brand" : "border-transparent"}`}>
            <Image src={photo.src} alt="" width={48} height={48} unoptimized className="size-12 object-cover" />
          </button>)}
        </div>}
        <div>
          <h3 className="break-words text-xl font-medium">{draft.title.trim()}</h3>
          <p className="mt-2 text-2xl font-medium text-brand">{formatCartPrice(parseListingPrice(draft.price) ?? 0)}</p>
        </div>
        <dl className="space-y-2 border-y border-gray-200 py-4 text-sm">
          <div className="flex justify-between gap-4"><dt className="text-gray-600">Category</dt><dd>{draft.category}</dd></div>
          {listingNeedsSize(draft.category) && <div className="flex justify-between gap-4"><dt className="text-gray-600">Size</dt><dd>{draft.size}</dd></div>}
          <div className="flex justify-between gap-4"><dt className="text-gray-600">Condition</dt><dd>{draft.condition}</dd></div>
        </dl>
        <div><h4 className="mb-2 text-sm font-medium">Description</h4><p className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-600">{draft.description.trim()}</p></div>
        <p className="rounded-xl bg-fuchsia-50 p-3 text-sm leading-5 text-brand">Preview only. Your listing has not been published.</p>
        <button type="button" onClick={onClose} className="min-h-12 w-full rounded-xl bg-brand px-4 py-3 font-medium text-white hover:bg-brand/90">Continue editing</button>
      </article>
    </ItemDialog>
  );
}
