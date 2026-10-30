import type { Category } from "@/generated/prisma/client";
import { CATEGORY_ACCENT_VAR, CATEGORY_SLUG, categoryLabel } from "@/lib/category";
import { NewsCard, type NewsWithSources } from "@/components/NewsCard";

export function CategorySection({
  category,
  items,
  count,
}: {
  category: Category;
  items: NewsWithSources[];
  count: number;
}) {
  const accent = CATEGORY_ACCENT_VAR[category];

  return (
    <section id={CATEGORY_SLUG[category]} className="scroll-mt-20 space-y-5">
      <div className="flex items-center gap-3">
        <span className="h-8 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
        <h2 className="font-serif text-2xl font-bold sm:text-3xl" style={{ color: accent }}>
          {categoryLabel(category)}
        </h2>
        <span
          className="rounded-full px-3 py-0.5 text-sm font-semibold"
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
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      )}
    </section>
  );
}
