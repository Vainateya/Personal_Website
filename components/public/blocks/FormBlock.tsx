"use client";

import { useState } from "react";
import type { FormData } from "@/types/blocks";

type FormBlockProps = {
  blockId: string;
  data: FormData;
};

const formTitles: Record<FormData["form_type"], string> = {
  contact:  "Get in Touch",
  feedback: "Anonymous Feedback",
  bookrec:  "Recommend a Book"
};

export function FormBlock({ blockId, data }: FormBlockProps) {
  const fields = data.fields ?? [];
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ block_id: blockId, data: values })
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("done");
      setValues({});
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="border border-border p-5">
        <p className="font-sans text-[13px] text-ink">
          Thank you — your submission was received.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="font-sans text-[10px] uppercase tracking-label text-stone">
        {formTitles[data.form_type]}
      </p>
      {fields.map((field) => (
        <label key={field.name} className="block space-y-1.5">
          <span className="font-sans text-[10px] uppercase tracking-label text-warm-grey">
            {field.name}{field.required ? " *" : ""}
          </span>
          {field.type === "textarea" ? (
            <textarea
              required={field.required}
              placeholder={field.placeholder}
              value={values[field.name] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
            />
          ) : (
            <input
              type={field.type}
              required={field.required}
              placeholder={field.placeholder}
              value={values[field.name] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
            />
          )}
        </label>
      ))}
      {status === "error" ? (
        <p className="font-sans text-[11px] text-[#8b3a2e]">Something went wrong — please try again.</p>
      ) : null}
      <button
        type="submit"
        disabled={status === "sending"}
        className="border-prussian bg-prussian px-4 py-2 font-sans text-[10px] uppercase tracking-label text-ivory disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
