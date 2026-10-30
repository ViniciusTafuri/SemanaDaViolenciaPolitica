"use client";

import { useActionState } from "react";
import { submitEditSuggestion } from "@/app/actions/news";
import { INITIAL_FORM_STATE } from "@/lib/formState";
import { CATEGORY_ORDER, categoryLabel } from "@/lib/category";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FieldError } from "@/components/ui/FieldError";
import { FormAlert } from "@/components/ui/FormAlert";
import { UrlListField } from "@/components/ui/UrlListField";
import { PhotoField } from "@/components/ui/PhotoField";
import { IndigenousCheckbox } from "@/components/ui/IndigenousCheckbox";
import type { Category } from "@/generated/prisma/client";

const inputClass =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground";

export interface EditSuggestionDefaults {
  category: Category;
  isIndigenous: boolean;
  title: string;
  text: string;
  incidentDate: string;
  sources: string[];
  socialLinks: string[];
  donationLink: string;
  photoUrl: string;
}

export function EditSuggestionForm({
  newsId,
  defaults,
}: {
  newsId: string;
  defaults: EditSuggestionDefaults;
}) {
  const action = submitEditSuggestion.bind(null, newsId);
  const [state, formAction] = useActionState(action, INITIAL_FORM_STATE);

  // On a failed attempt, re-show what the user actually typed
  // (state.values) instead of the notícia's original values.
  const effective = {
    category: state.values?.category ?? defaults.category,
    isIndigenous: state.values?.isIndigenous ?? defaults.isIndigenous,
    title: state.values?.title ?? defaults.title,
    text: state.values?.text ?? defaults.text,
    incidentDate: state.values?.incidentDate ?? defaults.incidentDate,
    sources: state.values?.sources ?? defaults.sources,
    socialLinks: state.values?.socialLinks ?? defaults.socialLinks,
    donationLink: state.values?.donationLink ?? defaults.donationLink,
    submitterNote: state.values?.submitterNote ?? "",
    submitterName: state.values?.submitterName ?? "",
    submitterEmail: state.values?.submitterEmail ?? "",
  };

  return (
    // Remounted (via key) on every failed attempt so the uncontrolled fields
    // below pick up `effective` as their new defaultValue — otherwise the
    // browser clears the whole form after any form action submission.
    <form key={state.attempt ?? "initial"} action={formAction} className="space-y-6">
      <FormAlert message={state.error} />

      <div>
        <label htmlFor="category" className="mb-1 block text-sm font-medium">
          Categoria
        </label>
        <select
          id="category"
          name="category"
          required
          defaultValue={effective.category}
          className={inputClass}
        >
          {CATEGORY_ORDER.map((category) => (
            <option key={category} value={category}>
              {categoryLabel(category)}
            </option>
          ))}
        </select>
        <FieldError messages={state.fieldErrors?.category} />
      </div>

      <IndigenousCheckbox defaultChecked={effective.isIndigenous} />

      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">
          Título
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={200}
          defaultValue={effective.title}
          className={inputClass}
        />
        <FieldError messages={state.fieldErrors?.title} />
      </div>

      <div>
        <label htmlFor="incidentDate" className="mb-1 block text-sm font-medium">
          Data do ocorrido
        </label>
        <input
          id="incidentDate"
          name="incidentDate"
          type="date"
          defaultValue={effective.incidentDate}
          className={inputClass}
        />
        <FieldError messages={state.fieldErrors?.incidentDate} />
      </div>

      <div>
        <label htmlFor="text" className="mb-1 block text-sm font-medium">
          Descrição
        </label>
        <textarea
          id="text"
          name="text"
          required
          rows={6}
          maxLength={5000}
          defaultValue={effective.text}
          className={inputClass}
        />
        <FieldError messages={state.fieldErrors?.text} />
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium">Foto</span>
        <PhotoField required={false} currentPhotoUrl={defaults.photoUrl} />
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium">Links de fontes</span>
        <UrlListField
          name="sources"
          defaultValues={effective.sources}
          requireFirst
          addLabel="+ Adicionar outro link de fonte"
        />
        <FieldError messages={state.fieldErrors?.sources} />
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium">
          Links de redes sociais (opcional)
        </span>
        <UrlListField
          name="socialLinks"
          defaultValues={effective.socialLinks}
          addLabel="+ Adicionar link de rede social"
        />
        <FieldError messages={state.fieldErrors?.socialLinks} />
      </div>

      <div>
        <label htmlFor="donationLink" className="mb-1 block text-sm font-medium">
          Link de doação
        </label>
        <input
          id="donationLink"
          name="donationLink"
          type="url"
          defaultValue={effective.donationLink}
          placeholder="https://..."
          className={inputClass}
        />
        <FieldError messages={state.fieldErrors?.donationLink} />
      </div>

      <div>
        <label htmlFor="submitterNote" className="mb-1 block text-sm font-medium">
          Por que você sugere esta edição? (opcional)
        </label>
        <textarea
          id="submitterNote"
          name="submitterNote"
          rows={3}
          maxLength={1000}
          defaultValue={effective.submitterNote}
          className={inputClass}
        />
      </div>

      <fieldset className="space-y-4 border-t border-border pt-4">
        <legend className="mb-2 text-sm font-medium">Seu contato (opcional)</legend>
        <div>
          <label htmlFor="submitterName" className="mb-1 block text-sm font-medium">
            Nome
          </label>
          <input
            id="submitterName"
            name="submitterName"
            type="text"
            maxLength={100}
            defaultValue={effective.submitterName}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="submitterEmail" className="mb-1 block text-sm font-medium">
            E-mail
          </label>
          <input
            id="submitterEmail"
            name="submitterEmail"
            type="email"
            defaultValue={effective.submitterEmail}
            className={inputClass}
          />
          <FieldError messages={state.fieldErrors?.submitterEmail} />
        </div>
      </fieldset>

      <SubmitButton>Enviar sugestão de edição</SubmitButton>
    </form>
  );
}
