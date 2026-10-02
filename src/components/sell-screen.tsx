"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode, type SelectHTMLAttributes } from "react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { ItemDialog } from "@/components/item-dialog";
import { ListingPhotoUpload } from "@/components/listing-photo-upload";
import { loadListing } from "@/lib/saved-listing";
import { conditionDescriptions } from "@/lib/listing-presentation";
import { useListingDraft } from "@/components/listing-draft-provider";
import { filterOptions } from "@/lib/product-filters";
import { listingNeedsSize, validateListing, type ListingDraft, type ListingErrors } from "@/lib/listing";

const controlClass = "min-h-12 w-full min-w-0 scroll-mt-24 rounded-xl border border-brand bg-white px-4 py-3 text-base text-ink placeholder:text-gray-500 focus:border-brand aria-invalid:border-red-600";

function ListingField({ name, label, error, required = true, children }: { name: string; label: string; error?: string; required?: boolean; children: ReactNode }) {
  return (
    <div className="min-w-0 space-y-2">
      <label htmlFor={`listing-${name}`} className="block text-base">{label}{required && <span aria-hidden="true" className="text-brand"> *</span>}</label>
      {children}
      {error && <p id={`listing-${name}-error`} className="text-sm leading-5 text-red-700">{error}</p>}
    </div>
  );
}

