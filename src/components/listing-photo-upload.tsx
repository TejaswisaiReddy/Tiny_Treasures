"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { LISTING_PHOTO_TYPES, MAX_LISTING_PHOTOS, collectListingPhotos, type ListingPhoto } from "@/lib/listing";
import { readListingPhoto } from "@/lib/listing-photo";

type PhotoUploadProps = {
  photos: ListingPhoto[];
  error?: string;
  onChange: (photos: ListingPhoto[]) => void;
  onBusyChange: (busy: boolean) => void;
};

export function ListingPhotoUpload({ photos, error, onChange, onBusyChange }: PhotoUploadProps) {
  const input = useRef<HTMLInputElement>(null);
  const busyRef = useRef(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [dragging, setDragging] = useState(false);
  const full = photos.length >= MAX_LISTING_PHOTOS;

  async function addPhotos(files: File[]) {
    if (!files.length || busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    onBusyChange(true);
    try {
      const result = await collectListingPhotos(files, photos, readListingPhoto);
      if (result.added) onChange(result.photos);
      setNotice(result.errors.length ? result.errors.join(" ") : `${result.added} ${result.added === 1 ? "photo" : "photos"} added.`);
    } finally {
      busyRef.current = false;
      setBusy(false);
      onBusyChange(false);
    }
  }

  return (
    <section aria-labelledby="photos-label" className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <h2 id="photos-label" className="text-base">Photos <span aria-hidden="true" className="text-brand">*</span></h2>
        <span className="text-gray-500">{photos.length}/{MAX_LISTING_PHOTOS}</span>
      </div>
      <input ref={input} type="file" accept={LISTING_PHOTO_TYPES.join(",")} multiple hidden disabled={busy || full}
        onChange={event => { const files = Array.from(event.target.files ?? []); event.target.value = ""; void addPhotos(files); }} />

      {photos.length > 0 && (
        <ul aria-label="Selected photos" className="grid grid-cols-3 gap-3">
          {photos.map((photo, index) => (
            <li key={photo.id} className="relative min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
              <Image src={photo.src} alt={`Item photo ${index + 1}: ${photo.name}`} width={160} height={160} unoptimized className="aspect-square w-full object-cover" />
              <button type="button" aria-label={`Remove photo ${index + 1}`} disabled={busy}
                onClick={() => { onChange(photos.filter(item => item.id !== photo.id)); setNotice(`Photo ${index + 1} removed.`); }}
                className="absolute top-0 right-0 flex size-11 items-center justify-center rounded-bl-xl bg-white/95 hover:bg-fuchsia-50 disabled:opacity-50">
                <Image src="/images/sell/close.svg" alt="" width={14} height={14} className="size-3.5" />
              </button>
              {index === 0 && <span className="absolute bottom-0 left-0 rounded-tr-lg bg-brand px-2 py-1 text-xs text-white">Cover</span>}
            </li>
          ))}
        </ul>
      )}

      <button id="listing-photos" type="button" aria-label={full ? "5 photos added" : "Add photos"}
        aria-describedby={`photos-hint${error ? " photos-error" : ""}`}
        disabled={busy || full} onClick={() => input.current?.click()}
        onDragOver={event => { event.preventDefault(); if (!full && !busy) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={event => { event.preventDefault(); setDragging(false); if (!full && !busy) void addPhotos(Array.from(event.dataTransfer.files)); }}
        className={`flex w-full scroll-mt-24 flex-col items-center justify-center rounded-xl border-2 px-4 py-5 text-center transition-colors disabled:cursor-default ${photos.length ? "min-h-24" : "min-h-40"} ${error ? "border-red-600" : dragging ? "border-brand" : "border-transparent"} ${dragging ? "bg-brand/10" : "bg-gray-200 hover:bg-gray-300/70"}`}>
        {!full && <Image src="/images/sell/photo.svg" alt="" width={27} height={35} className="h-[35px] w-[27px]" />}
        <span className="text-sm text-gray-600">{busy ? "Preparing photos…" : full ? "All 5 photos added" : photos.length ? "Add more photos" : "Tap to add photos"}</span>
        {!photos.length && <span className="navigation mt-1 text-[10px] font-medium leading-[14px] text-gray-600">Add up to 5 photos</span>}
      </button>
      <p id="photos-hint" className="text-xs leading-4 text-gray-500">Up to 5 photos · JPG, PNG or WebP · 5 MB each</p>
      {error && <p id="photos-error" className="text-sm text-red-700">{error}</p>}
      <p role="status" className={notice ? "break-words text-xs leading-5 text-gray-600" : "sr-only"}>{notice}</p>
    </section>
  );
}
