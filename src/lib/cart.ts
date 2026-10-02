export type CartEntry = { productId: string; quantity: number };
export type DeliveryMethod = "delivery" | "pickup";
export type CartAction =
  | { type: "add"; productId: string }
  | { type: "quantity"; productId: string; quantity: number }
  | { type: "remove"; productId: string };

// These limits and fees are examples for the UI, not real inventory or checkout rules.
export const MAX_DEMO_QUANTITY = 9;
const DEMO_SERVICE_FEE_CENTS = 245;
const DEMO_SHIPPING_CENTS = 490;

export function createDemoCart(): CartEntry[] {
  return ["hm-jumpsuit", "yellow-raincoat", "wooden-blocks"].map(productId => ({ productId, quantity: 1 }));
}

// A reducer takes the current cart and an action, then returns the updated cart.
export function cartReducer(entries: CartEntry[], action: CartAction): CartEntry[] {
  switch (action.type) {
    case "add":
      return entries.some(entry => entry.productId === action.productId)
        ? entries
        : [...entries, { productId: action.productId, quantity: 1 }];
    case "remove":
      return entries.filter(entry => entry.productId !== action.productId);
    case "quantity":
      if (!Number.isInteger(action.quantity) || action.quantity < 1 || action.quantity > MAX_DEMO_QUANTITY) return entries;
      return entries.map(entry => entry.productId === action.productId ? { ...entry, quantity: action.quantity } : entry);
  }
}

export function getCartTotals(items: readonly { price: number; quantity: number }[], deliveryMethod: DeliveryMethod = "delivery") {
  // Calculate in cents to avoid decimal rounding errors when adding euro prices.
  const subtotal = items.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const serviceFee = itemCount ? DEMO_SERVICE_FEE_CENTS : 0;
  const shipping = itemCount && deliveryMethod === "delivery" ? DEMO_SHIPPING_CENTS : 0;
  return { itemCount, subtotal, serviceFee, shipping, total: subtotal + serviceFee + shipping };
}

export function formatCartPrice(cents: number) {
  return `€ ${(cents / 100).toFixed(2)}`;
}
