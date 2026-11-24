// Shown while a route segment loads. Mirrors the home layout so content doesn't jump when it arrives.
export default function Loading() {
  const block = "safe-image-shimmer rounded-xl";
  return (
    <div role="status" aria-label="Loading" className="mx-auto min-h-dvh w-full max-w-[430px] bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
        <span className={`${block} size-8 rounded-full`} />
        <span className={`${block} h-8 w-40`} />
        <span className={`${block} size-8 rounded-full`} />
      </div>
      <div className="space-y-4 px-4 pt-4">
        <div className={`${block} h-[46px]`} />
        <div className={`${block} h-44`} />
        <div className={`${block} h-6 w-48`} />
        <div className="flex gap-6">{[0, 1, 2, 3].map(index => <span key={index} className={`${block} size-20 shrink-0`} />)}</div>
        <div className={`${block} h-6 w-40`} />
        <div className="grid grid-cols-2 gap-x-3 gap-y-4">
          {[0, 1, 2, 3].map(index => <div key={index} className="space-y-2"><div className={`${block} aspect-[184/192]`} /><div className={`${block} h-4 w-3/4`} /><div className={`${block} h-4 w-1/3`} /></div>)}
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
