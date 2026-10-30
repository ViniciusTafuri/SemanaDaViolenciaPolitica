"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { editSuggestionSchema, newsSubmissionSchema } from "@/lib/validation";
import { ImageUploadError, uploadImage } from "@/lib/uploadImage";
import type { FormState, SubmittedValues } from "@/lib/formState";

function sourcesFromFormData(formData: FormData): string[] {
  return formData
    .getAll("sources")
    .filter((value): value is string => typeof value === "string" && value.trim() !== "");
}

function str(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return typeof value === "string" ? value : undefined;
}

function newsValuesFromFormData(formData: FormData): SubmittedValues {
  return {
    category: str(formData, "category"),
    isIndigenous: formData.get("isIndigenous") === "on",
    title: str(formData, "title"),
    text: str(formData, "text"),
    incidentDate: str(formData, "incidentDate"),
    sources: sourcesFromFormData(formData),
    donationLink: str(formData, "donationLink"),
    submitterName: str(formData, "submitterName"),
    submitterEmail: str(formData, "submitterEmail"),
  };
}

export async function submitNews(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const values = newsValuesFromFormData(formData);
  const attempt = Date.now();

  const parsed = newsSubmissionSchema.safeParse({
    category: values.category,
    isIndigenous: values.isIndigenous,
    title: values.title,
    text: values.text,
    incidentDate: values.incidentDate,
    sources: values.sources,
    donationLink: values.donationLink,
    submitterName: values.submitterName,
    submitterEmail: values.submitterEmail,
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Corrija os campos destacados.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      values,
      attempt,
    };
  }

  const photo = formData.get("photo");
  if (!(photo instanceof File) || photo.size === 0) {
    return { ok: false, error: "Envie uma foto para a notícia.", values, attempt };
  }

  let photoUrl: string;
  try {
    photoUrl = await uploadImage(photo);
  } catch (err) {
    const message = err instanceof ImageUploadError ? err.message : "Falha ao enviar a imagem.";
    return { ok: false, error: message, values, attempt };
  }

  const data = parsed.data;

  await prisma.news.create({
    data: {
      category: data.category,
      isIndigenous: data.isIndigenous,
      title: data.title,
      text: data.text,
      incidentDate: data.incidentDate,
      photoUrl,
      donationLink: data.donationLink,
      submitterName: data.submitterName,
      submitterEmail: data.submitterEmail,
      status: "PENDING",
      sources: {
        create: data.sources.map((url) => ({ url })),
      },
    },
  });

  revalidatePath("/admin");
  redirect("/obrigado?tipo=noticia");
}

export async function submitEditSuggestion(
  newsId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const values: SubmittedValues = {
    ...newsValuesFromFormData(formData),
    submitterNote: str(formData, "submitterNote"),
  };
  const attempt = Date.now();

  const original = await prisma.news.findFirst({
    where: { id: newsId, status: "APPROVED" },
    include: { sources: true },
  });

  if (!original) {
    return { ok: false, error: "Notícia não encontrada.", values, attempt };
  }

  const parsed = editSuggestionSchema.safeParse({
    category: values.category,
    isIndigenous: values.isIndigenous,
    title: values.title,
    text: values.text,
    incidentDate: values.incidentDate,
    sources: values.sources,
    donationLink: values.donationLink,
    submitterNote: values.submitterNote,
    submitterName: values.submitterName,
    submitterEmail: values.submitterEmail,
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Corrija os campos destacados.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      values,
      attempt,
    };
  }

  const data = parsed.data;

  const photo = formData.get("photo");
  let proposedPhotoUrl: string | undefined;
  if (photo instanceof File && photo.size > 0) {
    try {
      proposedPhotoUrl = await uploadImage(photo);
    } catch (err) {
      const message =
        err instanceof ImageUploadError ? err.message : "Falha ao enviar a imagem.";
      return { ok: false, error: message, values, attempt };
    }
  }

  const originalSources = original.sources.map((s) => s.url).sort();
  const newSources = [...data.sources].sort();
  const sourcesChanged =
    originalSources.length !== newSources.length ||
    originalSources.some((url, i) => url !== newSources[i]);

  const originalIncidentDateStr = original.incidentDate
    ? original.incidentDate.toISOString().slice(0, 10)
    : "";
  const newIncidentDateStr = data.incidentDate
    ? data.incidentDate.toISOString().slice(0, 10)
    : "";

  const hasChanges =
    original.category !== data.category ||
    original.isIndigenous !== data.isIndigenous ||
    original.title !== data.title ||
    original.text !== data.text ||
    (original.donationLink ?? "") !== (data.donationLink ?? "") ||
    originalIncidentDateStr !== newIncidentDateStr ||
    sourcesChanged ||
    Boolean(proposedPhotoUrl);

  if (!hasChanges) {
    return {
      ok: false,
      error: "Nenhuma alteração foi detectada em relação à notícia atual.",
      values,
      attempt,
    };
  }

  await prisma.editSuggestion.create({
    data: {
      newsId: original.id,
      proposedCategory: data.category,
      proposedIsIndigenous: data.isIndigenous,
      proposedTitle: data.title,
      proposedText: data.text,
      proposedIncidentDate: data.incidentDate ?? null,
      proposedSourcesJson: JSON.stringify(data.sources),
      proposedDonationLink: data.donationLink,
      proposedPhotoUrl,
      submitterNote: data.submitterNote,
      submitterName: data.submitterName,
      submitterEmail: data.submitterEmail,
      status: "PENDING",
    },
  });

  revalidatePath("/admin");
  redirect("/obrigado?tipo=edicao");
}
