import type { Metadata } from "next";
import OrderTrackingScreen from "@/components/order-tracking-screen";
import { FigmaCaptureScript } from "@/components/figma-capture-script";

export const metadata: Metadata = { title: "Track Order | Tiny Treasures" };

export default function Page() {
  return <><OrderTrackingScreen /><FigmaCaptureScript /></>;
}
