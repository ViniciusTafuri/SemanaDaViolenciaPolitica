import Link from "next/link";

export function IndigenousFilterToggle({ active }: { active: boolean }) {
  return (
    <Link
      href={active ? "/" : "/?indigenas=1"}
      className="inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium"
      style={
        active
          ? {
              borderColor: "var(--tag-indigenous)",
              color: "var(--tag-indigenous)",
              backgroundColor: "var(--tag-indigenous-bg)",
            }
          : { borderColor: "var(--border)" }
      }
    >
      {active ? "✕ Mostrar todas as notícias" : "Filtrar: mostrar apenas Povos Indígenas"}
    </Link>
  );
}
