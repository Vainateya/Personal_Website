"use client";

import type { LinkListData } from "@/types/blocks";

type LinkListFormProps = {
  data: LinkListData;
  onChange: (data: LinkListData) => void;
};

export function LinkListForm({ data, onChange }: LinkListFormProps) {
  const items = data.items ?? [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-sans text-[10px] uppercase tracking-label text-stone">Links</p>
        <button
          type="button"
          onClick={() => onChange({ items: [...items, { icon: "", label: "", url: "" }] })}
          className="px-3 py-2 font-sans text-[10px] uppercase tracking-label text-warm-grey hover:bg-mist"
        >
          + Add
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="grid gap-2 md:grid-cols-[80px_1fr_1fr_auto]">
          <input
            placeholder="Icon"
            value={item.icon}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...item, icon: e.target.value };
              onChange({ items: next });
            }}
          />
          <input
            placeholder="Label"
            value={item.label}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...item, label: e.target.value };
              onChange({ items: next });
            }}
          />
          <input
            placeholder="https://..."
            value={item.url}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...item, url: e.target.value };
              onChange({ items: next });
            }}
          />
          <button
            type="button"
            onClick={() => onChange({ items: items.filter((_, li) => li !== i) })}
            className="px-3 py-2 font-sans text-[10px] text-[#8b3a2e] hover:bg-mist"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
