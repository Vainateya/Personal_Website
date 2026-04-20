"use client";

import type { FormData } from "@/types/blocks";

type FormEditorFormProps = {
  data: FormData;
  onChange: (data: FormData) => void;
};

export function FormEditorForm({ data, onChange }: FormEditorFormProps) {
  const fields = data.fields ?? [];

  return (
    <div className="space-y-4">
      <label className="block space-y-1.5">
        <span className="font-sans text-[10px] uppercase tracking-label text-stone">Form type</span>
        <select
          value={data.form_type}
          onChange={(e) => onChange({ ...data, form_type: e.target.value as FormData["form_type"] })}
        >
          <option value="contact">Contact</option>
          <option value="feedback">Feedback</option>
          <option value="bookrec">Book Recommendation</option>
        </select>
      </label>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-sans text-[10px] uppercase tracking-label text-stone">Fields</p>
          <button
            type="button"
            onClick={() =>
              onChange({
                ...data,
                fields: [...fields, { name: "", type: "text", placeholder: "", required: false }]
              })
            }
            className="px-3 py-2 font-sans text-[10px] uppercase tracking-label text-warm-grey hover:bg-mist"
          >
            + Add field
          </button>
        </div>
        {fields.map((field, i) => (
          <div key={i} className="space-y-2 border border-border p-3">
            <div className="grid gap-2 md:grid-cols-2">
              <input
                placeholder="Field name"
                value={field.name}
                onChange={(e) => {
                  const next = [...fields];
                  next[i] = { ...field, name: e.target.value };
                  onChange({ ...data, fields: next });
                }}
              />
              <select
                value={field.type}
                onChange={(e) => {
                  const next = [...fields];
                  next[i] = { ...field, type: e.target.value };
                  onChange({ ...data, fields: next });
                }}
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="textarea">Textarea</option>
                <option value="url">URL</option>
              </select>
            </div>
            <input
              placeholder="Placeholder text"
              value={field.placeholder}
              onChange={(e) => {
                const next = [...fields];
                next[i] = { ...field, placeholder: e.target.value };
                onChange({ ...data, fields: next });
              }}
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-label text-warm-grey">
                <input
                  type="checkbox"
                  checked={field.required}
                  className="h-3 w-3"
                  onChange={(e) => {
                    const next = [...fields];
                    next[i] = { ...field, required: e.target.checked };
                    onChange({ ...data, fields: next });
                  }}
                />
                Required
              </label>
              <button
                type="button"
                onClick={() => onChange({ ...data, fields: fields.filter((_, fi) => fi !== i) })}
                className="px-2 py-1 font-sans text-[10px] text-[#8b3a2e] hover:bg-mist"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
