import type { Metadata } from "next";
import SellScreen from "@/components/sell-screen";

export const metadata: Metadata = {
  title: "List an Item | Tiny Treasures",
  description: "Add photos and details to preview your preloved item's listing.",
};

// This folder gives the screen its /sell address.
export default function SellPage() {
  return <SellScreen />;
}
