"use client";

import Link from "next/link";
import { OrderHeader, OrderItemCard } from "@/components/order-shared";
import { OrderIcon } from "@/components/order-icon";
import { useOrderPreview } from "@/components/order-preview-provider";
import { formatCartPrice, getCartTotals } from "@/lib/cart";

export default function OrderConfirmationScreen() {
  const { order } = useOrderPreview();
  const pickup = order.delivery === "pickup";
  const totals = getCartTotals(order.items.map(({ product, quantity }) => ({ price: product.price, quantity })), order.delivery);

  return (
    <div id="order-confirmation-export" className="mx-auto min-h-dvh w-full max-w-[412px] bg-white shadow-sm">
      <OrderHeader confirmation />
      <main className="flex min-h-[calc(100dvh-64px)] flex-col px-5 pt-10 pb-10">
        <section className="relative text-center" aria-labelledby="confirmation-title">
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-2 top-0 h-36">
            <span className="absolute top-0 left-[15%] size-1.5 rounded-full bg-brand" />
            <span className="absolute top-1 left-[54%] size-1 rounded-full bg-purple-100" />
            <span className="absolute top-10 right-[12%] size-1 rounded-full bg-lime-600" />
            <span className="absolute top-12 right-[5%] size-2 rounded-full bg-brand" />
            <span className="absolute top-24 right-[7%] size-1.5 rounded-full bg-lime-300" />
            <span className="absolute top-32 left-0 size-1.5 rounded-full bg-gray-500" />
          </div>
          <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-[#e8f6e8]">
            <span className="flex size-16 items-center justify-center rounded-full bg-[#45d62c] text-white"><OrderIcon name="check" size={38} /></span>
          </div>
          <h1 id="confirmation-title" className="mt-5 text-2xl font-semibold">Order Confirmed!</h1>
          <p className="mx-auto mt-2 max-w-[300px] text-sm leading-5 text-gray-600">Thank you for giving these treasures a new home.</p>
          <p className="mt-3 text-xs font-medium text-brand">Demo order · No payment taken or email sent</p>
        </section>

        <section aria-label="Order summary" className="mt-10 rounded-xl border border-gray-200 px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-4">
            <span className="text-xs font-medium tracking-wide text-gray-600">ORDER NUMBER</span>
            <span className="text-sm font-semibold">#{order.id}</span>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-gray-100 text-brand"><OrderIcon name={pickup ? "pin" : "truck"} size={24} /></span>
            <div className="min-w-0">
              <p className="text-[10px] font-medium tracking-wide text-gray-500">{pickup ? "PICKUP" : "ESTIMATED DELIVERY · SAMPLE"}</p>
              <p className="mt-0.5 text-base font-medium">{pickup ? "Arrange a collection time" : "Today, 14:30–15:45"}</p>
              <p className="text-sm text-gray-600">{pickup ? "Contact each seller to collect your items" : "Via Standard Courier"}</p>
            </div>
          </div>
        </section>

        <section aria-label="Order items" className="mt-5 space-y-3">
          {order.items.map(item => <OrderItemCard key={item.product.id} item={item} />)}
          <div className="flex justify-between gap-3 px-1 pt-1 text-sm"><span className="text-gray-600">Total including fees</span><span className="font-semibold">{formatCartPrice(totals.total)}</span></div>
        </section>

        <div className="mt-auto space-y-3 pt-16">
          <Link href="/order-tracking" className="flex min-h-14 items-center justify-center rounded-xl bg-brand px-4 py-3 text-lg font-medium text-white hover:bg-brand/90">View Order Tracking</Link>
          <Link href="/" className="flex min-h-14 items-center justify-center rounded-xl border-2 border-brand px-4 py-3 text-lg font-medium text-brand hover:bg-fuchsia-50">Continue Shopping</Link>
        </div>
        <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs leading-5 text-gray-500"><OrderIcon name="shield" size={16} />Tiny Treasures · Order preview</p>
      </main>
    </div>
  );
}
