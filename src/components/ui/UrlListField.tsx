"use client";

import { useState } from "react";

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return idCounter;
}

export function UrlListField({
  name,
  defaultValues,
  requireFirst = false,
  addLabel = "+ Adicionar outro link",
  placeholder = "https://...",
}: {
  name: string;
  defaultValues?: string[];
  requireFirst?: boolean;
  addLabel?: string;
  placeholder?: string;
}) {
  const initialValues = defaultValues && defaultValues.length > 0 ? defaultValues : [""];
  const [fields, setFields] = useState(
    initialValues.map((value) => ({ id: nextId(), value }))
  );

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2">
          <input
            type="url"
            name={name}
            defaultValue={field.value}
            required={requireFirst && index === 0}
            placeholder={placeholder}
            className="flex-1 rounded-md border border-border bg-surface px-3 py-2"
          />
          {fields.length > 1 && (
            <button
              type="button"
              onClick={() =>
                setFields((prev) => prev.filter((f) => f.id !== field.id))
              }
              aria-label="Remover link"
              className="rounded-md border border-border px-3 text-sm text-muted hover:bg-black/5"
            >
              ✕
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => setFields((prev) => [...prev, { id: nextId(), value: "" }])}
        className="text-sm font-medium text-accent hover:underline"
      >
        {addLabel}
      </button>
    </div>
  );
}
