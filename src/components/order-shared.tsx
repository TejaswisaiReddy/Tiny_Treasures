import Image from "next/image";
import Link from "next/link";
import { CheckoutIcon } from "@/components/checkout-icon";
import { OrderIcon } from "@/components/order-icon";
import { formatCartPrice } from "@/lib/cart";
import type { OrderItem } from "@/lib/order-preview";

export function OrderHeader({ confirmation = false }: { confirmation?: boolean }) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-1 border-b border-gray-100 bg-white px-3">
      <Link href={confirmation ? "/checkout" : "/order-confirmation"} aria-label={confirmation ? "Back to checkout" : "Back to order confirmation"} className="flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-fuchsia-50"><CheckoutIcon name="back" /></Link>
      {confirmation
        ? <p className="navigation flex-1 text-center text-lg font-bold tracking-tight text-brand">Tiny Treasures</p>
        : <h1 className="navigation flex-1 text-xl font-semibold text-brand">Track Order</h1>}
      <Link href="/" aria-label="Close and continue shopping" className="flex size-11 shrink-0 items-center justify-center rounded-full text-brand hover:bg-fuchsia-50"><OrderIcon name="close" /></Link>
    </header>
  );
}

export function OrderItemCard({ item, compact = false }: { item: OrderItem; compact?: boolean }) {
  const { product, quantity } = item;
  return (
    <Link href={`/items/${product.id}`} className={`flex min-w-0 items-center gap-3 rounded-xl ${compact ? "py-2" : "border border-gray-100 p-3 hover:border-filter-border"}`}>
      <Image src={`/images/${product.image}.png`} alt={product.name} width={compact ? 48 : 64} height={compact ? 48 : 64} className={`${compact ? "size-12" : "size-16"} shrink-0 rounded-lg bg-gray-100 object-cover`} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-5 [overflow-wrap:anywhere]">{product.name}</p>
        <p className="mt-0.5 text-xs leading-4 text-gray-600">Size: {product.size} · Qty: {quantity}</p>
      </div>
      {!compact && <p className="shrink-0 text-sm font-medium text-brand">{formatCartPrice(Math.round(product.price * 100) * quantity)}</p>}
    </Link>
  );
}
