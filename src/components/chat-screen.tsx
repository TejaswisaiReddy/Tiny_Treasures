"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { useChat, type ChatMessage } from "@/components/chat-provider";
import { ItemDialog } from "@/components/item-dialog";
import type { ItemDetails, Seller } from "@/lib/products";

function ChatIcon({ name, size = 20 }: { name: string; size?: number }) {
  return <Image src={`/images/chat/${name}.svg`} alt="" width={size} height={size} className="shrink-0 object-contain" style={{ width: size, height: size }} />;
}

function MessageBubble({ message, sellerName }: { message: ChatMessage; sellerName: string }) {
  const outgoing = message.sender === "buyer";
  return (
    <article aria-label={`Message from ${outgoing ? "you" : sellerName}`} className={`w-fit max-w-[85%] rounded-xl p-4 ${outgoing ? "ml-auto rounded-tr-none bg-brand text-white" : "mr-auto rounded-tl-none bg-gray-200 text-ink"}`}>
      {message.photo && <Image src={message.photo.url} alt={`Attached photo: ${message.photo.name}`} unoptimized width={240} height={180} className="mb-2 h-40 w-full rounded-lg object-cover" />}
      {message.text && <p className="whitespace-pre-wrap text-base leading-[19px] [overflow-wrap:anywhere]">{message.text}</p>}
      <div className={`mt-1.5 flex items-center justify-end gap-1 text-[10px] leading-3 ${outgoing ? "text-white/90" : "text-gray-600"}`}>
        <span>{message.time}</span>
        {message.preview ? <span>· Preview</span> : outgoing && <Image src="/images/chat/read-receipt.svg" alt="Read in sample conversation" width={13} height={7} />}
      </div>
    </article>
  );
}

type DialogName = "actions" | "call" | "info" | "Sell" | "Profile" | null;

