"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useSyncExternalStore, type FormEvent } from "react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { ItemDialog } from "@/components/item-dialog";
import { parseProfile, profileKey, type LocalProfile } from "@/lib/profile";

const changeEvent = "tiny-profile-changed";
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(changeEvent, callback);
  return () => { window.removeEventListener("storage", callback); window.removeEventListener(changeEvent, callback); };
}
function snapshot() { try { return localStorage.getItem(profileKey); } catch { return null; } }
const control = "mt-2 min-h-11 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-base focus:border-brand";
const primary = "flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-medium text-white hover:bg-brand/90";

function ProfileIcon({ kind }: { kind: "shield" | "children" | "edit" }) {
  return <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {kind === "shield" && <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z" /><path d="m8 12 3 3 5-6" /></>}
    {kind === "children" && <><circle cx="9" cy="8" r="3" /><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 4v2" /></>}
    {kind === "edit" && <><path d="m14 5 5 5M4 20l5-1L21 7l-5-5L4 14Z" /></>}
  </svg>;
}

export default function ProfileScreen() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => null);
  const profile = parseProfile(raw);
  const [dialog, setDialog] = useState<"manage" | "children" | "trust" | "notifications" | null>(null);
  const [editing, setEditing] = useState<LocalProfile>(profile);
  const [notice, setNotice] = useState("");
  const [saveError, setSaveError] = useState("");

  function open(kind: "manage" | "children") {
    setEditing({ ...profile, children: profile.children.map(child => ({ ...child })) }); setSaveError(""); setDialog(kind);
  }
  function save(event: FormEvent) {
    event.preventDefault();
    const next = { ...editing, name: editing.name.trim(), location: editing.location.trim(), bio: editing.bio.trim(), children: editing.children.map(child => ({ ...child, nickname: child.nickname.trim() })) };
    if (!next.name || next.children.some(child => !child.nickname)) { setSaveError("Please fill in the names before saving."); return; }
    try { localStorage.setItem(profileKey, JSON.stringify(next)); window.dispatchEvent(new Event(changeEvent)); setDialog(null); setNotice("Profile saved on this device."); }
    catch { setSaveError("Could not save. Your browser storage may be full or unavailable. Your changes are still here."); }
  }

  return <div className="mx-auto min-h-dvh w-full max-w-[412px] bg-[#faf9fb] shadow-sm">
    <header className="flex h-16 items-center justify-between bg-white px-4"><Link href="/" className="text-lg font-semibold text-brand">Tiny Treasures</Link><button type="button" aria-label="Notifications" onClick={() => setDialog("notifications")} className="flex size-11 items-center justify-center rounded-full hover:bg-purple-50"><Image src="/images/bell.svg" alt="" width={20} height={20} /></button></header>
    <main className="pb-24">
      <section aria-labelledby="profile-name" className="bg-gradient-to-b from-[#eee5f4] to-[#f7f2fa] px-6 pt-7 pb-10 text-center">
        <div className="relative mx-auto w-fit"><Image src="/images/item/seller-aisha.png" alt="Profile avatar" width={80} height={80} priority className="size-20 rounded-full border-4 border-white object-cover shadow-sm" /><span className="absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full bg-white"><Image src="/images/item/verified.svg" alt="Sample verified profile" width={20} height={20} /></span></div>
        <h1 id="profile-name" className="mt-3 break-words text-2xl font-semibold text-[#382640]">{profile.name}</h1>
        <p className="mt-1 text-sm text-gray-600">{profile.children.length ? `Parent of ${profile.children.length} · ${profile.children.map(child => child.age).join(" & ")}` : "A little less new. A little more loved."}</p>
        <p className="mt-1 text-xs text-gray-500">{profile.location}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white/90 px-3 py-1 text-xs font-medium text-emerald-800"><ProfileIcon kind="shield" />Verified Parent · Demo</span>
        {profile.bio && <p className="mx-auto mt-3 max-w-[290px] break-words text-sm leading-5 text-gray-600">{profile.bio}</p>}
      </section>
      <div className="space-y-4 px-4">
        <button type="button" onClick={() => open("children")} className="relative -mt-5 flex min-h-[88px] w-full items-center gap-3 rounded-2xl border border-[#ebe4ef] bg-white p-4 text-left shadow-sm"><span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-purple-50 text-brand"><ProfileIcon kind="children" /></span><span className="flex-1"><span className="block font-medium">Child Profiles</span><span className="mt-1 block text-xs leading-4 text-gray-500">Ages and profiles for your little ones</span></span><span aria-hidden="true" className="text-xl text-gray-400">›</span></button>
        <button type="button" onClick={() => open("manage")} className={primary}><ProfileIcon kind="edit" />Manage My Profile</button>
        <section aria-labelledby="trust-heading" className="rounded-2xl border border-[#ebe4ef] bg-white p-4">
          <div className="flex items-center justify-between gap-3"><h2 id="trust-heading" className="flex items-center gap-2 font-medium"><span className="text-brand"><ProfileIcon kind="shield" /></span>Parent Trust Score</h2><span className="text-lg font-semibold text-brand">4.9<span className="text-xs font-normal text-gray-400"> / 5</span></span></div>
          <p aria-label="4.9 out of 5 stars" className="mt-2 tracking-widest text-amber-500">★★★★★</p>
          <p className="mt-1 text-xs text-gray-500">Sample activity and reviews</p>
          <dl className="mt-3 divide-y divide-gray-100 text-sm">{[["Parent verified", "Verified"], ["Phone verified", "Verified"], ["Email verified", "Verified"], ["Items sold", "23"], ["Items bought", "18"], ["Cleanliness rating", "5 / 5"], ["Response time", "Within 1 hour"]].map(([label, value]) => <div key={label} className="flex items-center justify-between gap-3 py-2.5"><dt className="text-gray-500">{label}</dt><dd className={value === "Verified" ? "text-xs font-medium text-emerald-700" : "text-sm font-medium text-gray-700"}>{value === "Verified" ? "✓ Verified" : value}</dd></div>)}</dl>
        </section>
        <section aria-labelledby="reviews-heading" className="space-y-3"><div className="flex items-center justify-between"><h2 id="reviews-heading" className="font-medium">Recent Reviews</h2><span className="text-xs text-gray-400">Sample reviews</span></div>{[{ text: "Items exactly as described. Very clean!", name: "Hanna", time: "2 days ago" }, { text: "Great seller, quick response!", name: "Mira", time: "1 week ago" }].map(review => <article key={review.name} className="rounded-xl border border-[#ebe4ef] bg-white p-4"><p aria-label="5 out of 5 stars" className="text-sm tracking-wide text-amber-500">★★★★★</p><p className="mt-2 text-sm leading-5 text-gray-700">“{review.text}”</p><p className="mt-2 text-xs text-gray-400">{review.name} · {review.time}</p></article>)}</section>
        <button type="button" onClick={() => setDialog("trust")} className={primary}><ProfileIcon kind="shield" />Trust & Safety Center</button>
        <Link href="/sell/batch" className="flex min-h-11 items-center justify-center rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm font-medium text-brand">List a few treasures</Link>
        {notice && <p role="status" className="text-center text-sm text-brand">{notice}</p>}
        <p className="text-center text-xs leading-5 text-gray-400">Demo profile · Edits are stored on this device.</p>
      </div>
    </main>
    <BottomNavigation active="Profile" onUnavailable={() => {}} />
    {dialog && <ItemDialog title={{ manage: "Manage your profile", children: "Child profiles", trust: "Trust & Safety Center", notifications: "Notifications" }[dialog]} onClose={() => setDialog(null)}>
      {(dialog === "manage" || dialog === "children") && <form onSubmit={save} className="space-y-4">
        {dialog === "manage" ? <><label className="block text-sm">Display name<input required maxLength={60} value={editing.name} onChange={event => setEditing({ ...editing, name: event.target.value })} className={control} /></label><label className="block text-sm">Location<input maxLength={80} value={editing.location} onChange={event => setEditing({ ...editing, location: event.target.value })} className={control} /></label><label className="block text-sm">A little about you<textarea maxLength={200} rows={3} value={editing.bio} onChange={event => setEditing({ ...editing, bio: event.target.value })} className={`${control} resize-y`} /></label><button type="button" onClick={() => setDialog("children")} className="min-h-11 text-sm text-brand underline">Edit children’s profiles</button></> : <>
          <p className="text-sm leading-5 text-gray-500">Use a nickname and age range. These details stay on this device.</p>
          {editing.children.map((child, index) => <fieldset key={child.id} className="space-y-3 rounded-xl border border-gray-200 p-3"><legend className="px-1 text-sm font-medium">Child {index + 1}</legend><label className="block text-sm">Nickname<input required maxLength={40} value={child.nickname} onChange={event => setEditing({ ...editing, children: editing.children.map(item => item.id === child.id ? { ...item, nickname: event.target.value } : item) })} className={control} /></label><label className="block text-sm">Age<select value={child.age} onChange={event => setEditing({ ...editing, children: editing.children.map(item => item.id === child.id ? { ...item, age: event.target.value } : item) })} className={control}>{["Under 1 year", "1 year", "2 years", "3 years", "4 years", "5 years", "6–8 years", "9–12 years", "13+ years"].map(age => <option key={age}>{age}</option>)}</select></label><button type="button" onClick={() => setEditing({ ...editing, children: editing.children.filter(item => item.id !== child.id) })} className="min-h-11 text-sm text-gray-500 underline">Remove child</button></fieldset>)}
          <button type="button" disabled={editing.children.length >= 5} onClick={() => setEditing({ ...editing, children: [...editing.children, { id: crypto.randomUUID(), nickname: "", age: "Under 1 year" }] })} className="min-h-11 w-full rounded-xl border border-brand text-sm text-brand disabled:opacity-40">+ Add child</button>
        </>}
        {saveError && <p role="alert" className="text-sm text-red-700">{saveError}</p>}<button type="submit" className={primary}>Save changes</button>
      </form>}
      {dialog === "trust" && <div className="space-y-4 text-sm leading-6 text-gray-600"><p>Keep your transactions and conversations in the app once checkout is available. Never share passwords or payment codes.</p><p>For clothes, check the size label, seams, fasteners, and any stains. Photograph flaws and choose a condition that reflects the item today.</p><p>This demo’s trust scores, verifications, and reviews are examples. Live verification and reporting are not available yet.</p></div>}
      {dialog === "notifications" && <p className="text-sm leading-6 text-gray-600">You’re all caught up. Live notifications will be available when accounts are connected.</p>}
    </ItemDialog>}
  </div>;
}