// Native selects keep keyboard support. Only one decorative arrow is rendered.
function ListingSelect({ children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select {...props} className={`${controlClass} appearance-none pr-9 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}>{children}</select>
      <Image src="/images/sell/chevron.svg" alt="" width={21} height={21} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2" />
    </div>
  );
}

export default function SellScreen() {
  const router = useRouter();
  const [draftNotice, setDraftNotice] = useState("");
  const { draft, setDraft, photos, setPhotos } = useListingDraft();
  const [errors, setErrors] = useState<ListingErrors>({});
  const [uploading, setUploading] = useState(false);
  const [dialog, setDialog] = useState<"ai" | "profile" | null>(null);
  const needsSize = listingNeedsSize(draft.category);

  function update(name: keyof ListingDraft, value: string) {
    setDraft(current => ({ ...current, [name]: value, ...(name === "category" ? { size: "" } : {}) }));
    setErrors(current => ({ ...current, [name]: undefined, ...(name === "category" ? { size: undefined } : {}) }));
  }

  function fieldProps(name: keyof ListingDraft) {
    return {
      id: `listing-${name}`,
      name,
      value: draft[name],
      "aria-invalid": Boolean(errors[name]),
      "aria-describedby": errors[name] ? `listing-${name}-error` : undefined,
    };
  }

  function preview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (uploading) return;
    const nextErrors = validateListing(draft, photos.length);
    setErrors(nextErrors);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      document.getElementById(`listing-${firstError}`)?.focus();
      return;
    }
    router.push("/sell/preview");
  }

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[412px] bg-white shadow-sm">
      <a href="#sell-content" className="sr-only focus:not-sr-only focus:block focus:p-3">Skip to listing form</a>
      <header className="sticky top-0 z-20 grid h-16 grid-cols-[44px_1fr_44px] items-center border-b border-gray-200 bg-white px-3">
        <Link href="/" aria-label="Back to home" className="flex size-11 items-center justify-center rounded-full hover:bg-gray-50"><Image src="/images/sell/back.svg" alt="" width={16} height={16} className="size-4" /></Link>
        <h1 className="navigation text-center text-xl font-semibold text-brand">List an Item</h1>
        <Link href="/" aria-label="Close listing form" className="flex size-11 items-center justify-center rounded-full hover:bg-gray-50"><Image src="/images/sell/close.svg" alt="" width={14} height={14} className="size-3.5" /></Link>
      </header>

      <main id="sell-content" className="px-4 pt-4 pb-[calc(96px+env(safe-area-inset-bottom))]">
        <form onSubmit={preview} noValidate className="space-y-4">
          <div className="flex flex-wrap justify-between gap-2 text-sm text-brand"><button type="button" onClick={() => {
            try { const saved = loadListing(); if (saved) { setDraft(saved.draft); setPhotos(saved.photos); setErrors({}); setDraftNotice("Saved draft restored."); } else setDraftNotice("No saved draft on this device yet."); }
            catch { setDraftNotice("Could not restore the saved draft. Browser storage may be unavailable or the draft damaged."); }
          }}>Restore saved draft</button><Link href="/sell/preview">View listing preview</Link></div>
          {draftNotice && <p role="status" className="text-sm text-gray-600">{draftNotice}</p>}
          <Link href="/sell/batch" className="flex min-h-12 items-center justify-between rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-sm font-medium text-brand"><span>Selling a few things? List multiple items</span><span aria-hidden="true"> →</span></Link>
          <ListingPhotoUpload photos={photos} error={errors.photos} onBusyChange={setUploading}
            onChange={next => { setPhotos(next); setErrors(current => ({ ...current, photos: undefined })); }} />
          {uploading ? <p className="text-center text-sm text-gray-500">Preparing selected photos…</p> : <Link href="/sell/capture" className="flex min-h-12 items-center justify-center rounded-xl border border-brand px-4 py-3 font-medium text-brand hover:bg-fuchsia-50">Take photos / Batch capture</Link>}

          <div className="space-y-2">
            <button type="button" onClick={() => setDialog("ai")} aria-describedby="ai-hint" className="flex min-h-[60px] w-full items-center justify-center gap-2 rounded-xl bg-brand px-3 py-4 text-xl font-medium text-white shadow-sm hover:bg-brand/90">
              <Image src="/images/sell/sparkles.svg" alt="" width={22} height={22} className="shrink-0" />
              <span>AI Auto-Fill Listing</span>
            </button>
            <p id="ai-hint" className="text-xs leading-4 text-gray-500">Coming soon. For now, add your item details below.</p>
          </div>

          <div className="space-y-4">
            <p className="text-xs leading-4 text-gray-500">Fields marked * are required.</p>
            <ListingField name="title" label="Title" error={errors.title}>
              <input {...fieldProps("title")} type="text" required maxLength={80} onChange={event => update("title", event.target.value)} placeholder="e.g. Blue Denim Jacket" className={controlClass} />
            </ListingField>

            <ListingField name="price" label="Price (€)" error={errors.price}>
              <div className="relative">
                <span aria-hidden="true" className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gray-600">€</span>
                <input {...fieldProps("price")} type="text" inputMode="decimal" required maxLength={9} onChange={event => update("price", event.target.value)} placeholder="0.00" className={`${controlClass} pl-9`} />
              </div>
            </ListingField>

            <div className="grid grid-cols-2 items-start gap-3">
              <ListingField name="category" label="Category" error={errors.category}>
                <ListingSelect {...fieldProps("category")} required onChange={event => update("category", event.target.value)}>
                  <option value="" disabled>Select</option>
                  {filterOptions.categories.map(category => <option key={category}>{category}</option>)}
                </ListingSelect>
              </ListingField>
              <ListingField name="size" label="Size" required={needsSize} error={errors.size}>
                <ListingSelect {...fieldProps("size")} aria-describedby={errors.size ? "listing-size-error size-hint" : "size-hint"} required={needsSize} disabled={!needsSize} onChange={event => update("size", event.target.value)}>
                  <option value="" disabled>{needsSize ? "Select" : "Not needed"}</option>
                  {filterOptions.sizes.map(size => <option key={size}>{size}</option>)}
                  {draft.size && draft.size !== "One size" && !filterOptions.sizes.some(size => size === draft.size) && <option>{draft.size}</option>}
                  <option>One size</option>
                </ListingSelect>
              </ListingField>
            </div>
            <p id="size-hint" className="text-xs leading-4 text-gray-500">{needsSize ? "Choose the size shown on the label." : "Size is only needed for clothes and accessories."}</p>

            <ListingField name="condition" label="Condition" error={errors.condition}>
              <ListingSelect {...fieldProps("condition")} required onChange={event => update("condition", event.target.value)}>
                <option value="" disabled>Select condition</option>
                {filterOptions.conditions.map(condition => <option key={condition}>{condition}</option>)}
              </ListingSelect>
              <p className="text-xs leading-5 text-gray-500">{conditionDescriptions[draft.condition] || "Check for stains, holes, fading, and working fasteners before choosing."}</p>
            </ListingField>

            <ListingField name="description" label="Description" error={errors.description}>
              <textarea {...fieldProps("description")} required maxLength={2000} rows={4} onChange={event => update("description", event.target.value)} placeholder="Include the brand, condition and any signs of wear. What should the next family know?" className={`${controlClass} block min-h-28 resize-y leading-6`} />
            </ListingField>
            <div className="grid grid-cols-2 gap-3">
              <ListingField name="brand" label="Brand" required={false}><input id="listing-brand" value={draft.brand ?? ""} list="listing-brands" maxLength={80} onChange={event => update("brand", event.target.value)} placeholder="e.g. H&M" className={controlClass} /><datalist id="listing-brands">{filterOptions.brands.map(brand => <option key={brand} value={brand} />)}<option value="Unbranded" /></datalist></ListingField>
              <ListingField name="color" label="Color" required={false}><input id="listing-color" value={draft.color ?? ""} maxLength={80} onChange={event => update("color", event.target.value)} placeholder="e.g. Navy Black" className={controlClass} /></ListingField>
            </div>
            <p className="text-xs leading-5 text-gray-500">Use the brand on the label. Choose Unbranded when there is no brand, or leave it blank if you’re unsure.</p>
          </div>

          <div className="space-y-3">
            {Object.values(errors).some(Boolean) && <p role="alert" className="text-sm leading-5 text-red-700">Check the highlighted fields before previewing.</p>}
            <button type="submit" disabled={uploading} className="min-h-14 w-full rounded-xl bg-brand px-4 py-4 text-xl font-medium text-white shadow-sm hover:bg-brand/90 disabled:cursor-wait disabled:opacity-50">{uploading ? "Preparing photos…" : "Preview Listing"}</button>
            <p className="text-center text-xs leading-4 text-gray-500">Preview before publishing. Your draft stays while you choose photos; refreshing or leaving Sell resets it.</p>
          </div>
        </form>
      </main>

      <BottomNavigation active="Sell" onUnavailable={() => setDialog("profile")} />
      {dialog === "ai" && <ItemDialog title="AI listing help" onClose={() => setDialog(null)}><p className="text-sm leading-6 text-gray-600">AI photo suggestions are coming soon. Your photos are not being analysed yet. You can enter your item details and preview the listing yourself.</p><button type="button" onClick={() => setDialog(null)} className="mt-4 min-h-12 w-full rounded-xl bg-brand px-4 py-3 font-medium text-white">Continue manually</button></ItemDialog>}
      {dialog === "profile" && <ItemDialog title="Your profile" onClose={() => setDialog(null)}><p className="text-sm leading-6 text-gray-600">Your account will be available in a later step.</p></ItemDialog>}
    </div>
  );
}
