"use client";

import { useState } from "react";

export function PhotoField({
  required = true,
  currentPhotoUrl,
}: {
  required?: boolean;
  currentPhotoUrl?: string;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {currentPhotoUrl && !preview && (
        <div>
          <p className="mb-1 text-xs text-muted">
            Foto atual (deixe em branco para manter):
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentPhotoUrl}
            alt="Foto atual"
            className="h-28 w-auto rounded-md border border-border object-cover"
          />
        </div>
      )}
      <input
        type="file"
        name="photo"
        accept="image/jpeg,image/png,image/webp,image/gif"
        required={required}
        onChange={(event) => {
          const file = event.target.files?.[0];
          setPreview(file ? URL.createObjectURL(file) : null);
        }}
        className="block w-full text-sm"
      />
      <p className="text-xs text-muted">
        Se o formulário precisar ser reenviado por causa de outro erro, este campo é limpo e a
        foto precisa ser selecionada de novo.
      </p>
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt="Pré-visualização"
          className="h-28 w-auto rounded-md border border-border object-cover"
        />
      )}
    </div>
  );
}
