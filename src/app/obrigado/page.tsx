import Link from "next/link";

export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  const { tipo } = await searchParams;
  const message =
    tipo === "edicao"
      ? "Sua sugestão de edição foi enviada e será avaliada pela administração."
      : "Sua notícia foi enviada e será avaliada pela administração antes de ser publicada.";

  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Obrigado!</h1>
      <p className="text-muted">{message}</p>
      <Link
        href="/"
        className="inline-block rounded-md bg-accent px-4 py-2 font-medium text-white hover:bg-accent-hover"
      >
        Voltar para o site
      </Link>
    </div>
  );
}
