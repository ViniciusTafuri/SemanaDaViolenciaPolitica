import { NewsSubmitForm } from "@/components/NewsSubmitForm";

export default function SubmitNewsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">Enviar notícia</h1>
      <p className="mb-6 text-sm text-muted">
        Sua notícia será revisada pela administração antes de ser publicada no site.
      </p>
      <NewsSubmitForm />
    </div>
  );
}
