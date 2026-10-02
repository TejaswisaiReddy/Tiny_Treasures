"use client";

import { createContext, useContext, useReducer, type ReactNode } from "react";
import { cartReducer, createDemoCart, getCartTotals } from "@/lib/cart";
import { allProducts, type Product } from "@/lib/products";

export type CartItem = { product: Product; quantity: number };
type CartContextValue = {
  items: CartItem[];
  totals: ReturnType<typeof getCartTotals>;
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

// Placed in the shared layout so navigation does not reset the cart.
// Refreshing the browser restores the three sample items for now.
export function CartProvider({ children }: { children: ReactNode }) {
  const [entries, dispatch] = useReducer(cartReducer, undefined, createDemoCart);
  const items: CartItem[] = entries.flatMap(entry => {
    const product = allProducts.find(product => product.id === entry.productId);
    return product ? [{ product, quantity: entry.quantity }] : [];
  });
  const totals = getCartTotals(items.map(({ product, quantity }) => ({ price: product.price, quantity })));

  function addItem(productId: string) {
    if (allProducts.some(product => product.id === productId)) dispatch({ type: "add", productId });
  }

  return (
    <CartContext.Provider value={{
      items,
      totals,
      addItem,
      removeItem: productId => dispatch({ type: "remove", productId }),
      setQuantity: (productId, quantity) => dispatch({ type: "quantity", productId, quantity }),
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart must be used inside CartProvider");
  return cart;
}
