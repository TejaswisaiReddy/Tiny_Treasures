"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { CaptureIcon } from "@/components/capture-icon";
import { ItemDialog } from "@/components/item-dialog";
import { useListingDraft } from "@/components/listing-draft-provider";
import { collectListingPhotos, LISTING_PHOTO_TYPES, MAX_LISTING_PHOTOS } from "@/lib/listing";
import { readListingPhoto, sampleListingPhoto } from "@/lib/listing-photo";

export default function BatchCaptureScreen() {
  const router = useRouter();
  const { photos: savedPhotos, setPhotos: savePhotos } = useListingDraft();
  const [photos, setPhotos] = useState(savedPhotos);
  const [selected, setSelected] = useState(0);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [help, setHelp] = useState(false);
  const busyRef = useRef(false);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const full = photos.length >= MAX_LISTING_PHOTOS;
  const current = photos[selected] ?? photos[0];

  async function add(files: File[]) {
    if (!files.length || busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    try {
      const result = await collectListingPhotos(files, photos, readListingPhoto);
      setPhotos(result.photos);
      if (result.added) setSelected(result.photos.length - 1);
      setNotice(result.errors.length ? result.errors.join(" ") : `${result.added} photo${result.added === 1 ? "" : "s"} added.`);
    } finally { busyRef.current = false; setBusy(false); }
  }

  function done() {
    if (!photos.length || busy) return;
    savePhotos(photos);
    router.push("/sell/analyzing");
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[412px] flex-col bg-white shadow-sm">
      <header className="grid h-16 shrink-0 grid-cols-[52px_1fr_64px] items-center gap-2 px-3">
        <Link href="/sell" aria-label="Cancel photo capture" className="flex size-11 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"><Image src="/images/sell/close.svg" alt="" width={14} height={14} /></Link>
        <div className="min-w-0 text-center"><h1 className="navigation text-xs font-semibold tracking-[0.14em] text-brand">BATCH CAPTURE</h1><p className="mt-1 text-xs text-gray-500">{photos.length} of 5 photos ready</p></div>
        <button type="button" onClick={done} disabled={!photos.length || busy} className="min-h-11 rounded-xl bg-brand px-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40">Done</button>
      </header>

      <section aria-label="Selected photo preview" className="relative flex min-h-[360px] flex-1 items-center justify-center overflow-hidden bg-[#eceae6]">
        <Image src={current?.src ?? sampleListingPhoto.src} alt={current ? `Selected photo: ${current.name}` : "Sample jumpsuit showing where your photo will appear"} width={640} height={800} unoptimized className="h-[min(62dvh,620px)] min-h-[360px] w-full object-contain" priority />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-[12%] inset-y-[12%] rounded-2xl border-2 border-cyan-300/90 shadow-[0_0_24px_#67e8f940]" />
        <div className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1.5 text-xs text-gray-600">{current ? "Photo preview" : "Sample photo · Camera not active"}</div>
        <button type="button" onClick={() => setHelp(true)} className="absolute bottom-8 left-1/2 flex min-h-11 -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-cyan-200 px-4 py-2 text-xs font-medium text-cyan-950 shadow-sm"><CaptureIcon name="light" />Lighting tips</button>
        {current && <button type="button" disabled={busy} aria-label="Remove selected photo" onClick={() => { setPhotos(photos.filter(photo => photo.id !== current.id)); setSelected(0); setNotice("Photo removed."); }} className="absolute top-3 right-3 flex size-11 items-center justify-center rounded-full bg-white/95 disabled:opacity-40"><Image src="/images/sell/close.svg" alt="" width={14} height={14} /></button>}
      </section>

      <section aria-label="Photo controls" className="space-y-4 px-4 pt-5 pb-[calc(16px+env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-5 gap-2" aria-label="Captured photos">
          {Array.from({ length: MAX_LISTING_PHOTOS }, (_, index) => {
            const photo = photos[index];
            return <button type="button" key={photo?.id ?? `slot-${index}`} disabled={busy} onClick={() => photo ? setSelected(index) : galleryRef.current?.click()} aria-label={photo ? `View photo ${index + 1}` : `Add photo ${index + 1}`} aria-pressed={photo ? selected === index : undefined} className={`relative flex aspect-[4/5] min-w-0 items-center justify-center rounded-xl border-2 bg-white text-brand disabled:opacity-40 ${photo && selected === index ? "border-brand" : "border-cyan-200"} ${photo ? "" : "border-dashed"}`}>
              {photo ? <Image src={photo.src} alt="" width={72} height={90} unoptimized className="h-full w-full rounded-[10px] object-cover" /> : <span className="flex flex-col items-center gap-1"><CaptureIcon name="plus" /><span className="text-[10px]">Add</span></span>}
              {photo && <span className={`absolute -top-1.5 -right-1 flex size-5 items-center justify-center rounded-full text-[10px] text-white ${selected === index ? "bg-brand" : "bg-gray-500"}`}>{index + 1}</span>}
            </button>;
          })}
        </div>
        <div className="flex items-center justify-between px-2">
          <button type="button" aria-label="Photo lighting tips" onClick={() => setHelp(true)} className="flex size-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600"><CaptureIcon name="light" /></button>
          <button type="button" aria-label={full ? "Five-photo limit reached" : "Take a photo"} disabled={busy || full} onClick={() => cameraRef.current?.click()} className="flex size-20 items-center justify-center rounded-full border-2 border-brand bg-white p-1 disabled:cursor-not-allowed disabled:opacity-40"><span className="flex size-full items-center justify-center rounded-full bg-brand text-white"><CaptureIcon name="camera" /></span></button>
          <button type="button" aria-label="Choose photos from gallery" disabled={busy || full} onClick={() => galleryRef.current?.click()} className="flex size-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600 disabled:opacity-40"><CaptureIcon name="gallery" /></button>
        </div>
        <input ref={cameraRef} type="file" accept={LISTING_PHOTO_TYPES.join(",")} capture="environment" hidden onChange={event => { const files = Array.from(event.target.files ?? []); event.target.value = ""; void add(files); }} />
        <input ref={galleryRef} type="file" accept={LISTING_PHOTO_TYPES.join(",")} multiple hidden onChange={event => { const files = Array.from(event.target.files ?? []); event.target.value = ""; void add(files); }} />
        <p role="status" className="text-center text-xs leading-5 text-gray-600 [overflow-wrap:anywhere]">{busy ? "Preparing photos…" : notice || "JPG, PNG or WebP · Up to 5 MB each · Stored on this device only"}</p>
        {!photos.length && <button type="button" disabled={busy} onClick={() => { setPhotos([{ ...sampleListingPhoto }]); setSelected(0); setNotice("Sample photo added for this demo."); }} className="min-h-11 w-full text-sm text-brand underline">Try with a sample photo</button>}
      </section>
      {help && <ItemDialog title="Photo tips" onClose={() => setHelp(false)}><p className="text-sm leading-6 text-gray-600">Use natural light, a plain background, and show the whole item. Add close-ups of labels and any signs of wear. The blue outline is a framing guide, not AI detection.</p><p className="mt-3 text-sm leading-6 text-gray-600">The camera button opens your device camera where supported, or a file picker on desktop. Flash is controlled by your device camera.</p></ItemDialog>}
    </main>
  );
}
