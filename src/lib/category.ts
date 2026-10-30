import { Category } from "@/generated/prisma/client";

export const CATEGORY_ORDER: Category[] = [
  Category.MORTE,
  Category.AGRESSAO,
  Category.INTIMIDACAO_DESTRUICAO,
];

export const CATEGORY_LABEL: Record<Category, string> = {
  MORTE: "Mortes",
  AGRESSAO: "Agressões",
  INTIMIDACAO_DESTRUICAO: "Intimidações e Destruições",
};

export const CATEGORY_SLUG: Record<Category, string> = {
  MORTE: "mortes",
  AGRESSAO: "agressoes",
  INTIMIDACAO_DESTRUICAO: "intimidacoes-destruicoes",
};

export function categoryLabel(category: Category): string {
  return CATEGORY_LABEL[category];
}

export const CATEGORY_ACCENT_VAR: Record<Category, string> = {
  MORTE: "var(--category-morte)",
  AGRESSAO: "var(--category-agressao)",
  INTIMIDACAO_DESTRUICAO: "var(--category-intimidacao)",
};
