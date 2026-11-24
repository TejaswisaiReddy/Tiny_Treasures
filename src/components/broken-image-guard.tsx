"use client";

import { useEffect } from "react";

// Decorative icons (alt="") that fail to load would otherwise show the browser's broken-image glyph.
// Hide them instead; they keep their space, so the layout does not shift. Photos use SafeImage's own fallback.
export function BrokenImageGuard() {
  useEffect(() => {
    const hide = (img: HTMLImageElement) => { if (img.alt === "") img.style.visibility = "hidden"; };
    const onError = (event: Event) => { if (event.target instanceof HTMLImageElement) hide(event.target); };
    document.addEventListener("error", onError, true);
    // Images can fail before hydration, so check the ones that have already finished.
    // decode() rejects only for a broken image, which also covers SVGs with no intrinsic size.
    for (const img of Array.from(document.images)) if (img.complete && img.naturalWidth === 0) img.decode().catch(() => hide(img));
    return () => document.removeEventListener("error", onError, true);
  }, []);
  return null;
}
