"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession, isAdminLoggedIn } from "@/lib/session";
import { adminLoginSchema } from "@/lib/validation";
import type { FormState } from "@/lib/formState";

export async function adminLogin(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = adminLoginSchema.safeParse({ password: formData.get("password") });
  if (!parsed.success) {
    return { ok: false, error: "Digite a senha." };
  }

  if (parsed.data.password !== process.env.ADMIN_PASSWORD) {
    return { ok: false, error: "Senha incorreta." };
  }

  const session = await getSession();
  session.isAdmin = true;
  await session.save();

  redirect("/admin");
}

export async function adminLogout(): Promise<void> {
  const session = await getSession();
  session.destroy();
  redirect("/admin/login");
}

async function requireAdmin() {
  if (!(await isAdminLoggedIn())) {
    throw new Error("Não autorizado.");
  }
}

export async function approveNews(id: string): Promise<void> {
  await requireAdmin();
  await prisma.news.update({
    where: { id },
    data: { status: "APPROVED", approvedAt: new Date() },
  });
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/noticia/${id}`);
}

export async function rejectNews(id: string): Promise<void> {
  await requireAdmin();
  await prisma.news.update({
    where: { id },
    data: { status: "REJECTED" },
  });
  revalidatePath("/admin");
}

export async function approveEditSuggestion(id: string): Promise<void> {
  await requireAdmin();
  const suggestion = await prisma.editSuggestion.findUnique({ where: { id } });
  if (!suggestion || suggestion.status !== "PENDING") return;

  const sourcesUpdate = suggestion.proposedSourcesJson
    ? (JSON.parse(suggestion.proposedSourcesJson) as string[])
    : null;

  await prisma.$transaction(async (tx) => {
    await tx.news.update({
      where: { id: suggestion.newsId },
      data: {
        category: suggestion.proposedCategory ?? undefined,
        isIndigenous: suggestion.proposedIsIndigenous,
        title: suggestion.proposedTitle ?? undefined,
        text: suggestion.proposedText ?? undefined,
        incidentDate: suggestion.proposedIncidentDate,
        donationLink: suggestion.proposedDonationLink,
        photoUrl: suggestion.proposedPhotoUrl ?? undefined,
        ...(sourcesUpdate
          ? {
              sources: {
                deleteMany: {},
                create: sourcesUpdate.map((url) => ({ url })),
              },
            }
          : {}),
      },
    });

    await tx.editSuggestion.update({
      where: { id },
      data: { status: "APPROVED" },
    });
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/noticia/${suggestion.newsId}`);
}

export async function rejectEditSuggestion(id: string): Promise<void> {
  await requireAdmin();
  await prisma.editSuggestion.update({
    where: { id },
    data: { status: "REJECTED" },
  });
  revalidatePath("/admin");
}
