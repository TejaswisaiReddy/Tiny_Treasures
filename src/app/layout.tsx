import type { Metadata } from "next";
import { Roboto, Kaushan_Script, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { FavoritesProvider } from "@/components/favorites-provider";
import { ChatProvider } from "@/components/chat-provider";
import { CartProvider } from "@/components/cart-provider";
import { OrderPreviewProvider } from "@/components/order-preview-provider";

const roboto = Roboto({ subsets: ["latin"], variable: "--font-roboto" });
const logo = Kaushan_Script({ weight: "400", subsets: ["latin"], variable: "--font-logo" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: "Tiny Treasures | Find their next favorite",
  description: "Discover preloved clothes, toys and books for your little ones.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={`${roboto.variable} ${logo.variable} ${jakarta.variable}`}><body><FavoritesProvider><ChatProvider><CartProvider><OrderPreviewProvider>{children}</OrderPreviewProvider></CartProvider></ChatProvider></FavoritesProvider></body></html>;
}
