"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

export type ChatPhoto = { url: string; name: string };
export type ChatMessage = {
  id: string;
  sender: "seller" | "buyer";
  text: string;
  time: string;
  preview?: boolean;
  photo?: ChatPhoto;
};

type ChatContextValue = {
  messages: ChatMessage[];
  draft: string;
  setDraft: (value: string) => void;
  photo: ChatPhoto | null;
  attachPhoto: (file: File) => string | undefined;
  removePhoto: () => void;
  sendMessage: () => boolean;
};

const ChatContext = createContext<ChatContextValue | null>(null);

// One demo conversation, kept across routes for this visit only.
export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [photo, setPhoto] = useState<ChatPhoto | null>(null);
  const photoUrls = useRef(new Set<string>());

  useEffect(() => {
    const urls = photoUrls.current;
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  function removePhoto() {
    if (photo) {
      URL.revokeObjectURL(photo.url);
      photoUrls.current.delete(photo.url);
    }
    setPhoto(null);
  }

  function attachPhoto(file: File) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return "Choose a JPG, PNG or WebP photo.";
    if (file.size === 0 || file.size > 5 * 1024 * 1024) return "Choose a photo smaller than 5 MB.";
    removePhoto();
    const url = URL.createObjectURL(file);
    photoUrls.current.add(url);
    setPhoto({ url, name: file.name });
  }

  function sendMessage() {
    const text = draft.trim();
    if ((!text && !photo) || text.length > 1000) return false;
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "buyer",
      text,
      time: new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit", hour12: true }).format(new Date()),
      preview: true,
      ...(photo ? { photo } : {}),
    };
    setMessages(current => [...current, message]);
    setDraft("");
    // Keep this photo URL alive while its message is visible.
    setPhoto(null);
    return true;
  }

  return <ChatContext.Provider value={{ messages, draft, setDraft, photo, attachPhoto, removePhoto, sendMessage }}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used inside ChatProvider");
  return context;
}
