"use client";

import Image, { type ImageProps } from "next/image";
import { useCallback, useState, type CSSProperties } from "react";

type Status = "loading" | "loaded" | "error";

type SafeImageProps = Omit<ImageProps, "src" | "alt" | "className" | "onLoad" | "onError"> & {
  /** Missing or empty src renders the fallback straight away (no request is made). */
  src?: ImageProps["src"] | null;
  /** Describe meaningful images; pass "" for decorative ones. */
  alt?: string;
  /** Classes for the outer box: size, radius, ring. The box keeps its size whether the image loads or fails. */
  className?: string;
  /** Classes for the <img> itself, e.g. object-contain or opacity. Defaults to object-cover. */
  imageClassName?: string;
  /** Classes for the fallback box. Defaults to a neutral grey with a muted icon. */
  fallbackClassName?: string;
  wrapperStyle?: CSSProperties;
};

/**
 * next/image with a shimmer while loading and a neutral fallback when the file is missing or blocked.
 * The fallback is inline SVG, so it still renders when /images/* cannot be fetched.
 *
 * - `fill`: the box fills the nearest positioned parent, which sets the size.
 * - `width`/`height`: the box takes `className` for its size and keeps the width/height aspect ratio.
 */
export function SafeImage({ src, alt = "", className = "", imageClassName = "object-cover", fallbackClassName = "bg-gray-100 text-gray-400", wrapperStyle, fill, width, height, style, ...rest }: SafeImageProps) {
  const [status, setStatus] = useState<Status>(src ? "loading" : "error");
  const [trackedSrc, setTrackedSrc] = useState(src);
  if (trackedSrc !== src) {
    // Reset when a new image is passed in (React's recommended "adjust state during render" pattern).
    setTrackedSrc(src);
    setStatus(src ? "loading" : "error");
  }

  // The image can finish (or fail) before React hydrates, so check its state once it is attached.
  const checkComplete = useCallback((img: HTMLImageElement | null) => {
    if (!img?.complete) return;
    if (img.naturalWidth > 0) setStatus("loaded");
    else img.decode().then(() => setStatus("loaded"), () => setStatus("error")); // SVGs can report 0 width yet be fine.
  }, []);

  const boxClass = fill
    ? `absolute inset-0 block overflow-hidden ${className}`
    : `relative inline-block shrink-0 overflow-hidden align-middle ${className}`;
  const boxStyle: CSSProperties = fill
    ? { ...wrapperStyle }
    : { aspectRatio: `${width} / ${height}`, ...(className ? null : { width: Number(width) }), ...wrapperStyle };
  const failed = status === "error" || !src;

  return (
    <span className={boxClass} style={boxStyle}>
      {status === "loading" && <span aria-hidden="true" className="safe-image-shimmer absolute inset-0" />}
      {failed
        ? <span
            role={alt ? "img" : undefined}
            aria-label={alt ? `${alt} (image unavailable)` : undefined}
            aria-hidden={alt ? undefined : true}
            className={`absolute inset-0 flex items-center justify-center ${fallbackClassName}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-1/3 max-h-10 max-w-10 min-h-4 min-w-4">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
            </svg>
          </span>
        : <Image
            {...rest}
            ref={checkComplete}
            src={src}
            alt={alt}
            fill={fill}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            style={style}
            className={`${fill ? "" : "size-full"} ${imageClassName}`}
            onLoad={() => setStatus("loaded")}
            onError={() => setStatus("error")}
          />}
    </span>
  );
}
