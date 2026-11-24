"use client"; // Error boundaries must be Client Components.

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col items-center justify-center bg-white px-6 text-center shadow-sm">
      <p aria-hidden="true" className="logo text-4xl text-brand">oops</p>
      <h1 className="mt-4 text-2xl font-medium">Something went wrong</h1>
      <p className="mt-2 max-w-[32ch] text-gray-600">We couldn’t load this page. Please try again, or head back to browse more treasures.</p>
      <div className="mt-6 flex w-full max-w-xs flex-col gap-3">
        <button type="button" onClick={() => retry()} className="min-h-12 rounded-xl bg-brand px-6 text-white hover:bg-brand/90">Try again</button>
        <Link href="/" className="flex min-h-12 items-center justify-center rounded-xl border-2 border-brand px-6 text-brand hover:bg-fuchsia-50">Back to home</Link>
      </div>
      {error.digest && <p className="mt-6 text-xs text-gray-400">Reference: {error.digest}</p>}
    </main>
  );
}
