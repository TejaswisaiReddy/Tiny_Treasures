"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { CartItemCard } from "@/components/cart-item-card";
import { CartOrderSummary } from "@/components/cart-order-summary";
import { useCart } from "@/components/cart-provider";
import { ItemDialog } from "@/components/item-dialog";
import { formatCartPrice, MAX_DEMO_QUANTITY } from "@/lib/cart";

type CartDialog = "info" | "Sell" | "Profile" | null;

export default function CartScreen() {
  const router = useRouter();
  const { items, totals, setQuantity, removeItem } = useCart();
  const [dialog, setDialog] = useState<CartDialog>(null);
  const [notice, setNotice] = useState("");
  const titles = { info: "About your demo cart", Sell: "Sell an item", Profile: "Your profile" };

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[412px] bg-white shadow-sm">
      <a href="#cart-content" className="sr-only focus:not-sr-only focus:block focus:p-3">Skip to cart</a>
      <header className="sticky top-0 z-20 grid h-16 grid-cols-[1fr_1.5fr_auto] items-center border-b border-gray-200 bg-white px-3">
        <Link href="/" aria-label="Back to shopping" className="flex size-11 items-center justify-center rounded-full hover:bg-gray-50"><Image src="/images/cart/back.svg" alt="" width={32} height={32} className="size-8" /></Link>
        <h1 className="navigation text-xl font-semibold text-brand">Cart</h1>
        <div className="flex justify-end"><button type="button" aria-label="Cart information" onClick={() => setDialog("info")} className="flex size-11 items-center justify-center rounded-full hover:bg-gray-50"><Image src="/images/cart/info.svg" alt="" width={36} height={36} className="size-9" /></button><Link href="/" aria-label="Close cart" className="flex size-11 items-center justify-center rounded-full hover:bg-gray-50"><Image src="/images/cart/close.svg" alt="" width={30} height={30} className="size-[30px]" /></Link></div>
      </header>

      <main id="cart-content" className="px-4 pt-6 pb-[calc(88px+env(safe-area-inset-bottom))]">
        <section aria-labelledby="cart-selections-heading">
          <h2 id="cart-selections-heading" className="mb-4 text-xs tracking-[0.6px] text-gray-600 uppercase">Your selections ({totals.itemCount})</h2>
          {items.length ? <div className="space-y-4">{items.map(item => <CartItemCard key={item.product.id} {...item} onQuantityChange={quantity => { setQuantity(item.product.id, quantity); setNotice(`${item.product.name} quantity changed to ${quantity}.`); }} onRemove={() => { removeItem(item.product.id); setNotice(`${item.product.name} removed from your cart.`); }} />)}</div> : <div className="rounded-xl border border-gray-200 px-4 py-10 text-center"><Image src="/images/cart.svg" alt="" width={36} height={36} className="mx-auto mb-4 size-9" /><h3 className="text-xl font-medium">Your cart is empty</h3><p className="mt-2 text-sm leading-5 text-gray-600">Browse the collection to find their next treasure.</p></div>}
        </section>

        <div className="mt-6"><CartOrderSummary totals={totals} /></div>
        <p className="navigation mt-4 flex items-center justify-center gap-2 text-center text-xs leading-4 text-gray-500"><Image src="/images/cart/protection.svg" alt="" width={12} height={15} className="h-[15px] w-3 shrink-0" />Secure payments &amp; buyer protection coming soon</p>

        <div className="mt-6 space-y-2">
          <button type="button" onClick={() => router.push("/checkout")} disabled={!items.length} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-brand px-3 py-4 text-xl font-medium text-white shadow-md hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-40">Proceed to Checkout<Image src="/images/cart/arrow-right.svg" alt="" width={16} height={16} className="size-4 shrink-0" /></button>
          <Link href="/" className="flex min-h-11 items-center justify-center rounded-lg text-sm text-brand hover:bg-fuchsia-50">Continue Shopping</Link>
        </div>
        <p role="status" aria-live="polite" className="sr-only">{notice} Cart total: {formatCartPrice(totals.total)}.</p>
      </main>

      <BottomNavigation active={null} onUnavailable={label => setDialog(label === "Sell" ? "Sell" : "Profile")} />

      {dialog && <ItemDialog title={titles[dialog]} onClose={() => setDialog(null)}>
        {dialog === "info" && <div className="space-y-3 text-sm leading-6 text-gray-600"><p>This cart starts with three sample items. Changes stay while you navigate the app; refreshing restores the samples.</p><p>Try quantities from 1 to {MAX_DEMO_QUANTITY}, or use the bin icon to remove an item. These quantities are for the demo and do not represent real stock.</p><p>The example service fee is €2.45 and shipping is €4.90 per cart. Real fees, inventory checks and buyer protection will be added with checkout.</p></div>}
        {(dialog === "Sell" || dialog === "Profile") && <p className="text-sm leading-6 text-gray-600">{dialog === "Sell" ? "Creating listings" : "Your account"} will be available in a later step.</p>}
      </ItemDialog>}
    </div>
  );
}
