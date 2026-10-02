"use client";

import Image from "next/image";
import Link from "next/link";

type NavigationProps = {
  active: "Home" | "Sell" | "Chat" | "Profile" | null;
  fixed?: boolean;
  onHome?: () => void;
  onSearch?: () => void;
  onUnavailable: (label: string) => void;
};

export function BottomNavigation({ active, fixed = true, onHome, onSearch, onUnavailable }: NavigationProps) {
  const tabs = [
    { label: "Home", icon: active === "Home" ? "home" : "chat/home", href: "/", action: onHome },
    { label: "Search", icon: "nav-search", href: "/#product-search", action: onSearch },
    { label: "Sell", icon: active === "Sell" ? "sell-active" : "sell", href: "/sell" },
    { label: "Chat", icon: active === "Chat" ? "chat/chat" : "chat", href: "/chat" },
    { label: "Profile", icon: "profile", href: "/profile" },
  ];

  return (
    <nav aria-label="Main navigation" className={`navigation flex min-h-16 w-full max-w-[412px] items-center justify-around border-t border-gray-100 bg-white px-3 pb-[env(safe-area-inset-bottom)] ${fixed ? "fixed bottom-0 left-1/2 z-20 -translate-x-1/2" : "shrink-0"}`}>
      {tabs.map(tab => {
        const className = `flex min-h-16 min-w-12 flex-col items-center justify-center gap-1 text-[10px] font-medium ${tab.label === active ? "text-brand" : "text-gray-500"} ${tab.label === "Sell" && active === "Sell" ? "rounded-lg bg-brand/5" : ""}`;
        const content = <><Image src={`/images/${tab.icon}.svg`} alt="" width={20} height={20} className="size-5 object-contain" /><span>{tab.label}</span></>;
        return tab.href && !tab.action
          ? <Link key={tab.label} href={tab.href} aria-current={tab.label === active ? "page" : undefined} className={className}>{content}</Link>
          : <button key={tab.label} type="button" aria-current={tab.label === active ? "page" : undefined} onClick={tab.action ?? (() => onUnavailable(tab.label))} className={className}>{content}</button>;
      })}
    </nav>
  );
}
