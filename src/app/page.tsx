import { prisma } from "@/lib/prisma";
import { CATEGORY_ORDER } from "@/lib/category";
import { CategorySection } from "@/components/CategorySection";
import { CallToAction } from "@/components/CallToAction";
import { IndigenousFilterToggle } from "@/components/IndigenousFilterToggle";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ indigenas?: string }>;
}) {
  const { indigenas } = await searchParams;
  const filterIndigenous = indigenas === "1";

  const sections = await Promise.all(
    CATEGORY_ORDER.map(async (category) => {
      const where = {
        category,
        status: "APPROVED" as const,
        ...(filterIndigenous ? { isIndigenous: true as const } : {}),
      };
      const [items, count] = await Promise.all([
        prisma.news.findMany({
          where,
          include: { sources: true },
          orderBy: { approvedAt: "desc" },
        }),
        prisma.news.count({ where }),
      ]);
      return { category, items, count };
    })
  );

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-8">
      <section className="space-y-3">
        <h1 className="text-2xl font-bold sm:text-3xl">Semana da Violência Política</h1>
        <p className="max-w-3xl text-muted">
          Registro colaborativo de mortes, agressões, intimidações e destruições
          motivadas por violência política nesta semana. Qualquer pessoa pode enviar
          uma notícia ou sugerir a edição de uma já publicada; todo conteúdo passa
          por revisão da administração antes de entrar no ar.
        </p>
      </section>

      <CallToAction />

      <div id="listas" className="space-y-8">
        <IndigenousFilterToggle active={filterIndigenous} />

        <div className="space-y-12">
          {sections.map(({ category, items, count }) => (
            <CategorySection key={category} category={category} items={items} count={count} />
          ))}
        </div>
      </div>
    </div>
  );
}
