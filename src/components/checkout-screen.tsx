"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart, type CartItem } from "@/components/cart-provider";
import { CartOrderSummary } from "@/components/cart-order-summary";
import { CheckoutIcon } from "@/components/checkout-icon";
import { CheckoutContactDialog, sampleCheckoutContact } from "@/components/checkout-contact-dialog";
import { CheckoutPaymentMethods, paymentMethods, type PaymentMethod } from "@/components/checkout-payment-methods";
import { ItemDialog } from "@/components/item-dialog";
import { useOrderPreview } from "@/components/order-preview-provider";
import { formatCartPrice, getCartTotals, type DeliveryMethod } from "@/lib/cart";

type CheckoutDialog = "info" | "contact" | "payment" | "terms" | "protection" | null;

function CheckoutItem({ product, quantity }: CartItem) {
  // Use the design's thumbnail for its sample jumpsuit; other items keep their own image.
  const photo = product.id === "hm-jumpsuit" ? "/images/checkout/jumpsuit.png" : `/images/${product.image}.png`;
  return (
    <article className="flex items-center gap-4 rounded-xl border border-gray-200 p-4">
      <Image src={photo} alt={product.name} width={80} height={80} className="size-20 shrink-0 rounded-xl bg-gray-100 object-cover" />
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-xs text-brand min-[380px]:text-sm">ITEM DETAILS</p>
        <h3 className="break-words text-xl font-medium leading-6">{product.name}</h3>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-sm text-gray-600">Size {product.size}</p>
          <span className="navigation inline-flex max-w-full items-center gap-1 rounded-xl bg-[#54dc2f]/20 px-2 py-1 text-xs font-semibold leading-4"><CheckoutIcon name="condition" />{product.condition}</span>
        </div>
        <p className="text-xs text-gray-600">Qty {quantity} · {formatCartPrice(Math.round(product.price * 100) * quantity)}</p>
      </div>
    </article>
  );
}

