"use client";

import { useActionState } from "react";
import { adminLogin } from "@/app/actions/admin";
import { INITIAL_FORM_STATE } from "@/lib/formState";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormAlert } from "@/components/ui/FormAlert";

export function AdminLoginForm() {
  const [state, formAction] = useActionState(adminLogin, INITIAL_FORM_STATE);

  return (
    <form action={formAction} className="space-y-4">
      <FormAlert message={state.error} />
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          className="w-full rounded-md border border-border bg-surface px-3 py-2"
        />
      </div>
      <SubmitButton>Entrar</SubmitButton>
    </form>
  );
}
