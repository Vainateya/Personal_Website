"use client";

import { useState } from "react";
import type { CardListData, CardItem } from "@/types/blocks";
import { emptyCardItem } from "@/types/blocks";

type CardListFormProps = {
  data: CardListData;
  onChange: (data: CardListData) => void;
};

function CardEditor({
  card,
  onUpdate,
  onDelete
}: {
  card: CardItem;
  onUpdate: (c: CardItem) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(true);
  const links = card.links ?? [];

  return (
    <div className="border border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex-1 text-left font-serif text-[16px] font-normal tracking-editorial text-ink"
        >
          {card.title || "Untitled card"} {open ? "▲" : "▼"}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="px-2 py-1 font-sans text-[10px] uppercase tracking-label text-[#8b3a2e] hover:bg-mist"
        >
          Remove
        </button>
      </div>
      {open && (
        <div className="space-y-3 border-t border-border p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Title" value={card.title} onChange={(v) => onUpdate({ ...card, title: v })} />
            <Field label="Institution" value={card.institution} onChange={(v) => onUpdate({ ...card, institution: v })} />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Year" value={card.year} onChange={(v) => onUpdate({ ...card, year: v })} />
            <Field label="Thumbnail URL" value={card.thumbnail_url} onChange={(v) => onUpdate({ ...card, thumbnail_url: v })} />
          </div>
          <label className="block space-y-1.5">
            <span className="font-sans text-[10px] uppercase tracking-label text-stone">Description</span>
            <textarea
              className="h-20 w-full"
              value={card.description}
              onChange={(e) => onUpdate({ ...card, description: e.target.value })}
            />
          </label>
          <Field
            label="Tags (comma-separated)"
            value={card.tags?.join(", ") ?? ""}
            onChange={(v) =>
              onUpdate({
                ...card,
                tags: v.split(",").map((t) => t.trim()).filter(Boolean)
              })
            }
          />
          {/* Links */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-sans text-[10px] uppercase tracking-label text-stone">Links</span>
              <button
                type="button"
                onClick={() => onUpdate({ ...card, links: [...links, { label: "", url: "" }] })}
                className="px-2 py-1 font-sans text-[10px] uppercase tracking-label text-warm-grey hover:bg-mist"
              >
                + Add
              </button>
            </div>
            {links.map((link, i) => (
              <div key={i} className="grid gap-2 grid-cols-[1fr_1fr_auto]">
                <input
                  placeholder="Label"
                  value={link.label}
                  onChange={(e) => {
                    const next = [...links];
                    next[i] = { ...link, label: e.target.value };
                    onUpdate({ ...card, links: next });
                  }}
                />
                <input
                  placeholder="https://..."
                  value={link.url}
                  onChange={(e) => {
                    const next = [...links];
                    next[i] = { ...link, url: e.target.value };
                    onUpdate({ ...card, links: next });
                  }}
                />
                <button
                  type="button"
                  onClick={() => onUpdate({ ...card, links: links.filter((_, li) => li !== i) })}
                  className="px-2 py-1 font-sans text-[10px] text-[#8b3a2e] hover:bg-mist"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block space-y-1.5">
      <span className="font-sans text-[10px] uppercase tracking-label text-stone">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export function CardListForm({ data, onChange }: CardListFormProps) {
  const cards = data.cards ?? [];

  function updateCard(i: number, card: CardItem) {
    const next = [...cards];
    next[i] = card;
    onChange({ cards: next });
  }

  function removeCard(i: number) {
    onChange({ cards: cards.filter((_, ci) => ci !== i) });
  }

  return (
    <div className="space-y-3">
      {cards.map((card, i) => (
        <CardEditor
          key={card.id}
          card={card}
          onUpdate={(c) => updateCard(i, c)}
          onDelete={() => removeCard(i)}
        />
      ))}
      <button
        type="button"
        onClick={() => onChange({ cards: [...cards, emptyCardItem()] })}
        className="w-full border border-dashed border-border py-3 font-sans text-[10px] uppercase tracking-label text-warm-grey hover:bg-mist"
      >
        + Add card
      </button>
    </div>
  );
}
