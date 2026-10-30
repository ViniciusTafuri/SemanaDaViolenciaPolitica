"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

export function SubmitButton({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-accent px-4 py-2 font-medium text-white hover:bg-accent-hover disabled:opacity-60"
    >
      {pending ? "Enviando..." : children}
    </button>
  );
}
