import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";

export function ProductCard({ product, saved, onToggle, returnTo = "/" }: { product: Product; saved: boolean; onToggle: () => void; returnTo?: string }) {
  return (
    <article className="relative min-w-0">
      <Link href={`/items/${product.id}?from=${encodeURIComponent(returnTo)}`} aria-label={`View ${product.name}`} className="block rounded-xl">
      <div className="relative aspect-[184/192] overflow-hidden rounded-xl bg-stone-100">
        <Image src={`/images/${product.image}.png`} alt={product.name} fill sizes="(max-width: 412px) 46vw, 184px" className="object-cover" />
      </div>
      <div className="space-y-1 p-2">
        <h3 className="text-base font-medium leading-[19px]">{product.name}</h3>
        <p className="text-base leading-[19px] text-brand">€{product.price.toFixed(2)}</p>
        <div className="flex items-center gap-1 pt-1 text-[10px] text-gray-600">
          <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5">Size {product.size}</span>
          <Image src="/images/dot.png" alt="" width={8} height={10} />
          <span>{product.condition}</span>
        </div>
        <div className="flex items-center gap-1 pt-1 text-gray-600">
          <Image src="/images/location.svg" alt="" width={8} height={10} />
          <span className="text-sm">{product.location}</span>
          <Image src="/images/star.png" alt="Rating" width={8} height={10} />
          <span className="text-[10px]">{product.rating}</span>
        </div>
      </div>
      </Link>
      <button type="button" aria-label={`${saved ? "Remove" : "Save"} ${product.name}${saved ? " from favorites" : " to favorites"}`} aria-pressed={saved} onClick={onToggle} className={`absolute right-3 top-3 flex size-11 items-center justify-center rounded-full shadow-sm transition-colors ${saved ? "bg-fuchsia-200 ring-2 ring-brand" : "bg-white hover:bg-fuchsia-50"}`}>
        <Image src="/images/heart.svg" alt="" width={18} height={18} />
      </button>
    </article>
  );
}
