"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ItemDialog } from "@/components/item-dialog";
import { ListingCondition } from "@/components/listing-condition";
import { useListingDraft } from "@/components/listing-draft-provider";
import { batchStorageKey, parseBatch, type BatchListing } from "@/lib/batch-listing";
import { collectListingPhotos, emptyListing, LISTING_PHOTO_TYPES, listingNeedsSize, parseListingPrice, validateListing, type ListingDraft } from "@/lib/listing";
import { readListingPhoto } from "@/lib/listing-photo";
import { conditionDescriptions, displayBrand } from "@/lib/listing-presentation";
import { filterOptions } from "@/lib/product-filters";

const control = "mt-1.5 min-h-11 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-ink focus:border-brand";
const primary = "flex min-h-12 w-full items-center justify-center rounded-xl bg-brand px-4 py-3 text-sm font-medium text-white hover:bg-brand/90 disabled:opacity-40";

export default function BatchListingScreen() {
  const { batch, setBatch, setDraft, setPhotos } = useListingDraft();
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const busyRef = useRef(false);
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [postDialog, setPostDialog] = useState(false);
  const [removed, setRemoved] = useState<{ item: BatchListing; index: number } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function update(id: string, field: keyof ListingDraft, value: string) {
    setBatch(current => current.map(item => item.id === id ? { ...item, draft: { ...item.draft, [field]: value, ...(field === "category" ? { size: "" } : {}) } } : item));
    setErrors(current => ({ ...current, [id]: "" }));
  }
  async function add(files: File[]) {
    if (!files.length || busyRef.current) return;
    busyRef.current = true; setBusy(true); setNotice("");
    try {
      const result = await collectListingPhotos(files, batch.map(item => item.photo), readListingPhoto);
      const next = result.photos.slice(batch.length).map(photo => ({ id: crypto.randomUUID(), sample: false, photo, draft: { ...emptyListing, title: photo.name.replace(/\.[^.]+$/, "").slice(0, 80) } }));
      setBatch(current => [...current, ...next]);
      if (next.length) { setEditingId(next[0].id); setRemoved(null); }
      setNotice(result.errors.length ? result.errors.join(" ") : `${next.length} item${next.length === 1 ? "" : "s"} added. Fill in the details for each photo.`);
    } finally { busyRef.current = false; setBusy(false); }
  }
  function save() {
    try { localStorage.setItem(batchStorageKey, JSON.stringify(batch)); setNotice(`${batch.length} draft${batch.length === 1 ? "" : "s"} saved on this device.`); setPostDialog(false); }
    catch { setNotice("Could not save. Storage may be full or unavailable. Your items are still on this page."); setPostDialog(false); }
  }
  function restore() {
    try { const raw = localStorage.getItem(batchStorageKey); if (!raw) { setNotice("No saved batch on this device yet."); return; } setBatch(parseBatch(raw)); setEditingId(null); setErrors({}); setRemoved(null); setNotice("Saved batch restored."); }
    catch { setNotice("Could not restore this batch. The saved data may be damaged or browser storage unavailable."); }
  }
  function post() {
    const nextErrors: Record<string, string> = {};
    for (const item of batch) {
      const invalid = Object.values(validateListing(item.draft, 1));
      if (invalid.length) nextErrors[item.id] = invalid.join(" ");
    }
    setErrors(nextErrors);
    const first = Object.keys(nextErrors)[0];
    if (first) { setEditingId(first); setNotice("Review the highlighted item details before posting."); document.getElementById(`batch-${first}`)?.scrollIntoView({ block: "center" }); return; }
    if (batch.length) setPostDialog(true);
  }
  function preview(item: BatchListing) {
    const invalid = Object.values(validateListing(item.draft, 1));
    if (invalid.length) { setErrors(current => ({ ...current, [item.id]: invalid.join(" ") })); setEditingId(item.id); return; }
    setDraft({ ...item.draft }); setPhotos([{ ...item.photo }]); router.push("/sell/preview");
  }

  return <div className="mx-auto min-h-dvh w-full max-w-[412px] bg-[#faf9fb] shadow-sm">
    <header className="grid h-16 grid-cols-[44px_1fr_44px] items-center border-b border-gray-100 bg-white px-3"><Link href="/sell" aria-label="Back to selling" className="flex size-11 items-center justify-center"><Image src="/images/sell/back.svg" alt="" width={16} height={16} /></Link><h1 className="text-center text-lg font-medium text-brand">AI Assisted Listing</h1><Link href="/sell" aria-label="Close batch listing" className="flex size-11 items-center justify-center"><Image src="/images/sell/close.svg" alt="" width={14} height={14} /></Link></header>
    <main className="space-y-5 px-4 pt-5 pb-[calc(152px+env(safe-area-inset-bottom))]">
      <section aria-labelledby="batch-heading"><div className="flex items-center gap-2"><Image src="/images/sell/sparkles.svg" alt="" width={22} height={22} className="rounded-md bg-brand p-0.5" /><h2 id="batch-heading" className="font-medium text-brand">A few treasures, one little batch</h2></div><p className="mt-2 text-sm leading-5 text-gray-500">One photo per item. Review the brand, condition, and price before posting.</p><p className="mt-2 text-xs leading-4 text-gray-400">Sample suggestions shown below. AI auto-fill is coming soon.</p></section>
      <div className="flex gap-3 overflow-x-auto pt-2 pb-1" aria-label="Items in this batch">{batch.map((item, index) => <button key={item.id} type="button" aria-label={`Jump to item ${index + 1}: ${item.draft.title}`} onClick={() => document.getElementById(`batch-${item.id}`)?.focus()} className="relative h-24 w-[72px] shrink-0 rounded-xl border border-purple-200 bg-white p-1"><Image src={item.photo.src} alt="" width={62} height={84} unoptimized className="h-full w-full rounded-lg object-cover" /><span className="absolute -top-2 -right-1 flex size-5 items-center justify-center rounded-full bg-brand text-[10px] text-white">{index + 1}</span></button>)}<button type="button" disabled={busy || batch.length >= 5} onClick={() => input.current?.click()} className="flex h-24 w-[72px] shrink-0 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-purple-300 bg-purple-50/50 text-brand disabled:opacity-40"><span aria-hidden="true" className="text-xl">+</span><span className="text-[10px]">Add item</span></button></div>
      <div className="flex items-center justify-between gap-2"><h2 className="text-sm font-medium">Your items <span className="text-gray-400">({batch.length}/5)</span></h2><button type="button" onClick={restore} disabled={busy} className="min-h-11 text-xs text-brand underline">Restore saved batch</button></div>
      {notice && <p role="status" className="rounded-xl border border-purple-100 bg-purple-50 p-3 text-sm leading-5 text-brand">{notice}</p>}
      {removed && <div className="flex items-center justify-between gap-3 rounded-xl bg-gray-100 px-3 py-2 text-sm"><p className="min-w-0 truncate">Removed {removed.item.draft.title || "item"}</p><button type="button" disabled={batch.length >= 5 || busy} onClick={() => { const next = [...batch]; next.splice(removed.index, 0, removed.item); setBatch(next); setRemoved(null); }} className="min-h-11 text-brand underline disabled:opacity-40">Undo</button></div>}
      {batch.length === 0 && <div className="rounded-2xl border border-dashed border-purple-200 bg-white px-5 py-10 text-center"><h2 className="font-medium">Room for more little treasures</h2><p className="mt-2 text-sm text-gray-500">Add a photo to start your first listing.</p></div>}
      <div className="space-y-4">{batch.map((item, index) => {
        const draft = item.draft;
        const expanded = editingId === item.id;
        const cents = parseListingPrice(draft.price);
        return <article id={`batch-${item.id}`} key={item.id} tabIndex={-1} className={`scroll-mt-5 rounded-2xl border bg-white p-4 ${errors[item.id] ? "border-red-400" : "border-[#e9e2ed]"}`}>
          <div className="flex items-center justify-between gap-3"><span className="rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-medium text-brand">{item.sample ? "Sample suggestion" : "Your draft"} · {index + 1}</span><button type="button" disabled={busy} aria-label={`Remove ${draft.title || `item ${index + 1}`}`} onClick={() => { setRemoved({ item, index }); setBatch(current => current.filter(other => other.id !== item.id)); }} className="flex size-11 items-center justify-center rounded-lg hover:bg-gray-50 disabled:opacity-40"><Image src="/images/cart/remove.svg" alt="" width={16} height={18} /></button></div>
          <p className="mt-1 text-[10px] font-medium tracking-wider text-gray-400 uppercase">Title</p><h3 className="mt-1 break-words text-base font-medium">{draft.title || "Untitled item"}</h3>
          <p className={`mt-1 text-sm ${draft.brand?.trim() ? "font-medium text-gray-600" : "text-gray-400"}`}>{displayBrand(draft.brand)}</p>
          <div className="mt-4 grid grid-cols-2 gap-3"><div><p className="text-[10px] tracking-wider text-gray-400 uppercase">Category</p><p className="mt-1 text-sm">{draft.category || "Choose category"}</p></div><div><p className="text-[10px] tracking-wider text-gray-400 uppercase">Price</p><p className="mt-1 font-medium text-brand">{cents === null ? "Set a price" : `€${(cents / 100).toFixed(2)}`}</p></div></div>
          <div className="mt-3 flex flex-wrap items-center gap-2"><ListingCondition condition={draft.condition} />{draft.size && <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">{draft.size}</span>}</div>
          {draft.condition && <p className="mt-2 text-xs leading-4 text-gray-500">{conditionDescriptions[draft.condition]}</p>}
          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-1"><button type="button" disabled={busy} aria-expanded={expanded} aria-controls={`edit-${item.id}`} onClick={() => setEditingId(expanded ? null : item.id)} className="min-h-11 text-sm font-medium text-brand">{expanded ? "Done editing" : "Edit details"}</button><button type="button" disabled={busy} onClick={() => preview(item)} className="min-h-11 text-sm text-gray-500">Preview →</button></div>
          {expanded && <div id={`edit-${item.id}`} className="mt-2 space-y-3 border-t border-gray-100 pt-4">
            <label className="block text-xs font-medium text-gray-600">Title<input value={draft.title} maxLength={80} onChange={event => update(item.id, "title", event.target.value)} className={control} /></label>
            <div className="grid grid-cols-2 gap-3"><label className="block min-w-0 text-xs font-medium text-gray-600">Brand<input value={draft.brand ?? ""} list="batch-brands" maxLength={80} placeholder="Brand or unbranded" onChange={event => update(item.id, "brand", event.target.value)} className={control} /></label><label className="block min-w-0 text-xs font-medium text-gray-600">Price (€)<input value={draft.price} inputMode="decimal" maxLength={9} placeholder="0.00" onChange={event => update(item.id, "price", event.target.value)} className={control} /></label></div>
            <label className="block text-xs font-medium text-gray-600">Category<select value={draft.category} onChange={event => update(item.id, "category", event.target.value)} className={control}><option value="">Select category</option>{filterOptions.categories.map(category => <option key={category}>{category}</option>)}</select></label>
            {listingNeedsSize(draft.category) && <label className="block text-xs font-medium text-gray-600">Size<select value={draft.size} onChange={event => update(item.id, "size", event.target.value)} className={control}><option value="">Select size</option>{filterOptions.sizes.map(size => <option key={size}>{size}</option>)}<option>One size</option></select></label>}
            <label className="block text-xs font-medium text-gray-600">Condition<select value={draft.condition} onChange={event => update(item.id, "condition", event.target.value)} className={control}><option value="">Choose condition</option>{filterOptions.conditions.map(condition => <option key={condition}>{condition}</option>)}</select></label>
            <label className="block text-xs font-medium text-gray-600">Description & signs of wear<textarea value={draft.description} rows={3} maxLength={2000} onChange={event => update(item.id, "description", event.target.value)} className={`${control} resize-y`} /></label>
          </div>}
          {errors[item.id] && <p role="alert" className="mt-3 text-sm leading-5 text-red-700">{errors[item.id]}</p>}
        </article>;
      })}</div>
      <datalist id="batch-brands">{filterOptions.brands.map(brand => <option key={brand} value={brand} />)}<option value="Unbranded" /></datalist>
      <input ref={input} type="file" accept={LISTING_PHOTO_TYPES.join(",")} multiple hidden onChange={event => { const files = Array.from(event.target.files ?? []); event.target.value = ""; void add(files); }} />
      <button type="button" disabled={busy || batch.length >= 5} onClick={() => input.current?.click()} className="mx-auto flex min-h-12 items-center justify-center gap-2 rounded-full border border-purple-200 bg-white px-5 text-sm text-brand disabled:opacity-40">+ {busy ? "Preparing photos…" : "Scan More Items"}</button>
      <p className="text-center text-xs leading-5 text-gray-400">Choose photos · Up to 5 items · JPG, PNG or WebP<br />Save your drafts before refreshing or leaving Sell.</p>
    </main>
    <footer className="fixed bottom-0 left-1/2 z-20 w-full max-w-[412px] -translate-x-1/2 border-t border-gray-100 bg-white px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))]"><button type="button" onClick={post} disabled={!batch.length || busy} className={primary}>Post All {batch.length} Listing{batch.length === 1 ? "" : "s"}</button><button type="button" disabled={!batch.length || busy} onClick={save} className="min-h-11 w-full text-sm text-brand">Save all as drafts</button></footer>
    {postDialog && <ItemDialog title="Your listings are ready to review" onClose={() => setPostDialog(false)}><p className="text-sm leading-6 text-gray-600">Publishing is not available yet. Your {batch.length} items have not been posted. Save all drafts on this device to keep your photos and edits.</p><button type="button" onClick={save} className={`${primary} mt-5`}>Save all drafts</button><button type="button" onClick={() => setPostDialog(false)} className="mt-2 min-h-11 w-full text-sm text-brand">Keep reviewing</button></ItemDialog>}
  </div>;
}
