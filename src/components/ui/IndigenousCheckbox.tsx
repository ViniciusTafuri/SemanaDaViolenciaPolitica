export function IndigenousCheckbox({ defaultChecked }: { defaultChecked?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <input
        id="isIndigenous"
        name="isIndigenous"
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-border"
      />
      <label htmlFor="isIndigenous" className="text-sm font-medium">
        Esta notícia é sobre Povos Indígenas
      </label>
    </div>
  );
}