export default function ChatScreen({ item, seller }: { item: ItemDetails; seller: Seller }) {
  const { product } = item;
  const { messages, draft, setDraft, photo, attachPhoto, removePhoto, sendMessage } = useChat();
  const [dialog, setDialog] = useState<DialogName>(null);
  const [photoError, setPhotoError] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const scrollRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const itemHref = `/items/${product.id}`;
  const sampleMessages: ChatMessage[] = [
    { id: "sample-1", sender: "seller", text: "Hi! Thanks for your interest in the jumpsuit! It is in great condition.", time: "09:45 AM" },
    { id: "sample-2", sender: "buyer", text: "Is this still available? What size is it? My daughter is 18 months old.", time: "09:48 AM" },
    { id: "sample-3", sender: "seller", text: `Yes, available! It is ${item.sizeLabel.toLowerCase()}. I can send measurements if that helps you check the fit.`, time: "09:50 AM" },
    { id: "sample-4", sender: "buyer", text: "Great! Any stains or damage I should know about?", time: "09:52 AM" },
    { id: "sample-5", sender: "seller", text: "No stains! Washed only with fragrance-free baby detergent. It is in excellent condition.", time: "09:53 AM" },
  ];

  useEffect(() => {
    if (messages.length && scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages.length]);

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sendMessage()) {
      setAnnouncement("Message added to the preview. Nothing was sent to the seller.");
      setPhotoError("");
      inputRef.current?.focus();
    }
  }

  function choosePhoto() {
    setDialog(null);
    fileRef.current?.click();
  }

  const dialogTitles = { actions: "Conversation actions", call: `Call ${seller.name}`, info: "About this conversation", Sell: "Sell an item", Profile: "Your profile" };

  return (
    <div className="mx-auto flex h-dvh w-full max-w-[412px] flex-col overflow-hidden bg-white shadow-sm">
      <header className="flex min-h-16 shrink-0 items-center justify-between gap-1 border-b border-gray-200 bg-white px-2">
        <div className="flex min-w-0 items-center gap-2">
          <Link href="/" aria-label="Back to browsing" className="flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-gray-50"><Image src="/images/item/back.svg" alt="" width={16} height={16} /></Link>
          <Image src={seller.avatar} alt="" width={48} height={48} priority className="size-12 shrink-0 rounded-full border border-gray-200 object-cover" />
          <div className="min-w-0">
            <div className="flex items-center gap-1"><h1 className="truncate text-xl font-medium">{seller.name}</h1>{seller.verified && <Image src="/images/item/verified.svg" alt="Verified seller" width={22} height={21} />}</div>
            {seller.verified && <p className="whitespace-nowrap text-xs text-brand">Verified Parent</p>}
          </div>
        </div>
        <div className="flex shrink-0">
          <button type="button" aria-label={`Call ${seller.name}`} onClick={() => setDialog("call")} className="flex size-11 items-center justify-center rounded-full hover:bg-gray-50"><ChatIcon name="phone" size={34} /></button>
          <button type="button" aria-label="Conversation information" onClick={() => setDialog("info")} className="flex size-11 items-center justify-center rounded-full hover:bg-gray-50"><ChatIcon name="info" size={36} /></button>
        </div>
      </header>

      <main ref={scrollRef} aria-label={`Conversation with ${seller.name}`} tabIndex={0} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-4 pb-6">
        <section aria-label="Item being discussed" className="flex items-center gap-4 rounded-xl border border-gray-200 p-3">
          <Image src={`/images/${product.image}.png`} alt={product.name} width={64} height={64} className="size-16 shrink-0 rounded-lg object-cover" />
          <div className="min-w-0 flex-1 text-sm"><h2 className="leading-5">{product.name}</h2><p className="text-brand">€{product.price.toFixed(2)}</p></div>
          <Link href={itemHref} aria-label={`View ${product.name}`} className="flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-brand px-4 text-base text-white hover:bg-brand/90">View</Link>
        </section>

        <p id="chat-preview-note" className="mt-3 text-center text-xs leading-4 text-gray-500">Demo conversation · Messages stay in this visit only.</p>
        <div className="my-4 text-center"><span className="rounded-full bg-gray-200 px-3 py-1 text-[10px] font-medium tracking-wider">TODAY</span></div>
        <div role="log" aria-label="Messages" aria-live="polite" aria-relevant="additions" className="space-y-4">
          {[...sampleMessages, ...messages].map(message => <MessageBubble key={message.id} message={message} sellerName={seller.name} />)}
        </div>
      </main>

      <footer className="shrink-0 bg-white">
        {photo && <div className="mx-4 mt-2 flex items-center gap-3 rounded-xl bg-gray-50 p-2"><Image src={photo.url} alt="Photo ready to add to the preview" unoptimized width={48} height={48} className="size-12 rounded-lg object-cover" /><p className="min-w-0 flex-1 truncate text-xs text-gray-600">{photo.name}</p><button type="button" onClick={removePhoto} className="min-h-11 px-2 text-sm text-brand">Remove</button></div>}
        {photoError && <p role="alert" className="px-4 pt-2 text-sm text-red-700">{photoError}</p>}
        <form onSubmit={submitMessage} aria-label="Compose a message" aria-describedby="chat-preview-note" className="flex items-center gap-1 px-3 py-3">
          <button type="button" aria-label="More conversation actions" onClick={() => setDialog("actions")} className="flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-gray-50"><ChatIcon name="add" size={36} /></button>
          <button type="button" aria-label="Attach a photo" onClick={choosePhoto} className="flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-gray-50"><ChatIcon name="photo" size={34} /></button>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" aria-label="Choose a photo" className="hidden" onChange={event => { const file = event.target.files?.[0]; if (file) setPhotoError(attachPhoto(file) ?? ""); event.target.value = ""; }} />
          <div className="chat-composer flex min-h-[50px] min-w-0 flex-1 items-center gap-1 rounded-full border border-gray-200 py-0.5 pr-1 pl-4">
            <textarea ref={inputRef} aria-label="Message" placeholder="Type a message..." rows={1} maxLength={1000} value={draft} onChange={event => { setDraft(event.target.value); setAnnouncement(""); }} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} className="max-h-24 min-h-10 min-w-0 flex-1 resize-none bg-transparent py-2 text-base leading-6 placeholder:text-gray-500" />
            <button type="submit" aria-label="Send message to local preview" disabled={!draft.trim() && !photo} className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-white hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-40"><ChatIcon name="send" size={20} /></button>
          </div>
        </form>
        <p role="status" className="sr-only">{announcement}</p>
        <BottomNavigation active="Chat" fixed={false} onUnavailable={label => setDialog(label === "Sell" ? "Sell" : "Profile")} />
      </footer>

      {dialog && <ItemDialog title={dialogTitles[dialog]} onClose={() => setDialog(null)}>
        {dialog === "actions" && <div className="space-y-3"><button type="button" onClick={choosePhoto} className="flex min-h-12 w-full items-center gap-2 rounded-xl border border-gray-200 px-3"><ChatIcon name="photo" size={30} />Attach a photo</button><Link href={itemHref} className="flex min-h-12 items-center rounded-xl border border-gray-200 px-4 text-brand">View item details</Link><p className="text-xs leading-5 text-gray-600">Photos stay in this local preview. Use a JPG, PNG or WebP under 5 MB.</p></div>}
        {dialog === "call" && <p className="text-sm leading-6 text-gray-600">Calling is not available in this preview. You can try writing a message in the conversation.</p>}
        {dialog === "info" && <div className="space-y-4 text-sm leading-6 text-gray-600"><p>This is a sample conversation with {seller.name} about {product.name}. The seller profile and earlier messages are demo content.</p><p>New messages and photos are kept while you browse the app. They disappear when you refresh and are not sent to anyone.</p><Link href={itemHref} className="inline-flex min-h-11 items-center font-medium text-brand">View item details</Link></div>}
        {(dialog === "Sell" || dialog === "Profile") && <p className="text-sm leading-6 text-gray-600">{dialog === "Sell" ? "Creating listings" : "Your account"} will be available in a later step.</p>}
      </ItemDialog>}
    </div>
  );
}
