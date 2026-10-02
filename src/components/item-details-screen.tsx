"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useFavorites } from "@/components/favorites-provider";
import { ItemDialog } from "@/components/item-dialog";
import { useCart } from "@/components/cart-provider";
import type { ItemDetails, Seller } from "@/lib/products";

function ItemIcon({ name, width = 20, height = width }: { name: string; width?: number; height?: number }) {
  return <Image src={`/images/item/${name}.svg`} alt="" width={width} height={height} className="shrink-0 object-contain" style={{ width, height }} />;
}

function InfoChip({ icon, children }: { icon: string; children: React.ReactNode }) {
  return <span className="flex min-h-10 items-center gap-2 rounded-xl bg-[#0fd1fc]/20 px-3 py-2 text-sm text-black"><ItemIcon name={icon} />{children}</span>;
}

function SellerCard({ seller, onViewShop }: { seller?: Seller; onViewShop: () => void }) {
  return (
    <section aria-label="Seller profile" className="navigation mx-4 rounded-2xl border border-gray-200 p-4">
      {seller ? <>
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-3">
            <Image src={seller.avatar} alt={seller.name} width={48} height={48} className="size-12 rounded-full border-2 border-brand object-cover p-0.5" />
            <div>
              <div className="flex items-center gap-1"><h2 className="text-xl font-semibold leading-7">{seller.name}</h2>{seller.verified && <ItemIcon name="verified" width={22} height={21} />}</div>
              {seller.verified && <p className="text-xs font-semibold tracking-wide text-brand">Verified Parent</p>}
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div className="mb-1 flex justify-end gap-0.5" aria-hidden="true">{[0, 1, 2, 3, 4].map(index => <ItemIcon key={index} name={index === 4 ? "rating-star-partial" : "rating-star"} width={13} height={13} />)}</div>
            <p className="text-[10px] text-gray-600">{seller.rating} ({seller.reviewCount} reviews)</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-gray-200 pt-2 text-[13px] text-gray-600">
          <p className="flex items-center gap-2"><ItemIcon name="trust" width={12} height={15} />Trust Score: {seller.rating}</p>
          <p className="flex items-center gap-2"><ItemIcon name="clock" width={15} />{seller.responseTime}</p>
        </div>
      </> : <><h2 className="text-xl font-semibold">Seller</h2><p className="mt-2 text-sm leading-5 text-gray-600">Seller information will be available when real listings are added.</p></>}
      <button type="button" onClick={onViewShop} className="mt-4 min-h-[50px] w-full rounded-xl border border-brand text-base text-brand hover:bg-fuchsia-50">View Shop</button>
      {seller && <Link href="/chat" className="mt-3 flex min-h-[50px] w-full items-center justify-center rounded-xl bg-brand text-base text-white hover:bg-brand/90">Message seller</Link>}
    </section>
  );
}

type DialogName = "photo" | "share" | "shop" | "offer" | "buy" | null;

