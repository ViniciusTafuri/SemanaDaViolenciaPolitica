import Image from "next/image";
import Link from "next/link";
import type { News, Source } from "@/generated/prisma/client";
import { IndigenousTag } from "@/components/IndigenousTag";

export type NewsWithSources = News & { sources: Source[] };

function formatDate(date: Date | null): string | null {
  if (!date) return null;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function NewsCard({ news }: { news: NewsWithSources }) {
  const incidentDate = formatDate(news.incidentDate);

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface">
      <Link href={`/noticia/${news.id}`} className="relative block aspect-[16/10] bg-black/5">
        <Image
          src={news.photoUrl}
          alt={news.title}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {incidentDate && <span className="text-xs text-muted">{incidentDate}</span>}
        {news.isIndigenous && <IndigenousTag />}
        <h3 className="font-semibold leading-snug">
          <Link href={`/noticia/${news.id}`} className="hover:underline">
            {news.title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm text-muted">{news.text}</p>
        <div className="mt-auto flex items-center justify-between pt-2 text-xs">
          <span className="text-muted">
            {news.sources.length} fonte{news.sources.length > 1 ? "s" : ""}
          </span>
          <Link href={`/noticia/${news.id}`} className="font-medium text-accent hover:underline">
            Ver detalhes →
          </Link>
        </div>
      </div>
    </article>
  );
}
