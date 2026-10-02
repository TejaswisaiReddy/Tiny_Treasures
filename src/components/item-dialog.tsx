"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function ItemDialog({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog?.showModal();
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <dialog ref={ref} aria-labelledby="item-dialog-title" onCancel={event => { event.preventDefault(); onClose(); }} className="m-auto max-h-[90dvh] w-[calc(100%-32px)] max-w-[380px] overflow-y-auto rounded-2xl bg-white p-5 text-ink shadow-xl backdrop:bg-black/40">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h2 id="item-dialog-title" className="pt-2 text-xl font-medium">{title}</h2>
        <button type="button" onClick={onClose} className="min-h-11 rounded-lg px-2 text-sm text-brand hover:bg-fuchsia-50">Close</button>
      </div>
      {children}
    </dialog>
  );
}
