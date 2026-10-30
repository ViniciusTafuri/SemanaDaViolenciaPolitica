export function FormAlert({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      className="rounded-md border px-3 py-2 text-sm"
      style={{
        borderColor: "var(--accent)",
        color: "var(--accent)",
        backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)",
      }}
    >
      {message}
    </p>
  );
}
