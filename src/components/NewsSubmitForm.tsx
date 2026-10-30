"use client";

import { useActionState } from "react";
import { submitNews } from "@/app/actions/news";
import { INITIAL_FORM_STATE } from "@/lib/formState";
import { CATEGORY_ORDER, categoryLabel } from "@/lib/category";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FieldError } from "@/components/ui/FieldError";
import { FormAlert } from "@/components/ui/FormAlert";
import { UrlListField } from "@/components/ui/UrlListField";
import { PhotoField } from "@/components/ui/PhotoField";
import { IndigenousCheckbox } from "@/components/ui/IndigenousCheckbox";

const inputClass =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground";

export function NewsSubmitForm() {
  const [state, formAction] = useActionState(submitNews, INITIAL_FORM_STATE);
  const values = state.values;

  return (
    // Remounted (via key) on every failed attempt so the uncontrolled fields
    // below pick up `values` as their new defaultValue — otherwise the
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
          defaultValue={values?.category ?? ""}
          className={inputClass}
        >
          <option value="" disabled>
            Selecione...
          </option>
          {CATEGORY_ORDER.map((category) => (
            <option key={category} value={category}>
              {categoryLabel(category)}
            </option>
          ))}
        </select>
        <FieldError messages={state.fieldErrors?.category} />
      </div>

      <IndigenousCheckbox defaultChecked={values?.isIndigenous} />

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
          defaultValue={values?.title ?? ""}
          className={inputClass}
        />
        <FieldError messages={state.fieldErrors?.title} />
      </div>

      <div>
        <label htmlFor="incidentDate" className="mb-1 block text-sm font-medium">
          Data do ocorrido (opcional)
        </label>
        <input
          id="incidentDate"
          name="incidentDate"
          type="date"
          defaultValue={values?.incidentDate ?? ""}
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
          defaultValue={values?.text ?? ""}
          className={inputClass}
        />
        <FieldError messages={state.fieldErrors?.text} />
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium">Foto</span>
        <PhotoField required />
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium">Links de fontes</span>
        <UrlListField
          name="sources"
          defaultValues={values?.sources}
          requireFirst
          addLabel="+ Adicionar outro link de fonte"
        />
        <FieldError messages={state.fieldErrors?.sources} />
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium">
          Links de redes sociais (opcional)
        </span>
        <p className="mb-2 text-xs text-muted">
          Facebook, Instagram, YouTube, X/Twitter, TikTok etc. Esses links aparecem
          como ícones direto na listagem de notícias.
        </p>
        <UrlListField
          name="socialLinks"
          defaultValues={values?.socialLinks}
          addLabel="+ Adicionar link de rede social"
        />
        <FieldError messages={state.fieldErrors?.socialLinks} />
      </div>

      <div>
        <label htmlFor="donationLink" className="mb-1 block text-sm font-medium">
          Link de doação (opcional)
        </label>
        <input
          id="donationLink"
          name="donationLink"
          type="url"
          placeholder="https://..."
          defaultValue={values?.donationLink ?? ""}
          className={inputClass}
        />
        <FieldError messages={state.fieldErrors?.donationLink} />
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
            defaultValue={values?.submitterName ?? ""}
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
            defaultValue={values?.submitterEmail ?? ""}
            className={inputClass}
          />
          <FieldError messages={state.fieldErrors?.submitterEmail} />
        </div>
      </fieldset>

      <SubmitButton>Enviar para revisão</SubmitButton>
    </form>
  );
}
