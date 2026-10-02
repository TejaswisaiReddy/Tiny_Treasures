import Image from "next/image";
import Link from "next/link";
import type { CartItem } from "@/components/cart-provider";
import { formatCartPrice, MAX_DEMO_QUANTITY } from "@/lib/cart";

type CartItemCardProps = CartItem & {
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
};

export function CartItemCard({ product, quantity, onQuantityChange, onRemove }: CartItemCardProps) {
  const itemHref = `/items/${product.id}?from=%2Fcart`;
  return (
    <article aria-label={product.name} className="relative flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-3 min-[380px]:gap-4 min-[380px]:p-4">
      <Link href={itemHref} aria-label={`View ${product.name}`} className="shrink-0 rounded-lg">
        <Image src={`/images/${product.image}.png`} alt={product.name} width={96} height={96} className="size-[72px] rounded-lg object-cover min-[380px]:size-24" />
      </Link>
      <div className="min-w-0 flex-1">
        <h3 className="pr-8 text-base font-medium leading-5"><Link href={itemHref}>{product.name}</Link></h3>
        <button type="button" aria-label={`Remove ${product.name} from cart`} onClick={onRemove} className="absolute top-1 right-1 flex size-11 items-center justify-center rounded-full hover:bg-gray-50"><Image src="/images/cart/remove.svg" alt="" width={14} height={15} className="h-[15px] w-[14px]" /></button>
        <p className="text-sm leading-5 text-gray-600">{product.shortDescription ?? `Size: ${product.size}`}</p>
        <span className="navigation mt-1 inline-flex max-w-full items-center gap-1 rounded-xl bg-[#54dc2f]/20 px-3 py-1 text-xs font-semibold leading-4"><Image src="/images/cart/condition.svg" alt="" width={20} height={20} className="size-5 shrink-0" />{product.condition}</span>
        <div className="navigation mt-2 flex flex-wrap items-center justify-between gap-x-2">
          <div role="group" aria-label={`Quantity for ${product.name}`} className="flex items-center rounded-lg border border-gray-200">
            <button type="button" aria-label={`Decrease quantity of ${product.name}`} disabled={quantity === 1} onClick={() => onQuantityChange(quantity - 1)} className="flex h-8 w-7 items-center justify-center rounded-l-lg font-bold text-brand hover:bg-fuchsia-50 disabled:cursor-not-allowed disabled:text-gray-400">−</button>
            <span aria-label={`Quantity: ${quantity}`} className="min-w-4 text-center text-sm tabular-nums">{quantity}</span>
            <button type="button" aria-label={`Increase quantity of ${product.name}`} disabled={quantity === MAX_DEMO_QUANTITY} onClick={() => onQuantityChange(quantity + 1)} className="flex h-8 w-7 items-center justify-center rounded-r-lg font-bold text-brand hover:bg-fuchsia-50 disabled:cursor-not-allowed disabled:text-gray-400">+</button>
          </div>
          <p aria-label={`Line total ${formatCartPrice(Math.round(product.price * 100) * quantity)}`} className="whitespace-nowrap text-lg font-semibold tabular-nums text-brand min-[380px]:text-xl">{formatCartPrice(Math.round(product.price * 100) * quantity)}</p>
        </div>
        {quantity > 1 && <p className="mt-1 text-right text-xs text-gray-500">{formatCartPrice(Math.round(product.price * 100))} each</p>}
      </div>
    </article>
  );
}
