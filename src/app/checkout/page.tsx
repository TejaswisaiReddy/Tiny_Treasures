import type { Metadata } from "next";
import CheckoutScreen from "@/components/checkout-screen";

export const metadata: Metadata = {
  title: "Payment | Tiny Treasures",
  description: "Preview payment and delivery options for your preloved treasures.",
};

export default function CheckoutPage() {
  return <CheckoutScreen />;
}
