import type { ReactNode } from "react";

const paths: Record<string, ReactNode> = {
  check: <path d="m5 12 4 4L19 6" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  truck: <><path d="M3 6h11v11H3zM14 10h4l3 4v3h-7" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></>,
  box: <><path d="m12 3 9 5v9l-9 5-9-5V8zM3 8l9 5 9-5M12 13v9M7.5 5.5l9 5" /></>,
  pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></>,
  phone: <path d="M7 3 4 4c-3 5 11 19 16 16l1-3-5-3-2 2a14 14 0 0 1-6-6l2-2Z" />,
  message: <><path d="M4 4h16v13H9l-5 4zM8 8h8M8 12h6" /></>,
  shield: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z" /><path d="m8 12 3 3 5-6" /></>,
  edit: <><path d="m15 4 5 5M4 20l5-1L21 7l-4-4L5 15z" /></>,
};

export function OrderIcon({ name, size = 20, className = "" }: {
  name: "check" | "close" | "truck" | "box" | "pin" | "phone" | "message" | "shield" | "edit";
  size?: number;
  className?: string;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`shrink-0 ${className}`}>{paths[name]}</svg>;
}
