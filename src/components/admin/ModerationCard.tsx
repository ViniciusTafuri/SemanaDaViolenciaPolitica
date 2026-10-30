import Image from "next/image";
import type { News, Source } from "@/generated/prisma/client";
import { categoryLabel } from "@/lib/category";
import { approveNews, rejectNews } from "@/app/actions/admin";
import { ApproveRejectButtons } from "@/components/admin/ApproveRejectButtons";
import { IndigenousTag } from "@/components/IndigenousTag";

type NewsWithSources = News & { sources: Source[] };

export function ModerationCard({ news }: { news: NewsWithSources }) {
  return (
    <div className="space-y-3 rounded-lg border border-border bg-surface p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase text-accent">
              {categoryLabel(news.category)}
            </span>
            {news.isIndigenous && <IndigenousTag />}
          </div>
          <h3 className="font-semibold">{news.title}</h3>
        </div>
        <ApproveRejectButtons
          onApprove={approveNews.bind(null, news.id)}
          onReject={rejectNews.bind(null, news.id)}
        />
      </div>

      <div className="flex gap-4">
        <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-md border border-border">
          <Image src={news.photoUrl} alt={news.title} fill className="object-cover" sizes="128px" />
        </div>
        <p className="line-clamp-4 text-sm text-muted">{news.text}</p>
      </div>

      <div className="space-y-1 text-xs text-muted">
        <p>Fontes: {news.sources.map((source) => source.url).join(", ")}</p>
        {news.donationLink && <p>Doação: {news.donationLink}</p>}
        {(news.submitterName || news.submitterEmail) && (
          <p>
            Enviado por: {news.submitterName ?? "—"}{" "}
            {news.submitterEmail ? `(${news.submitterEmail})` : ""}
          </p>
        )}
      </div>
    </div>
  );
}
