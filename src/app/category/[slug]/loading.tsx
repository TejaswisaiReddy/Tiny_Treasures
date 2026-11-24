const skeleton = "safe-image-shimmer rounded-xl";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading category listings" className="mx-auto min-h-dvh w-full max-w-[430px] bg-white shadow-sm">
      <div className="flex min-h-20 items-center gap-3 border-b border-gray-200 px-4 py-3">
        <span className={`${skeleton} size-11 shrink-0 rounded-full`} />
        <div className="space-y-2">
          <span className={`${skeleton} block h-5 w-32`} />
          <span className={`${skeleton} block h-4 w-16`} />
        </div>
      </div>
      <div className="sticky top-0 z-10 flex gap-2 border-b border-gray-200 bg-white px-4 py-3">
        <span className={`${skeleton} h-11 flex-1`} />
        <span className={`${skeleton} h-11 w-36`} />
      </div>
      <div className="space-y-3 px-4 py-4">
        {[0, 1, 2, 3].map(item => (
          <div key={item} className="flex gap-3 rounded-2xl border border-gray-200 p-3">
            <span className={`${skeleton} h-[130px] w-[110px] shrink-0`} />
            <div className="flex-1 space-y-3 py-1">
              <span className={`${skeleton} block h-5 w-4/5`} />
              <span className={`${skeleton} block h-5 w-1/3`} />
              <span className={`${skeleton} block h-6 w-3/4`} />
              <span className={`${skeleton} block h-4 w-2/3`} />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
