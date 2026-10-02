import type { Metadata } from "next";
import OrderConfirmationScreen from "@/components/order-confirmation-screen";
import { FigmaCaptureScript } from "@/components/figma-capture-script";

export const metadata: Metadata = { title: "Order Confirmation | Tiny Treasures" };

export default function Page() {
  return <><OrderConfirmationScreen /><FigmaCaptureScript /></>;
}
