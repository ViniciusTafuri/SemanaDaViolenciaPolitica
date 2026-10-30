import type { Category } from "@/generated/prisma/client";
import { CATEGORY_SLUG, categoryLabel } from "@/lib/category";
import { NewsCard, type NewsWithSources } from "@/components/NewsCard";

const CATEGORY_ACCENT: Record<Category, string> = {
  MORTE: "var(--category-morte)",
  AGRESSAO: "var(--category-agressao)",
  INTIMIDACAO_DESTRUICAO: "var(--category-intimidacao)",
};

export function CategorySection({
  category,
  items,
  count,
}: {
  category: Category;
  items: NewsWithSources[];
  count: number;
}) {
  const accent = CATEGORY_ACCENT[category];

  return (
    <section id={CATEGORY_SLUG[category]} className="space-y-4">
      <div className="flex items-center gap-3 border-b border-border pb-2">
        <h2 className="text-xl font-bold sm:text-2xl" style={{ color: accent }}>
          {categoryLabel(category)}
        </h2>
        <span
          className="rounded-full px-2.5 py-0.5 text-sm font-semibold"
          style={{
            color: accent,
            backgroundColor: `color-mix(in srgb, ${accent} 15%, transparent)`,
          }}
        >
          {count}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted">Nenhuma notícia publicada nesta categoria ainda.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      )}
    </section>
  );
}
