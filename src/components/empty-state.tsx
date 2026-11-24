import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  message?: string;
  action?: ReactNode;
  /** Smaller padding for use inside a section that already has its own heading. */
  compact?: boolean;
};

export function EmptyState({ title, message, action, compact = false }: EmptyStateProps) {
  return (
    <div role="status" className={`flex flex-col items-center rounded-xl bg-gray-50 text-center ${compact ? "px-5 py-6" : "px-6 py-10"}`}>
      <span aria-hidden="true" className="mb-3 flex size-12 items-center justify-center rounded-full bg-fuchsia-50 text-brand">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-6">
          <path d="M20 12v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8" />
          <path d="M2 8h20v4H2zM12 21V8" />
          <path d="M12 8S10.5 3 8 3a2.5 2.5 0 0 0 0 5M12 8s1.5-5 4-5a2.5 2.5 0 0 1 0 5" />
        </svg>
      </span>
      <p className="text-base font-medium text-ink">{title}</p>
      {message && <p className="mt-1 max-w-[30ch] text-sm leading-5 text-gray-600">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
