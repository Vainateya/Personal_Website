"use client";

import type { MediaData } from "@/types/blocks";

type MediaFormProps = {
  data: MediaData;
  onChange: (data: MediaData) => void;
};

export function MediaForm({ data, onChange }: MediaFormProps) {
  return (
    <div className="space-y-4">
      <label className="block space-y-1.5">
        <span className="font-sans text-[10px] uppercase tracking-label text-stone">Type</span>
        <select
          value={data.type}
          onChange={(e) => onChange({ ...data, type: e.target.value as MediaData["type"] })}
        >
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
      </label>
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
