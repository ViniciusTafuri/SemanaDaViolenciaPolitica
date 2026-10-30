import { prisma } from "@/lib/prisma";
import { ModerationCard } from "@/components/admin/ModerationCard";
import { EditSuggestionCard } from "@/components/admin/EditSuggestionCard";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [pendingNews, pendingSuggestions] = await Promise.all([
    prisma.news.findMany({
      where: { status: "PENDING" },
      include: { sources: true, socialLinks: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.editSuggestion.findMany({
      where: { status: "PENDING" },
      include: { news: { include: { sources: true, socialLinks: true } } },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h2 className="text-xl font-bold">
          Notícias pendentes <span className="text-muted">({pendingNews.length})</span>
        </h2>
        {pendingNews.length === 0 ? (
          <p className="text-sm text-muted">Nenhuma notícia pendente.</p>
        ) : (
          <div className="space-y-4">
            {pendingNews.map((news) => (
              <ModerationCard key={news.id} news={news} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">
          Sugestões de edição pendentes{" "}
          <span className="text-muted">({pendingSuggestions.length})</span>
        </h2>
        {pendingSuggestions.length === 0 ? (
          <p className="text-sm text-muted">Nenhuma sugestão pendente.</p>
        ) : (
          <div className="space-y-4">
            {pendingSuggestions.map((suggestion) => (
              <EditSuggestionCard key={suggestion.id} suggestion={suggestion} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