export default function ItemDetailsScreen({ item, backHref }: { item: ItemDetails; backHref: string }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { product, seller } = item;
  const { favorites, toggleFavorite } = useFavorites();
  const saved = favorites.includes(product.id);
  const [dialog, setDialog] = useState<DialogName>(null);
  const [shareUrl, setShareUrl] = useState("");
  const [notice, setNotice] = useState("");
  const [offer, setOffer] = useState("");
  const [offerPreview, setOfferPreview] = useState(false);
  const [offerError, setOfferError] = useState("");
  const photo = `/images/${product.image}.png`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setNotice("Link copied.");
    } catch {
      setNotice("Select and copy the link below.");
    }
  }

  function previewOffer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = Number(offer);
    if (!Number.isFinite(value) || value <= 0 || value >= product.price) {
      setOfferError(`Enter an offer above €0 and below €${product.price.toFixed(2)}.`);
      return;
    }
    setOfferError("");
    setOfferPreview(true);
  }

  const titles = { photo: product.name, share: "Share this treasure", shop: seller ? `${seller.name}’s shop` : "Seller’s shop", offer: "Make an offer", buy: "Buy now" };

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[412px] bg-white shadow-sm">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-2">
        <div className="flex min-w-0 items-center gap-1">
          <Link href={backHref} aria-label={backHref === "/cart" ? "Back to cart" : "Back to browsing"} className="flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-gray-50"><ItemIcon name="back" width={16} /></Link>
          <Link href="/" className="navigation whitespace-nowrap text-[clamp(18px,5.8vw,24px)] font-bold text-brand">Tiny Treasures</Link>
        </div>
        <div className="flex shrink-0">
          <button type="button" aria-label="Share item" onClick={() => { setShareUrl(`${window.location.origin}/items/${product.id}`); setNotice(""); setDialog("share"); }} className="flex size-11 items-center justify-center rounded-full hover:bg-gray-50"><ItemIcon name="share" width={18} height={20} /></button>
          <button type="button" aria-label={saved ? "Remove from favorites" : "Save to favorites"} aria-pressed={saved} onClick={() => toggleFavorite(product.id)} className={`flex size-11 items-center justify-center rounded-full ${saved ? "bg-fuchsia-200 ring-1 ring-inset ring-brand" : "hover:bg-fuchsia-50"}`}><ItemIcon name="heart" width={20} height={19} /></button>
        </div>
      </header>

      <main className="pb-[calc(112px+env(safe-area-inset-bottom))]">
        <div className="px-4 pt-4">
          <button type="button" aria-label={`Enlarge photo of ${product.name}`} onClick={() => setDialog("photo")} className="relative block aspect-[380/475] w-full overflow-hidden bg-gray-100">
            <Image src={photo} alt={product.name} fill priority sizes="(max-width: 412px) calc(100vw - 32px), 380px" className="object-cover" />
            <span className="navigation absolute right-4 bottom-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold tracking-wide text-black shadow-sm backdrop-blur-sm">1/1</span>
          </button>
        </div>

        <section aria-labelledby="item-title" className="space-y-4 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0"><h1 id="item-title" className="text-xl font-medium leading-6 text-black">{product.name}</h1><p className="mt-1 text-xl font-medium text-brand">€ {product.price.toLocaleString("en-IE", { maximumFractionDigits: 2 })}</p></div>
            <span className="flex shrink-0 items-center gap-1 rounded-xl bg-[#54dc2f]/20 px-3 py-1 text-xs font-semibold tracking-wide text-black"><ItemIcon name="condition" />{product.condition}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <InfoChip icon="size">{item.sizeLabel}</InfoChip>
            {item.color && <InfoChip icon="color">{item.color}</InfoChip>}
            {product.brand && <div className="flex w-full"><InfoChip icon="tag">{product.brand}</InfoChip></div>}
          </div>
        </section>

        <section aria-labelledby="description-heading" className="border-t border-gray-200 px-4 py-6">
          <h2 id="description-heading" className="mb-2 text-xl font-medium text-black">Description</h2>
          <p className="text-base leading-5 text-gray-600">{item.description}</p>
          <p className="mt-4 flex items-center gap-2 text-sm text-gray-600"><ItemIcon name="pickup" width={16} height={20} />{item.pickup}</p>
        </section>

        <SellerCard seller={seller} onViewShop={() => setDialog("shop")} />

        <section aria-labelledby="guarantee-heading" className="navigation flex items-start gap-3 px-4 py-6">
          <ItemIcon name="guarantee" width={32} height={36} />
          <div className="min-w-0"><h2 id="guarantee-heading" className="text-xl font-semibold leading-7">Tiny Treasures Guarantee</h2><p className="mt-1 text-sm leading-5 text-gray-600">Secure payments and item protection for our parent-to-parent community.</p><p className="mt-2 text-xs text-gray-500">Coming with checkout. This sample listing is not available to purchase yet.</p></div>
        </section>
      </main>

      <footer className="navigation fixed bottom-0 left-1/2 z-20 grid w-full max-w-[412px] -translate-x-1/2 grid-cols-2 gap-4 border-t border-gray-100 bg-white/95 px-6 pt-4 pb-[calc(20px+env(safe-area-inset-bottom))] backdrop-blur-sm">
        <button type="button" onClick={() => setDialog("offer")} className="min-h-[60px] rounded-2xl border-2 border-brand px-2 text-base text-brand hover:bg-fuchsia-50">Make an offer</button>
        <button type="button" onClick={() => setDialog("buy")} className="min-h-[60px] rounded-2xl bg-[#9d1a8f] px-2 text-base text-white hover:bg-brand">Buy now</button>
      </footer>

      {dialog && <ItemDialog key={dialog} title={titles[dialog]} onClose={() => setDialog(null)}>
        {dialog === "photo" && <Image src={photo} alt={product.name} width={688} height={950} sizes="348px" className="max-h-[65dvh] w-full object-contain" />}
        {dialog === "share" && <div className="space-y-4"><label htmlFor="share-url" className="block text-sm text-gray-600">Item link</label><input id="share-url" readOnly value={shareUrl} onFocus={event => event.target.select()} className="w-full rounded-xl border border-filter-border p-3 text-sm" /><button type="button" onClick={copyLink} className="w-full rounded-xl bg-brand p-3 text-white">Copy link</button><p role="status" className="text-sm text-gray-600">{notice}</p></div>}
        {dialog === "shop" && <div className="space-y-4"><p className="text-sm text-gray-600">{seller ? "A preview of this seller’s sample listing." : "Seller shops will be available when real listings are added."}</p>{seller && <div className="flex gap-4 rounded-xl border border-gray-200 p-3"><Image src={photo} alt="" width={72} height={90} className="h-[90px] w-[72px] rounded-lg object-cover" /><div><h3 className="font-medium">{product.name}</h3><p className="mt-1 text-brand">€{product.price.toFixed(2)}</p><p className="mt-2 text-sm text-gray-600">{item.sizeLabel}</p></div></div>}</div>}
        {dialog === "offer" && <form onSubmit={previewOffer} className="space-y-4"><p className="text-sm leading-5 text-gray-600">Preview an offer for {product.name}. Sending offers will be available when accounts and messaging are added.</p><label htmlFor="offer-price" className="block text-sm font-medium">Your offer (€)</label><input id="offer-price" type="number" min="0.01" max={(product.price - 0.01).toFixed(2)} step="0.01" required inputMode="decimal" value={offer} onChange={event => { setOffer(event.target.value); setOfferPreview(false); setOfferError(""); }} aria-invalid={Boolean(offerError)} aria-describedby={offerError ? "offer-error" : undefined} placeholder={(product.price * 0.8).toFixed(2)} className="w-full rounded-xl border border-filter-border p-3" />{offerError && <p id="offer-error" role="alert" className="text-sm text-red-700">{offerError}</p>}<button type="submit" className="w-full rounded-xl bg-brand p-3 text-white">Preview offer</button>{offerPreview && <p role="status" className="rounded-xl bg-fuchsia-50 p-3 text-sm text-brand">Your offer would be €{Number(offer).toFixed(2)}. Nothing has been sent to the seller.</p>}</form>}
        {dialog === "buy" && <div className="space-y-4"><div className="flex justify-between gap-4 rounded-xl bg-gray-50 p-4"><p>{product.name}</p><p className="shrink-0 font-medium text-brand">€{product.price.toFixed(2)}</p></div><p className="text-sm leading-6 text-gray-600">Add this sample listing to your cart to review the total. No order or payment will be created.</p><button type="button" onClick={() => { addItem(product.id); router.push("/cart"); }} className="w-full rounded-xl bg-brand p-3 text-white">Add to cart and review</button></div>}
      </ItemDialog>}
    </div>
  );
}
