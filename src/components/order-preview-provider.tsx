"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { allProducts } from "@/lib/products";
import { sampleCheckoutContact, type CheckoutContact } from "@/lib/checkout-contact";
import { createOrderPreview, type OrderPreview, type OrderPreviewInput } from "@/lib/order-preview";

type OrderPreviewContextValue = {
  order: OrderPreview;
  previewOrder: (input: OrderPreviewInput) => boolean;
  updateContact: (contact: CheckoutContact) => void;
};

const OrderPreviewContext = createContext<OrderPreviewContextValue | null>(null);

export function OrderPreviewProvider({ children }: { children: ReactNode }) {
  // A direct visit shows one sample item. Checkout replaces it with the basket.
  const [order, setOrder] = useState<OrderPreview>(() => createOrderPreview({
    items: [{ product: allProducts.find(product => product.id === "hm-jumpsuit")!, quantity: 1 }],
    delivery: "delivery",
    contact: sampleCheckoutContact,
  })!);

  function previewOrder(input: OrderPreviewInput) {
    const next = createOrderPreview(input);
    if (!next) return false;
    setOrder(next);
    return true;
  }

  return <OrderPreviewContext.Provider value={{
    order,
    previewOrder,
    updateContact: contact => setOrder(current => ({ ...current, contact: { ...contact } })),
  }}>{children}</OrderPreviewContext.Provider>;
}

export function useOrderPreview() {
  const value = useContext(OrderPreviewContext);
  if (!value) throw new Error("useOrderPreview must be used inside OrderPreviewProvider");
  return value;
}
