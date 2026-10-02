import type { Metadata } from "next";
import PhotoAnalysisScreen from "@/components/photo-analysis-screen";

export const metadata: Metadata = { title: "Prepare Photos | Tiny Treasures" };
export default function Page() { return <PhotoAnalysisScreen />; }
