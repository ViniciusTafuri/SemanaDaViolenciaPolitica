import Image from "next/image";
import Link from "next/link";
import type { News, SocialLink, Source } from "@/generated/prisma/client";
import { CATEGORY_ACCENT_VAR, categoryLabel } from "@/lib/category";
import { IndigenousTag } from "@/components/IndigenousTag";
import { SocialLinkIcon } from "@/components/ui/SocialLinkIcon";

export type NewsWithSources = News & { sources: Source[]; socialLinks: SocialLink[] };

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
  const accent = CATEGORY_ACCENT_VAR[news.category];

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-shadow shadow-card-hover">
      <Link href={`/noticia/${news.id}`} className="relative block aspect-[16/10] bg-black/5">
        <Image
          src={news.photoUrl}
          alt={news.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <span
          className="absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-white shadow"
          style={{ backgroundColor: accent }}
        >
          {categoryLabel(news.category)}
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-2">
          {incidentDate && <span className="text-xs text-muted">{incidentDate}</span>}
          {news.isIndigenous && <IndigenousTag />}
        </div>
        <h3 className="font-serif text-lg font-bold leading-snug">
          <Link href={`/noticia/${news.id}`} className="hover:text-accent">
            {news.title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm text-muted">{news.text}</p>
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-muted">
              {news.sources.length} fonte{news.sources.length > 1 ? "s" : ""}
            </span>
            {news.socialLinks.length > 0 && (
              <div className="flex items-center gap-1.5">
                {news.socialLinks.map((link) => (
                  <SocialLinkIcon key={link.id} url={link.url} />
                ))}
              </div>
            )}
          </div>
          <Link href={`/noticia/${news.id}`} className="font-medium text-accent hover:underline">
            Ver detalhes →
          </Link>
        </div>
      </div>
    </article>
  );
}
