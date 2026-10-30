import { Category } from "@/generated/prisma/client";
import { z } from "zod";

// Restrito a http/https (em vez do z.url() genérico) para não aceitar
// esquemas como "javascript:", já que esses links são renderizados como
// href clicável para quem visita o site.
const urlField = z
  .string()
  .trim()
  .pipe(
    z.url({
      protocol: /^https?$/,
      message: "Link inválido. Use um endereço começando com http:// ou https://.",
    })
  );

const optionalUrlField = z
  .union([urlField, z.literal("")])
  .optional()
  .transform((value) => (value ? value : undefined));

const optionalEmailField = z
  .union([z.string().trim().email({ message: "E-mail inválido." }), z.literal("")])
  .optional()
  .transform((value) => (value ? value : undefined));

const optionalDateField = z
  .string()
  .optional()
  .transform((value) => (value ? value.trim() : ""))
  .refine((value) => value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value), {
    message: "Data inválida.",
  })
  .transform((value) => (value ? new Date(`${value}T00:00:00.000Z`) : undefined));

export const newsSubmissionSchema = z.object({
  category: z.enum(Category, { message: "Selecione uma categoria." }),
  isIndigenous: z.boolean(),
  title: z
    .string()
    .trim()
    .min(5, "O título deve ter pelo menos 5 caracteres.")
    .max(200, "O título deve ter no máximo 200 caracteres."),
  text: z
    .string()
    .trim()
    .min(20, "Descreva o ocorrido com pelo menos 20 caracteres.")
    .max(5000, "O texto deve ter no máximo 5000 caracteres."),
  incidentDate: optionalDateField,
  sources: z
    .array(urlField)
    .min(1, "Adicione ao menos um link de fonte.")
    .max(10, "No máximo 10 links de fonte."),
  socialLinks: z.array(urlField).max(20, "No máximo 20 links de redes sociais.").default([]),
  donationLink: optionalUrlField,
  submitterName: z.string().trim().max(100).optional(),
  submitterEmail: optionalEmailField,
});

export type NewsSubmissionInput = z.infer<typeof newsSubmissionSchema>;

export const editSuggestionSchema = z.object({
  category: z.enum(Category, { message: "Selecione uma categoria." }),
  isIndigenous: z.boolean(),
  title: z
    .string()
    .trim()
    .min(5, "O título deve ter pelo menos 5 caracteres.")
    .max(200, "O título deve ter no máximo 200 caracteres."),
  text: z
    .string()
    .trim()
    .min(20, "Descreva o ocorrido com pelo menos 20 caracteres.")
    .max(5000, "O texto deve ter no máximo 5000 caracteres."),
  incidentDate: optionalDateField,
  sources: z
    .array(urlField)
    .min(1, "Adicione ao menos um link de fonte.")
    .max(10, "No máximo 10 links de fonte."),
  socialLinks: z.array(urlField).max(20, "No máximo 20 links de redes sociais.").default([]),
  donationLink: optionalUrlField,
  submitterNote: z.string().trim().max(1000).optional(),
  submitterName: z.string().trim().max(100).optional(),
  submitterEmail: optionalEmailField,
});

export type EditSuggestionInput = z.infer<typeof editSuggestionSchema>;

export const adminLoginSchema = z.object({
  password: z.string().min(1, "Digite a senha."),
});
