import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found | Tiny Treasures" };

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col items-center justify-center bg-white px-6 text-center shadow-sm">
      <p aria-hidden="true" className="logo text-6xl text-brand">404</p>
      <h1 className="mt-4 text-2xl font-medium">We couldn’t find that page</h1>
      <p className="mt-2 max-w-[32ch] text-gray-600">It may have moved, or the link might be mistyped. There are plenty more treasures to discover.</p>
      <Link href="/" className="mt-6 flex min-h-12 items-center justify-center rounded-xl bg-brand px-8 text-white hover:bg-brand/90">Back to home</Link>
    </main>
  );
}
