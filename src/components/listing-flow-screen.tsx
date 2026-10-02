"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { ItemDialog } from "@/components/item-dialog";
import { useListingDraft } from "@/components/listing-draft-provider";
import { emptyListing, parseListingPrice, type ListingDraft } from "@/lib/listing";
import { sampleListingPhoto } from "@/lib/listing-photo";
import { removeSavedListing, saveListing } from "@/lib/saved-listing";
import { ListingCondition } from "@/components/listing-condition";
import { conditionDescriptions, displayBrand } from "@/lib/listing-presentation";

const sample: ListingDraft = { title: "H&M Jumpsuit", price: "5", category: "Clothes", size: "92 (1.5–2Y)", condition: "Excellent", brand: "H&M", color: "Navy Black", description: "Great condition, soft and comfy. Easy to wear for playtime, outings, or casual days. Only used for one season." };
const primary = "flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 font-medium text-white shadow-md hover:bg-brand/90 disabled:opacity-60";
const secondary = "flex min-h-12 items-center justify-center gap-2 rounded-xl border border-brand px-4 py-3 text-brand hover:bg-fuchsia-50";

export default function ListingFlowScreen({ failed = false }: { failed?: boolean }) {
  const router = useRouter();
  const context = useListingDraft();
  const isSample = !context.photos.length;
  const draft = isSample ? sample : context.draft;
  const photos = isSample ? [sampleListingPhoto] : context.photos;
  const [selected, setSelected] = useState(0);
  const [dialog, setDialog] = useState<"discard" | "profile" | null>(null);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);

  function edit() {
    if (isSample) { context.setDraft({ ...sample }); context.setPhotos([{ ...sampleListingPhoto }]); }
    router.push("/sell");
  }
  function save() {
    try { saveListing(draft, photos); setNotice("Draft saved on this device. Restore it from List an Item."); }
    catch { setNotice("Could not save this draft. Device storage may be full or unavailable. Keep this page open and try again."); }
  }
  async function publish() {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setNotice("");
    try {
      // Validate local images before reaching the unavailable publishing service.
      const { checkPhoto } = await import("@/lib/listing-photo");
      await Promise.all(photos.map(photo => checkPhoto(photo.src)));
      if (failed) setNotice("Publishing is not available yet. Your photos and details are safe here; save a draft to keep them on this device.");
      else router.push("/sell/upload-failed");
    } catch {
      if (failed) setNotice("A photo could not be opened. Go back and replace it, then retry.");
      else router.push("/sell/upload-failed");
    } finally { pending.current = false; setBusy(false); }
  }
  function discard() {
    try { removeSavedListing(); }
    catch { setNotice("Could not remove the saved draft. Check your browser storage settings and try again."); setDialog(null); return; }
    context.setDraft({ ...emptyListing }); context.setPhotos([]); router.push("/sell");
  }

  return <div className="mx-auto min-h-dvh w-full max-w-[412px] bg-white shadow-sm">
    <header className="grid h-16 grid-cols-[44px_1fr_44px] items-center bg-white px-3">
      <button type="button" onClick={failed ? () => router.push("/sell/preview") : edit} aria-label="Go back" className="flex size-11 items-center justify-center rounded-full hover:bg-gray-50"><Image src="/images/sell/back.svg" alt="" width={16} height={16} /></button>
      <h1 className="text-center text-xl font-medium text-brand">{failed ? "Tiny Treasures" : "Listing Preview"}</h1>
      <Link href="/sell" aria-label="Close preview" className="flex size-11 items-center justify-center rounded-full hover:bg-gray-50"><Image src="/images/sell/close.svg" alt="" width={14} height={14} /></Link>
    </header>
    {failed ? <main className="px-4 pb-10">
      <div aria-hidden="true" className="relative mx-auto flex h-[330px] w-full items-start justify-center pt-11">
        <div className="absolute top-9 right-9 size-12 rounded-full bg-green-300/60 blur-md" />
        <div className="relative flex size-[190px] items-center justify-center rounded-xl border border-gray-200 bg-gradient-to-br from-purple-50 to-white shadow-[0_0_45px_20px_#faf5ff]">
          <span className="flex size-[68px] items-center justify-center rounded-full bg-[#f5800b] text-white"><svg width="38" height="30" viewBox="0 0 38 30" fill="none"><path d="m5 21 7-13 6 13 7-13 7 13" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" /></svg></span>
          <span className="absolute top-2 right-2 flex size-9 items-center justify-center rounded-full bg-orange-100 text-orange-500"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="3" width="14" height="18" rx="2" /><path d="m7 16 3-4 3 3 2-2 2 3M3 3l18 18" /><circle cx="14" cy="8" r="1" /></svg></span>
        </div>
        <div className="absolute top-36 right-14 size-16 rounded-full bg-yellow-200/80 blur-sm" />
        <div className="absolute top-48 left-6 size-16 rounded-full bg-yellow-200/80 blur-sm" />
      </div>
      <section aria-labelledby="upload-error-title" className="text-center">
        <h2 id="upload-error-title" className="text-2xl">Something went wrong</h2>
        <p className="mx-auto mt-2 max-w-[290px] text-sm leading-5 text-gray-600">We couldn’t upload your photos. Please check your connection and try again.</p>
        <div className="mt-12 space-y-4">
          <button type="button" disabled={busy} onClick={() => void publish()} className={primary}><span aria-hidden="true">⟳</span>{busy ? "Retrying…" : "Retry Upload"}</button>
          <button type="button" disabled={busy} onClick={save} className={`${secondary} w-full`}>Save as Draft</button>
        </div>
      </section>
      <aside className="mt-6 flex gap-3 rounded-xl border border-gray-200 p-4"><span aria-hidden="true" className="text-xl text-orange-500">☼</span><div><h3 className="text-sm">Quick Tip</h3><p className="mt-1 text-xs leading-4 text-gray-500">Switching to Wi-Fi usually fixes large photo upload issues.</p></div></aside>
      <p className="mt-8 text-center text-xs text-gray-500">Error Code: LST_PHOTO_403</p>
      <p className="mt-3 text-center text-xs leading-5 text-gray-500">Publishing is not available in this preview app yet.</p>
      {notice && <p role="status" className="mt-4 rounded-xl bg-fuchsia-50 p-3 text-sm leading-5 text-brand">{notice}</p>}
    </main> : <>
      <main className="space-y-4 px-4 pt-2 pb-6">
        <p className="flex min-h-[60px] items-center gap-3 rounded-xl bg-[#f5800b] px-4 py-3 text-sm leading-4 text-white"><span aria-hidden="true" className="text-xl">ⓘ</span><span>Double check your details before<br /> publishing!</span></p>
        <article className="overflow-hidden rounded-xl border border-gray-200">
          <div className="relative bg-gray-50">
            <Image src={photos[selected]?.src ?? photos[0].src} alt={draft.title} width={640} height={760} priority unoptimized className="aspect-[380/450] w-full object-cover" />
            <span className="absolute right-4 bottom-4 rounded-full bg-white/95 px-3 py-1 text-xs text-gray-600">{isSample ? "Sample listing" : "Listing preview"}</span>
          </div>
          {photos.length > 1 && <div className="flex gap-2 overflow-x-auto p-3">{photos.map((photo, index) => <button type="button" key={photo.id} onClick={() => setSelected(index)} aria-label={`View photo ${index + 1}`} aria-pressed={index === selected} className={`shrink-0 overflow-hidden rounded-lg border-2 ${index === selected ? "border-brand" : "border-transparent"}`}><Image src={photo.src} alt="" width={48} height={48} unoptimized className="size-12 object-cover" /></button>)}</div>}
          <div className="space-y-4 p-4">
            <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h2 className="break-words text-xl font-medium">{draft.title}</h2><p className="text-sm text-gray-500">{isSample ? "Kids: Ages 1 and 3" : draft.category}</p></div><p className="shrink-0 text-xl font-medium text-brand">EUR {((parseListingPrice(draft.price) ?? 0) / 100).toLocaleString("en", { maximumFractionDigits: 2 })}</p></div>
            <dl className="grid grid-cols-2 gap-2">{[["Condition", draft.condition], ["Brand", displayBrand(draft.brand)], ["Size", draft.size || "One size"], ["Color", draft.color || "Not specified"]].map(([label, value]) => <div key={label} className="min-w-0 rounded-xl border border-gray-200 bg-[#fcfbfd] px-3 py-2"><dt className="mb-1 text-[10px] font-medium tracking-wider text-gray-500 uppercase">{label}</dt><dd className={`break-words text-sm ${label === "Brand" ? "font-medium text-gray-700" : ""}`}>{label === "Condition" ? <ListingCondition condition={value} /> : value}</dd></div>)}</dl>
            <p className="text-xs leading-5 text-gray-500">{conditionDescriptions[draft.condition]} Condition is described by the seller.</p>
            <section><h3 className="text-lg font-medium">Description</h3><p className="mt-1 whitespace-pre-wrap break-words text-sm leading-[18px] text-gray-600">{draft.description}</p></section>
            {isSample ? <div className="flex items-center justify-between gap-2 pt-2"><div className="flex items-center gap-3"><Image src="/images/item/seller-aisha.png" alt="Aisha" width={44} height={44} className="size-11 rounded-full object-cover" /><div><div className="flex items-center gap-1"><span className="text-lg font-medium">Aisha</span><Image src="/images/item/verified.svg" alt="Verified" width={18} height={18} /></div><p className="text-xs text-brand">Verified Parent</p></div></div><div className="text-right"><p aria-label="4.9 out of 5 stars" className="text-sm tracking-tight text-yellow-400">★★★★★</p><p className="text-[10px] text-gray-500">4.9 (12 reviews)</p></div></div> : <p className="border-t border-gray-100 pt-3 text-sm text-gray-500">Your listing · Not published</p>}
          </div>
        </article>
        <div className="grid grid-cols-2 gap-4"><button type="button" onClick={edit} className={secondary}><Image src="/images/checkout/edit.svg" alt="" width={18} height={18} />Edit Listing</button><button type="button" onClick={() => setDialog("discard")} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 hover:bg-gray-50"><Image src="/images/cart/remove.svg" alt="" width={18} height={18} />Discard</button></div>
        <button type="button" onClick={() => void publish()} disabled={busy} className={primary}><span aria-hidden="true">➤</span>{busy ? "Preparing listing…" : "Publish Listing"}</button>
        {isSample && <p className="text-center text-xs text-gray-500">Sample listing preview. Edit to make it yours.</p>}
        {notice && <p role="status" className="text-sm text-brand">{notice}</p>}
      </main>
      <BottomNavigation active="Home" fixed={false} onUnavailable={() => setDialog("profile")} />
    </>}
    {dialog && <ItemDialog title={dialog === "discard" ? "Discard this listing?" : "Your profile"} onClose={() => setDialog(null)}>{dialog === "discard" ? <><p className="text-sm leading-6 text-gray-600">Your photos, item details, and saved draft will be removed from this device.</p><button type="button" onClick={discard} className={`${primary} mt-5`}>Discard listing</button><button type="button" onClick={() => setDialog(null)} className={`${secondary} mt-3 w-full`}>Keep editing</button></> : <p className="text-sm leading-6 text-gray-600">Your account will be available in a later step.</p>}</ItemDialog>}
  </div>;
}
