import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/session";
import { adminLogout } from "@/app/actions/admin";

export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  if (!(await isAdminLoggedIn())) {
    redirect("/admin/login");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Painel da administração</h1>
        <form action={adminLogout}>
          <button type="submit" className="text-sm font-medium text-muted hover:underline">
            Sair
          </button>
        </form>
      </div>
      {children}
    </div>
  );
}
