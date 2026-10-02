export function CaptureIcon({ name }: { name: "camera" | "gallery" | "light" | "plus" }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === "camera" && <><path d="M8 5 9.5 3h5L16 5h4v15H4V5Z" /><circle cx="12" cy="12" r="4" /></>}
    {name === "gallery" && <><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8" cy="8" r="1.5" /><path d="m4 17 5-5 4 4 3-3 5 5" /></>}
    {name === "light" && <><path d="m13 2-7 12h6l-1 8 7-12h-6Z" /></>}
    {name === "plus" && <path d="M12 5v14M5 12h14" />}
  </svg>;
}
