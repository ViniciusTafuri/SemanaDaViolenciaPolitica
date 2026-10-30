import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { categoryLabel } from "@/lib/category";
import { IndigenousTag } from "@/components/IndigenousTag";
import { SocialLinkIcon } from "@/components/ui/SocialLinkIcon";

export const dynamic = "force-dynamic";

function formatDate(date: Date | null): string | null {
  if (!date) return null;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export default async function NewsDetailPage({
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

  const incidentDate = formatDate(news.incidentDate);

  return (
    <article className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <Link href="/#listas" className="text-sm text-muted hover:underline">
        ← Voltar para as listas
      </Link>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="rounded-full px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-white"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {categoryLabel(news.category)}
          </span>
          {news.isIndigenous && <IndigenousTag />}
        </div>
        <h1 className="font-serif text-3xl font-bold leading-tight sm:text-4xl">{news.title}</h1>
        {incidentDate && <p className="text-sm text-muted">Ocorrido em {incidentDate}</p>}
        {news.socialLinks.length > 0 && (
          <div className="flex items-center gap-2 pt-1">
            {news.socialLinks.map((link) => (
              <SocialLinkIcon key={link.id} url={link.url} />
            ))}
          </div>
        )}
      </header>

      <div className="relative aspect-video overflow-hidden rounded-2xl border border-border shadow-card">
        <Image src={news.photoUrl} alt={news.title} fill className="object-cover" sizes="100vw" />
      </div>

      <p className="whitespace-pre-wrap text-lg leading-relaxed">{news.text}</p>

      <div className="space-y-2">
        <h2 className="font-serif text-lg font-semibold">Fontes</h2>
        <ul className="list-disc space-y-1 pl-5">
          {news.sources.map((source) => (
            <li key={source.id}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-accent hover:underline"
              >
                {source.url}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {news.donationLink && (
        <a
          href={news.donationLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full bg-accent px-5 py-2.5 font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Apoiar / Doar
        </a>
      )}

      <div className="border-t border-border pt-4">
        <Link
          href={`/noticia/${news.id}/editar`}
          className="text-sm font-medium text-accent hover:underline"
        >
          Sugerir uma correção ou edição desta notícia
        </Link>
      </div>
    </article>
  );
}
