"use client";

import { useTransition } from "react";

export function ApproveRejectButtons({
  onApprove,
  onReject,
}: {
  onApprove: () => Promise<void>;
  onReject: () => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex shrink-0 gap-2">
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(onApprove)}
        className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-60"
      >
        Aprovar
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(onReject)}
        className="rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-black/5 disabled:opacity-60"
      >
        Rejeitar
      </button>
    </div>
  );
}
