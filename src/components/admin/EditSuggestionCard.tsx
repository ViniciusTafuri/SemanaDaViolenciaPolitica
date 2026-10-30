import Image from "next/image";
import type { EditSuggestion, News, SocialLink, Source } from "@/generated/prisma/client";
import { categoryLabel } from "@/lib/category";
import { approveEditSuggestion, rejectEditSuggestion } from "@/app/actions/admin";
import { ApproveRejectButtons } from "@/components/admin/ApproveRejectButtons";

type SuggestionWithNews = EditSuggestion & {
  news: News & { sources: Source[]; socialLinks: SocialLink[] };
};

function normalize(value?: string | null): string {
  return value ?? "";
}

function formatDate(date: Date | null): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

function DiffRow({
  label,
  original,
  proposed,
}: {
  label: string;
  original?: string | null;
  proposed?: string | null;
}) {
  const originalValue = normalize(original);
  const proposedValue = normalize(proposed);
  if (originalValue === proposedValue) return null;

  return (
    <div className="space-y-0.5 text-sm">
      <p className="font-medium">{label}</p>
      <p className="text-muted line-through">{originalValue || "(vazio)"}</p>
      <p style={{ color: "var(--accent)" }}>{proposedValue || "(vazio)"}</p>
    </div>
  );
}

export function EditSuggestionCard({ suggestion }: { suggestion: SuggestionWithNews }) {
  const { news } = suggestion;
  const proposedSources: string[] = suggestion.proposedSourcesJson
    ? JSON.parse(suggestion.proposedSourcesJson)
    : [];
  const originalSources = news.sources.map((source) => source.url);
  const sourcesChanged =
    JSON.stringify([...originalSources].sort()) !== JSON.stringify([...proposedSources].sort());

  const proposedSocialLinks: string[] = suggestion.proposedSocialLinksJson
    ? JSON.parse(suggestion.proposedSocialLinksJson)
    : [];
  const originalSocialLinks = news.socialLinks.map((link) => link.url);
  const socialLinksChanged =
    JSON.stringify([...originalSocialLinks].sort()) !==
    JSON.stringify([...proposedSocialLinks].sort());

  return (
    <div className="space-y-3 rounded-lg border border-border bg-surface p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <span className="text-xs font-semibold uppercase text-accent">
          Sugestão para: {news.title}
        </span>
        <ApproveRejectButtons
          onApprove={approveEditSuggestion.bind(null, suggestion.id)}
          onReject={rejectEditSuggestion.bind(null, suggestion.id)}
        />
      </div>

      <div className="space-y-3 rounded-md bg-background p-3">
        <DiffRow
          label="Categoria"
          original={categoryLabel(news.category)}
          proposed={suggestion.proposedCategory ? categoryLabel(suggestion.proposedCategory) : undefined}
        />
        <DiffRow
          label="Povos Indígenas"
          original={news.isIndigenous ? "Sim" : "Não"}
          proposed={suggestion.proposedIsIndigenous ? "Sim" : "Não"}
        />
        <DiffRow label="Título" original={news.title} proposed={suggestion.proposedTitle} />
        <DiffRow label="Texto" original={news.text} proposed={suggestion.proposedText} />
        <DiffRow
          label="Data do ocorrido"
          original={formatDate(news.incidentDate)}
          proposed={formatDate(suggestion.proposedIncidentDate)}
        />
        <DiffRow
          label="Link de doação"
          original={news.donationLink}
          proposed={suggestion.proposedDonationLink}
        />

        {sourcesChanged && (
          <div className="space-y-0.5 text-sm">
            <p className="font-medium">Fontes</p>
            <p className="text-muted line-through">{originalSources.join(", ") || "(nenhuma)"}</p>
            <p style={{ color: "var(--accent)" }}>{proposedSources.join(", ")}</p>
          </div>
        )}

        {socialLinksChanged && (
          <div className="space-y-0.5 text-sm">
            <p className="font-medium">Redes sociais</p>
            <p className="text-muted line-through">
              {originalSocialLinks.join(", ") || "(nenhuma)"}
            </p>
            <p style={{ color: "var(--accent)" }}>
              {proposedSocialLinks.join(", ") || "(nenhuma)"}
            </p>
          </div>
        )}

        {suggestion.proposedPhotoUrl && (
          <div className="space-y-1 text-sm">
            <p className="font-medium">Foto</p>
            <div className="flex gap-2">
              <div className="relative h-20 w-28 overflow-hidden rounded-md border border-border">
                <Image src={news.photoUrl} alt="Foto atual" fill className="object-cover" sizes="112px" />
              </div>
              <div className="relative h-20 w-28 overflow-hidden rounded-md border border-accent">
                <Image
                  src={suggestion.proposedPhotoUrl}
                  alt="Foto sugerida"
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {suggestion.submitterNote && (
        <p className="text-sm text-muted">
          <span className="font-medium">Justificativa:</span> {suggestion.submitterNote}
        </p>
      )}
      {(suggestion.submitterName || suggestion.submitterEmail) && (
        <p className="text-xs text-muted">
          Enviado por: {suggestion.submitterName ?? "—"}{" "}
          {suggestion.submitterEmail ? `(${suggestion.submitterEmail})` : ""}
        </p>
      )}
    </div>
  );
}
