import Link from "next/link";

export default function ItemNotFound() {
  return <main className="mx-auto flex min-h-dvh max-w-[412px] flex-col items-center justify-center bg-white p-6 text-center"><h1 className="text-2xl font-medium">Item not found</h1><p className="mt-3 text-gray-600">This listing may no longer be available.</p><Link href="/" className="mt-6 rounded-xl bg-brand px-6 py-3 text-white">Browse treasures</Link></main>;
}
