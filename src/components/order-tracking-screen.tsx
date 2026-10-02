"use client";

import Link from "next/link";
import { useState } from "react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { CheckoutContactDialog } from "@/components/checkout-contact-dialog";
import { ItemDialog } from "@/components/item-dialog";
import { OrderHeader, OrderItemCard } from "@/components/order-shared";
import { OrderIcon } from "@/components/order-icon";
import { OrderTrackingMap } from "@/components/order-tracking-map";
import { useOrderPreview } from "@/components/order-preview-provider";
import { getOrderSteps } from "@/lib/order-preview";

type TrackingDialog = "call" | "message" | "contact" | "profile" | null;

export default function OrderTrackingScreen() {
  const { order, updateContact } = useOrderPreview();
  const [dialog, setDialog] = useState<TrackingDialog>(null);
  const [notice, setNotice] = useState("");
  const pickup = order.delivery === "pickup";
  const locations = [...new Set(order.items.map(item => item.product.location))].join(", ");
  const steps = getOrderSteps(order.delivery);
  const dialogTitles = { call: "Call your courier", message: "Message your courier", profile: "Your profile" };

  return (
    <div id="order-tracking-export" className="mx-auto min-h-dvh w-full max-w-[412px] bg-white shadow-sm">
      <OrderHeader />
      <main className="pb-[calc(88px+env(safe-area-inset-bottom))]">
        {pickup ? (
          <section className="flex min-h-44 flex-col items-center justify-center gap-3 bg-fuchsia-50 px-6 py-8 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-white text-brand"><OrderIcon name="pin" size={28} /></span>
            <h2 className="text-lg font-semibold text-brand">Pickup in {locations}</h2>
            <p className="text-sm text-gray-600">Arrange collection directly with each seller.</p>
          </section>
        ) : (
          <section aria-label="Sample courier location" className="relative h-[278px] overflow-hidden bg-[#95dbe7]">
            <OrderTrackingMap />
            <span className="absolute top-3 left-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-medium tracking-wide text-gray-600 shadow-sm">ILLUSTRATED MAP · DEMO</span>
            <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-xl border border-filter-border/50 bg-white p-4 shadow-sm">
              <span aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#e5efee] text-sm font-semibold text-[#476d6a]">MP</span>
              <div className="min-w-0 flex-1"><p className="text-xs text-gray-600">Your Courier · Demo</p><p className="mt-0.5 text-base font-medium">Marko Pekka</p></div>
              <div className="flex shrink-0 gap-1">
                <button type="button" onClick={() => setDialog("call")} aria-label="Call courier preview" className="flex size-11 items-center justify-center rounded-full bg-brand/10 text-brand hover:bg-brand/20"><OrderIcon name="phone" /></button>
                <button type="button" onClick={() => setDialog("message")} aria-label="Message courier preview" className="flex size-11 items-center justify-center rounded-full bg-brand/10 text-brand hover:bg-brand/20"><OrderIcon name="message" /></button>
              </div>
            </div>
          </section>
        )}

        <div className="px-5 pt-6">
          <section aria-label="Tracking summary" className="flex flex-wrap items-start justify-between gap-x-3 gap-y-4">
            <div><p className="text-xs tracking-wide text-gray-600">ORDER ID</p><h2 className="mt-1 text-xl font-semibold">#{order.id}</h2></div>
            <div className="text-right"><p className="text-xs text-gray-600">{pickup ? "Collection" : "Estimated Arrival"}</p><p className="mt-1 text-sm font-medium text-[#b94c00]">{pickup ? "Arrange with seller" : "Today, 14:30–15:45"}</p></div>
          </section>
          <p className="mt-3 text-xs leading-5 text-gray-500">Sample tracking updates · No live shipment</p>

          <ol aria-label="Order progress" className="my-7">
            {steps.map((step, index) => (
              <li key={step.title} aria-current={step.status === "current" ? "step" : undefined} className="relative flex min-h-[68px] gap-4 last:min-h-12">
                {index < steps.length - 1 && <span aria-hidden="true" className={`absolute top-6 left-[11px] h-[44px] w-px ${step.status === "complete" ? "bg-orange-300" : "bg-gray-200"}`} />}
                <span className={`relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full ${step.status === "pending" ? "bg-gray-100 text-gray-400" : "bg-[#f58213] text-white"} ${step.status === "current" ? "ring-4 ring-orange-50" : ""}`}>
                  <OrderIcon name={step.status === "complete" ? "check" : step.status === "pending" ? "box" : pickup ? "pin" : "truck"} size={15} />
                </span>
                <div className="min-w-0 pb-4">
                  <h3 className={`text-base font-medium leading-6 ${step.status === "current" ? "text-[#b94c00]" : step.status === "pending" ? "text-gray-500" : "text-ink"}`}>{step.title}<span className="sr-only"> — {step.status === "complete" ? "completed" : step.status === "current" ? "current step" : "pending"}</span></h3>
                  <p className="text-sm leading-5 text-gray-500">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>

          <section className="rounded-xl border border-filter-border/60 bg-[#f8f2f8] p-4" aria-label={pickup ? "Pickup contact and items" : "Delivery address and shipment"}>
            <div className="flex items-start gap-3">
              <span className="mt-1 text-brand"><OrderIcon name="pin" /></span>
              <div className="min-w-0 flex-1 text-sm leading-5 [overflow-wrap:anywhere]">
                <h3 className="mb-1 text-xs font-semibold">{pickup ? "PICKUP CONTACT" : "DELIVERY ADDRESS"}</h3>
                <p className="font-medium">{order.contact.name}</p>
                <p className="text-gray-600">{pickup ? `Pickup in ${locations}` : order.contact.address}</p>
                <p className="text-gray-600">{order.contact.phone}</p>
              </div>
              <button type="button" onClick={() => setDialog("contact")} aria-label={pickup ? "Edit pickup contact" : "Edit delivery address"} className="-mt-2 -mr-2 flex size-11 shrink-0 items-center justify-center rounded-full text-brand hover:bg-brand/10"><OrderIcon name="edit" size={17} /></button>
            </div>
            {notice && <p role="status" className="mt-3 text-xs leading-5 text-brand">{notice}</p>}
            <div className="mt-4 flex items-start gap-3 border-t border-filter-border/40 pt-4">
              <span className="mt-1 text-brand"><OrderIcon name="box" /></span>
              <div className="min-w-0 flex-1"><h3 className="mb-1 text-xs font-semibold">{pickup ? "ITEMS FOR COLLECTION" : "ITEMS IN THIS SHIPMENT"}</h3>{order.items.map(item => <OrderItemCard key={item.product.id} item={item} compact />)}</div>
            </div>
          </section>
          {pickup && <Link href="/chat" className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 font-medium text-white hover:bg-brand/90"><OrderIcon name="message" />Open seller chat</Link>}
        </div>
      </main>

      <BottomNavigation active={null} onUnavailable={() => setDialog("profile")} />

      {dialog === "contact" && <CheckoutContactDialog initial={order.contact} deliveryMethod={order.delivery} description="Update the contact details in this demo. Changes reset on refresh and are not sent to a courier." onClose={() => setDialog(null)} onSave={contact => { updateContact(contact); setNotice("Preview details updated. Nothing was sent to a courier."); setDialog(null); }} />}
      {dialog && dialog !== "contact" && <ItemDialog title={dialogTitles[dialog]} onClose={() => setDialog(null)}>
        <p className="text-sm leading-6 text-gray-600">{dialog === "call" ? "Marko Pekka is a sample courier. Calling will be available when a real delivery service is connected. No call has been started." : dialog === "message" ? "Courier messaging is a preview. Messages cannot be sent until a real delivery service is connected." : "Profiles will be added when accounts and authentication are connected. You can keep browsing the demo using Home."}</p>
        <button type="button" onClick={() => setDialog(null)} className="mt-5 min-h-12 w-full rounded-xl bg-brand px-4 py-3 text-white">Back to tracking</button>
      </ItemDialog>}
    </div>
  );
}
