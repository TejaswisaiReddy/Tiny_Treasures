import type { Metadata } from "next";
import ChatScreen from "@/components/chat-screen";
import { getItemDetails } from "@/lib/products";

export const metadata: Metadata = {
  title: "Chat with Aisha | Tiny Treasures",
  description: "Preview a conversation about a preloved treasure.",
};

export default function ChatPage() {
  const item = getItemDetails("hm-jumpsuit");
  if (!item?.seller) throw new Error("The demo chat requires its sample listing and seller.");
  return <ChatScreen item={item} seller={item.seller} />;
}
