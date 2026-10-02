import type { Metadata } from "next";
import CartScreen from "@/components/cart-screen";

export const metadata: Metadata = {
  title: "Cart | Tiny Treasures",
  description: "Review your selected preloved treasures.",
};

// Next.js turns this file's folder name into the /cart URL.
export default function CartPage() {
  return <CartScreen />;
}