export default function CheckoutScreen() {
  const router = useRouter();
  const { previewOrder } = useOrderPreview();
  const { items } = useCart();
  const [payment, setPayment] = useState<PaymentMethod>("card");
  const [delivery, setDelivery] = useState<DeliveryMethod>("pickup");
  const [contact, setContact] = useState(sampleCheckoutContact);
  const [showAllItems, setShowAllItems] = useState(false);
  const [dialog, setDialog] = useState<CheckoutDialog>(null);
  const [notice, setNotice] = useState("");
  const totals = getCartTotals(items.map(({ product, quantity }) => ({ price: product.price, quantity })), delivery);
  const paymentLabel = paymentMethods.find(method => method.id === payment)!.label;
  const locations = [...new Set(items.map(item => item.product.location))].join(", ");
  const shippingLabel = delivery === "pickup" ? "Pickup (no shipping)" : "Shipping";
  const titles = { info: "About this checkout", payment: "Payment preview", terms: "Terms of Service", protection: "Buyer Protection" };

  function priceBreakdown() {
    return <CartOrderSummary totals={totals} variant="checkout" shippingLabel={shippingLabel} shippingIcon={<CheckoutIcon name="shipping" />} />;
  }

  function showConfirmation() {
    if (previewOrder({ items, delivery, contact })) router.push("/order-confirmation");
  }

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[412px] bg-white shadow-sm">
      <a href="#checkout-content" className="sr-only focus:not-sr-only focus:block focus:p-3">Skip to checkout</a>
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-3">
        <div className="flex items-center gap-2"><Link href="/cart" aria-label="Back to cart" className="flex size-11 items-center justify-center rounded-full hover:bg-gray-50"><CheckoutIcon name="back" /></Link><h1 className="navigation text-xl font-bold text-brand">Payment</h1></div>
        <button type="button" aria-label="Checkout information" onClick={() => setDialog("info")} className="flex size-11 items-center justify-center rounded-full hover:bg-gray-50"><CheckoutIcon name="info" /></button>
      </header>

      <main id="checkout-content" className="space-y-6 px-4 pt-4 pb-[calc(180px+env(safe-area-inset-bottom))]">
        {items.length === 0 ? (
          <section className="rounded-xl border border-gray-200 px-4 py-10 text-center">
            <h2 className="text-xl font-medium">Your cart is empty</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">Add an item before choosing payment and delivery.</p>
            <Link href="/" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-brand px-6 py-3 text-white">Browse treasures</Link>
          </section>
        ) : <>
          <section aria-labelledby="checkout-items-title" className="space-y-3">
            <h2 id="checkout-items-title" className="sr-only">Your order, {totals.itemCount} items</h2>
            {items.slice(0, 1).map(item => <CheckoutItem key={item.product.id} {...item} />)}
            {items.length > 1 && <>
              <button type="button" aria-expanded={showAllItems} aria-controls="checkout-more-items" onClick={() => setShowAllItems(!showAllItems)} className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-1 text-sm text-brand hover:bg-fuchsia-50"><span>{showAllItems ? "Hide additional items" : `Show ${items.length - 1} more ${items.length === 2 ? "item" : "items"}`}</span><span>{totals.itemCount} in total</span></button>
              <div id="checkout-more-items" hidden={!showAllItems} className="space-y-3">{items.slice(1).map(item => <CheckoutItem key={item.product.id} {...item} />)}</div>
            </>}
            <div className="rounded-xl bg-brand p-4 text-white" role="status" aria-live="polite" aria-atomic="true">
              <p className="text-sm text-white/90">Total Amount</p>
              <p className="mt-1 text-[32px] font-semibold leading-10 tabular-nums">{formatCartPrice(totals.total)}</p>
            </div>
          </section>

          <CheckoutPaymentMethods selected={payment} onChange={setPayment} />

          <fieldset>
            <legend className="mb-4 text-xl font-medium">Delivery Method</legend>
            <div className="grid grid-cols-2 gap-3">
              {(["pickup", "delivery"] as const).map(method => <label key={method} className="min-w-0 cursor-pointer">
                <input type="radio" name="delivery-method" value={method} checked={delivery === method} onChange={() => { setDelivery(method); setNotice(""); }} className="peer sr-only" />
                <span className={`flex min-h-[84px] flex-col items-center justify-center gap-1 rounded-xl border p-3 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand ${delivery === method ? "border-brand bg-brand text-white" : "border-gray-200 bg-white text-ink hover:bg-gray-50"}`}>
                  <span className={`flex h-7 items-center justify-center ${method === "pickup" ? "w-7 rounded-full bg-brand" : ""}`}><CheckoutIcon name={method} /></span>
                  <span className="text-sm">{method === "pickup" ? "Pickup" : "Delivery"}</span>
                </span>
              </label>)}
            </div>
          </fieldset>

          <section aria-labelledby="checkout-contact-title" className="space-y-4 rounded-xl border border-gray-200 p-5">
            <div className="flex flex-wrap items-center justify-between gap-x-3">
              <h2 id="checkout-contact-title" className="text-xl font-medium">{delivery === "delivery" ? "Delivery Details" : "Pickup Details"}</h2>
              <button type="button" onClick={() => setDialog("contact")} className="flex min-h-11 items-center gap-1 rounded-lg text-sm text-brand hover:underline"><CheckoutIcon name="edit" />Change</button>
            </div>
            <div className="space-y-2 break-words">
              <p className="font-medium">{contact.name}</p>
              <p className="text-sm leading-5 text-gray-600">{delivery === "delivery" ? contact.address : `Pickup in ${locations}`}</p>
              <p className="text-sm text-gray-600">{contact.phone}</p>
            </div>
            <p className="text-xs leading-5 text-gray-500">{delivery === "pickup" ? "Arrange collection with each seller. No shipping fee is added." : "Example delivery address for this demo."}</p>
            {notice && <p role="status" className="text-sm text-brand">{notice}</p>}
          </section>

          {priceBreakdown()}
        </>}
      </main>

      <footer className="fixed bottom-0 left-1/2 z-20 w-full max-w-[412px] -translate-x-1/2 border-t border-gray-100 bg-white px-4 pt-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
        <button type="button" onClick={() => setDialog("payment")} disabled={!items.length} aria-describedby="payment-demo-notice" className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-xl font-medium text-white shadow-md hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-40"><CheckoutIcon name="lock" />Preview payment</button>
        <p id="payment-demo-notice" className="mt-3 text-center text-xs leading-4 text-gray-600">Demo only — no payment will be taken.</p>
        <div className="flex flex-wrap items-center justify-center gap-x-2 text-xs text-brand"><button type="button" onClick={() => setDialog("terms")} className="min-h-8 rounded px-1 underline">Terms of Service</button><span aria-hidden="true">·</span><button type="button" onClick={() => setDialog("protection")} className="min-h-8 rounded px-1 underline">Buyer Protection</button></div>
      </footer>

      {dialog === "contact" && <CheckoutContactDialog initial={contact} deliveryMethod={delivery} onClose={() => setDialog(null)} onSave={next => { setContact(next); setNotice("Details updated for this preview."); setDialog(null); }} />}
      {dialog && dialog !== "contact" && <ItemDialog title={titles[dialog]} onClose={() => setDialog(null)}>
        {dialog === "info" && <div className="space-y-3 text-sm leading-6 text-gray-600"><p>This is a frontend checkout demo. The card and contact details are examples.</p><p>The items and quantities come from your cart. Pickup is free; delivery uses the same €4.90 shipping estimate as the cart. The sample service fee is €2.45 per order.</p><p>No card information is collected, no order is placed, and nothing is charged. Changes to payment and contact details reset when you leave this page.</p></div>}
        {dialog === "payment" && <div className="space-y-4"><p className="rounded-xl bg-fuchsia-50 p-3 text-sm leading-6 text-brand">This is a preview. No payment has been taken and no order has been placed.</p><dl className="space-y-2 text-sm"><div className="flex justify-between gap-3"><dt>Payment method</dt><dd>{paymentLabel}</dd></div><div className="flex justify-between gap-3"><dt>Delivery method</dt><dd>{delivery === "pickup" ? "Pickup" : "Delivery"}</dd></div></dl>{priceBreakdown()}<button type="button" onClick={showConfirmation} className="min-h-12 w-full rounded-xl bg-brand px-4 py-3 text-white">View demo confirmation</button><button type="button" onClick={() => setDialog(null)} className="min-h-11 w-full rounded-xl border border-filter-border px-4 py-2 text-brand">Back to checkout</button></div>}
        {dialog === "terms" && <p className="text-sm leading-6 text-gray-600">Checkout is currently a preview. Terms for real purchases will be provided before payments are enabled. This demo does not create a purchase agreement.</p>}
        {dialog === "protection" && <p className="text-sm leading-6 text-gray-600">Buyer protection is planned for a future version. No payment processing, refund service or buyer protection is active in this demo.</p>}
      </ItemDialog>}
    </div>
  );
}
