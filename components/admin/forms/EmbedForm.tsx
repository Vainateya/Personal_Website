"use client";

import type { EmbedData } from "@/types/blocks";

type EmbedFormProps = {
  data: EmbedData;
  onChange: (data: EmbedData) => void;
};

export function EmbedForm({ data, onChange }: EmbedFormProps) {
  return (
    <div className="space-y-4">
      <label className="block space-y-1.5">
        <span className="font-sans text-[10px] uppercase tracking-label text-stone">URL</span>
        <input
          value={data.url}
          placeholder="https://..."
          onChange={(e) => onChange({ ...data, url: e.target.value })}
        />
      </label>
      <label className="block space-y-1.5">
        <span className="font-sans text-[10px] uppercase tracking-label text-stone">Caption</span>
        <input
          value={data.caption}
          onChange={(e) => onChange({ ...data, caption: e.target.value })}
        />
      </label>
    </div>
  );
}
