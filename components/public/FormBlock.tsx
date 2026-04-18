"use client";

import { useMemo, useState } from "react";
import type { FormData } from "@/types/blocks";

type FormBlockProps = {
  data: FormData;
};

export function FormBlock({ data }: FormBlockProps) {
  const [formState, setFormState] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">(
    "idle"
  );

  const heading = useMemo(() => {
    switch (data.form_type) {
      case "contact":
        return "Contact";
      case "feedback":
        return "Anonymous Feedback";
      case "bookrec":
        return "Book Recommendation";
    }
  }, [data.form_type]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");

    const response = await fetch("/api/forms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        form_type: data.form_type,
        data: formState
      })
    });

    if (!response.ok) {
      setStatus("error");
      return;
    }

    setStatus("success");
    setFormState({});
    event.currentTarget.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-border p-4">
      <div className="space-y-1">
        <h3 className="font-serif text-[24px] font-normal tracking-editorial text-ink">
          {heading}
        </h3>
        <p className="font-sans text-[11px] text-warm-grey">
          Responses are saved directly to my private dashboard.
        </p>
      </div>
      {data.fields.map((field) => {
        const fieldProps = {
          name: field.name,
          required: field.required,
          placeholder: field.placeholder,
          onChange: (
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => {
            setFormState((current) => ({
              ...current,
              [field.name]: event.target.value
            }));
          }
        };

        return (
          <label key={field.name} className="block space-y-2">
            <span className="font-sans text-[10px] uppercase tracking-label text-stone">
              {field.name}
            </span>
            {field.type === "textarea" ? (
              <textarea {...fieldProps} />
            ) : (
              <input type={field.type} {...fieldProps} />
            )}
          </label>
        );
      })}
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="border-prussian bg-prussian px-4 py-2 font-sans text-[11px] uppercase tracking-label text-ivory"
          disabled={status === "saving"}
        >
          {status === "saving" ? "Sending" : "Submit"}
        </button>
        {status === "success" ? (
          <p className="font-sans text-[11px] text-warm-grey">Received. Thank you.</p>
        ) : null}
        {status === "error" ? (
          <p className="font-sans text-[11px] text-[#8b3a2e]">
            Something went wrong. Please try again.
          </p>
        ) : null}
      </div>
    </form>
  );
}
