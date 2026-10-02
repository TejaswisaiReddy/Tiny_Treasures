import type { Metadata } from "next";
import BatchCaptureScreen from "@/components/batch-capture-screen";

export const metadata: Metadata = { title: "Batch Photo Capture | Tiny Treasures" };
export default function Page() { return <BatchCaptureScreen />; }
