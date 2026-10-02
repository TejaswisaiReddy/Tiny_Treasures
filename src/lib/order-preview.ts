import type { Product } from "@/lib/products";
import type { DeliveryMethod } from "@/lib/cart";
import type { CheckoutContact } from "@/lib/checkout-contact";

export type OrderItem = { product: Product; quantity: number };
export type OrderPreviewInput = {
  items: OrderItem[];
  delivery: DeliveryMethod;
  contact: CheckoutContact;
};
export type OrderPreview = OrderPreviewInput & { id: string };

export function createOrderPreview(input: OrderPreviewInput): OrderPreview | null {
  if (!input.items.length) return null;
  // Snapshot the basket so later shopping cannot change this preview.
  return {
    id: "TT-9482105",
    items: input.items.map(item => ({ product: { ...item.product }, quantity: item.quantity })),
    delivery: input.delivery,
    contact: { ...input.contact },
  };
}

export function getOrderSteps(delivery: DeliveryMethod) {
  return delivery === "pickup"
    ? [
        { title: "Order Placed", detail: "Sample order confirmed", status: "complete" },
        { title: "Ready for Pickup", detail: "Arrange a time with each seller", status: "current" },
        { title: "Collected", detail: "Waiting for collection", status: "pending" },
      ] as const
    : [
        { title: "Order Placed", detail: "Yesterday, 18:22", status: "complete" },
        { title: "Shipped", detail: "Today, 08:45", status: "complete" },
        { title: "Out for Delivery", detail: "In transit to your location", status: "current" },
        { title: "Delivered", detail: "Pending arrival", status: "pending" },
      ] as const;
}
