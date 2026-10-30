import { redirect } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/session";
import { AdminLoginForm } from "@/components/AdminLoginForm";

export default async function AdminLoginPage() {
  if (await isAdminLoggedIn()) {
    redirect("/admin");
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-6 text-2xl font-bold">Acesso da administração</h1>
      <AdminLoginForm />
    </div>
  );
}
