"use client";

import { CheckoutIcon, type CheckoutIconName } from "@/components/checkout-icon";

export const paymentMethods = [
  { id: "card", label: "Credit card", icon: "credit-card" },
  { id: "mobile", label: "Mobile pay", icon: "mobile-pay" },
  { id: "apple", label: "Apple Pay", icon: "apple-pay" },
] as const satisfies readonly { id: string; label: string; icon: CheckoutIconName }[];
export type PaymentMethod = typeof paymentMethods[number]["id"];

function DemoPaymentCard() {
  return (
    <div aria-label="Example credit card ending 3947, not a real saved card" className="relative flex aspect-[1.6] w-full flex-col justify-between overflow-hidden rounded-xl bg-[#54dc2f] p-5 text-ink shadow-lg min-[380px]:p-6">
      <div className="relative z-10 flex items-start justify-between gap-2">
        <CheckoutIcon name="contactless" />
        <span className="rounded-full bg-white/60 px-2 py-1 text-[10px] font-medium">DEMO CARD</span>
        <div aria-hidden="true" className="flex shrink-0"><span className="size-8 rounded-full bg-red-500/80" /><span className="-ml-3 size-8 rounded-full bg-yellow-500/80" /></div>
      </div>
      <div className="relative z-10 space-y-4">
        <p className="whitespace-nowrap font-mono text-[clamp(16px,4.8vw,20px)] tracking-[2px] min-[380px]:tracking-[4px]">**** **** **** 3947</p>
        <div className="flex justify-between gap-4 text-xs leading-5 min-[380px]:text-sm">
          <div><p className="text-ink/75">CARD HOLDER</p><p>JENNYFER DOE</p></div>
          <div className="text-right"><p className="text-ink/75">EXPIRES</p><p>05/29</p></div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute -top-10 -right-10 size-40 rounded-full bg-white/10 blur-2xl" />
    </div>
  );
}

export function CheckoutPaymentMethods({ selected, onChange }: { selected: PaymentMethod; onChange: (method: PaymentMethod) => void }) {
  return (
    <fieldset>
      <legend className="navigation mb-4 text-xl font-semibold leading-7">Choose payment method</legend>
      <div className="space-y-2">
        {paymentMethods.map(method => (
          <div key={method.id} className="space-y-2">
            <label className="block cursor-pointer">
              <input type="radio" name="payment-method" value={method.id} checked={selected === method.id} onChange={() => onChange(method.id)} className="peer sr-only" />
              <span className={`flex min-h-14 items-center gap-4 rounded-xl border-2 p-4 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand ${selected === method.id ? "border-brand" : "border-gray-200 hover:bg-gray-50"}`}>
                <span className="flex w-5 shrink-0 items-center justify-center"><CheckoutIcon name={method.icon} /></span>
                <span className="min-w-0 flex-1 text-base">{method.label}</span>
                <span aria-hidden="true" className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${selected === method.id ? "border-brand" : "border-gray-200"}`}>
                  {selected === method.id && <span className="size-2.5 rounded-full bg-brand" />}
                </span>
              </span>
            </label>
            {method.id === "card" && selected === "card" && <DemoPaymentCard />}
          </div>
        ))}
      </div>
      {selected !== "card" && <p role="status" className="mt-3 rounded-xl bg-fuchsia-50 p-3 text-sm leading-5 text-brand">{selected === "mobile" ? "Mobile pay" : "Apple Pay"} selected for this preview. A payment provider will be connected later.</p>}
    </fieldset>
  );
}
