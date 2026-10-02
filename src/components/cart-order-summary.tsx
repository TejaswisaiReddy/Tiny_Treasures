"use client";

import { useId, type ReactNode } from "react";
import { formatCartPrice, type getCartTotals } from "@/lib/cart";

export function CartOrderSummary({ totals, variant = "cart", shippingLabel = "Estimated Shipping", shippingIcon }: {
  totals: ReturnType<typeof getCartTotals>;
  variant?: "cart" | "checkout";
  shippingLabel?: string;
  shippingIcon?: ReactNode;
}) {
  const headingId = useId();
  const checkout = variant === "checkout";
  return (
    <section aria-labelledby={headingId} className={checkout ? "rounded-xl border border-gray-200 bg-white p-5" : "rounded-2xl bg-gray-200 p-4 shadow-sm"}>
      <h2 id={headingId} className={checkout ? "sr-only" : "mb-4 text-xl font-medium"}>Order Summary</h2>
      <dl className={`border-b pb-4 text-sm ${checkout ? "space-y-3 border-gray-200 text-gray-600" : "space-y-2 border-white"}`}>
        <div className="flex justify-between gap-4"><dt>{checkout ? "Item Cost" : "Item Subtotal"}</dt><dd className="tabular-nums">{formatCartPrice(totals.subtotal)}</dd></div>
        <div className="flex justify-between gap-4"><dt>Service Fee</dt><dd className="tabular-nums">{formatCartPrice(totals.serviceFee)}</dd></div>
        <div className="flex justify-between gap-4"><dt className={checkout ? "flex items-center gap-1 text-[#9a4b05]" : undefined}>{shippingIcon}{shippingLabel}</dt><dd className="tabular-nums text-[#9a4b05]">{formatCartPrice(totals.shipping)}</dd></div>
      </dl>
      <div className="flex items-center justify-between gap-4 pt-4"><p className={checkout ? "text-xl font-medium" : "font-medium"}>{checkout ? "Total Price" : "Total"}</p><p className={`${checkout ? "text-xl" : "text-2xl"} font-medium tabular-nums text-brand`}>{formatCartPrice(totals.total)}</p></div>
    </section>
  );
}
