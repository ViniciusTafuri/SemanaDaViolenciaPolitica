import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EditSuggestionForm } from "@/components/EditSuggestionForm";

export const dynamic = "force-dynamic";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const news = await prisma.news.findFirst({
    where: { id, status: "APPROVED" },
    include: { sources: true, socialLinks: true },
  });

  if (!news) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">Sugerir edição</h1>
      <p className="mb-6 text-sm text-muted">
        Ajuste os campos abaixo. Sua sugestão será avaliada pela administração
        antes de substituir o conteúdo atual desta notícia.
      </p>
      <EditSuggestionForm
        newsId={news.id}
        defaults={{
          category: news.category,
          isIndigenous: news.isIndigenous,
          title: news.title,
          text: news.text,
          incidentDate: news.incidentDate ? news.incidentDate.toISOString().slice(0, 10) : "",
          sources: news.sources.map((source) => source.url),
          socialLinks: news.socialLinks.map((link) => link.url),
          donationLink: news.donationLink ?? "",
          photoUrl: news.photoUrl,
        }}
      />
    </div>
  );
}
