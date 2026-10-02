"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useListingDraft } from "@/components/listing-draft-provider";
import { checkPhoto, sampleListingPhoto } from "@/lib/listing-photo";

export default function PhotoAnalysisScreen() {
  const router = useRouter();
  const { photos, setPhotos } = useListingDraft();
  const [checked, setChecked] = useState(0);
  const [error, setError] = useState("");
  const count = photos.length || 1;
  const ready = checked === count && !error;
  const current = photos[Math.min(checked, photos.length - 1)] ?? sampleListingPhoto;

  useEffect(() => {
    let cancelled = false;
    async function prepare() {
      const selected = photos.length ? photos : [sampleListingPhoto];
      try {
        for (let index = 0; index < selected.length; index++) {
          await checkPhoto(selected[index].src);
          if (cancelled) return;
          setChecked(index + 1);
        }
      } catch (failure) {
        if (!cancelled) setError(failure instanceof Error ? failure.message : "Could not prepare the photos.");
      }
    }
    void prepare();
    return () => { cancelled = true; };
  }, [photos]);

  function continueListing() {
    if (!ready) return;
    if (!photos.length) setPhotos([{ ...sampleListingPhoto }]);
    router.push("/sell");
  }

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[412px] bg-white px-4 pt-6 pb-8 shadow-sm">
      <div className="relative overflow-hidden rounded-xl bg-[#ead7c9]">
        <Image src={current.src} alt={current.name} width={640} height={800} unoptimized priority className="aspect-[4/5] w-full object-contain" />
        {!ready && !error && <div aria-hidden="true" className="pointer-events-none absolute inset-0 animate-pulse bg-gradient-to-b from-brand/5 via-transparent to-brand/10 motion-reduce:animate-none" />}
        {!photos.length && <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs text-gray-600">Sample photo</span>}
      </div>
      <section aria-labelledby="photo-analysis-title" className="mx-auto mt-7 max-w-[300px] text-center">
        <div aria-live="polite" aria-atomic="true"><h1 id="photo-analysis-title" className="text-xl font-medium">{error ? "Could not prepare this photo" : ready ? "Your photos are ready" : "Preparing your photos…"}</h1><p className="mt-2 text-sm leading-5 text-gray-600">{error || (ready ? `${count} photo${count === 1 ? " is" : "s are"} ready for your listing.` : "Checking your images on this device.")}</p></div>
        <progress aria-label="Photo preparation progress" value={checked} max={count} className="mt-6 h-1 w-40 overflow-hidden rounded-full accent-brand [&::-webkit-progress-bar]:bg-fuchsia-100 [&::-webkit-progress-value]:bg-brand [&::-moz-progress-bar]:bg-brand" />
        <p className="mt-4 text-xs leading-5 text-gray-500">No upload or AI analysis is running. You can enter the item details on the next screen.</p>
        {ready && <button type="button" onClick={continueListing} className="mt-6 min-h-12 w-full rounded-xl bg-brand px-4 py-3 font-medium text-white hover:bg-brand/90">{photos.length ? "Continue to listing" : "Use sample photo"}</button>}
        <Link href="/sell/capture" className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg px-5 text-sm text-brand hover:bg-fuchsia-50">{ready || error ? "Back to photos" : "Cancel"}</Link>
      </section>
    </main>
  );
}
