"use client";

import type { TimelineData } from "@/types/blocks";

type TimelineFormProps = {
  data: TimelineData;
  onChange: (data: TimelineData) => void;
};

export function TimelineForm({ data, onChange }: TimelineFormProps) {
  const entries = data.entries ?? [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-sans text-[10px] uppercase tracking-label text-stone">Entries</p>
        <button
          type="button"
          onClick={() =>
            onChange({
              entries: [
                ...entries,
                { year: "", title: "", institution: "", description: "" }
              ]
            })
          }
          className="px-3 py-2 font-sans text-[10px] uppercase tracking-label text-warm-grey hover:bg-mist"
        >
          + Add entry
        </button>
      </div>
      {entries.map((entry, i) => (
        <div key={i} className="space-y-2 border border-border p-4">
          <div className="grid gap-2 md:grid-cols-2">
            <input
              placeholder="Year"
              value={entry.year}
              onChange={(e) => {
                const next = [...entries];
                next[i] = { ...entry, year: e.target.value };
                onChange({ entries: next });
              }}
            />
            <input
              placeholder="Institution"
              value={entry.institution}
              onChange={(e) => {
                const next = [...entries];
                next[i] = { ...entry, institution: e.target.value };
                onChange({ entries: next });
              }}
            />
          </div>
          <input
            placeholder="Title"
            value={entry.title}
            onChange={(e) => {
              const next = [...entries];
              next[i] = { ...entry, title: e.target.value };
              onChange({ entries: next });
            }}
          />
          <textarea
            placeholder="Description"
            value={entry.description}
            onChange={(e) => {
              const next = [...entries];
              next[i] = { ...entry, description: e.target.value };
              onChange({ entries: next });
            }}
          />
          <button
            type="button"
            onClick={() => onChange({ entries: entries.filter((_, ei) => ei !== i) })}
            className="px-2 py-1 font-sans text-[10px] text-[#8b3a2e] hover:bg-mist"
          >
            Remove entry
          </button>
        </div>
      ))}
    </div>
  );
}
