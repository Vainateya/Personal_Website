"use client";

import type { RichTextData } from "@/types/blocks";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

type RichTextFormProps = {
  data: RichTextData;
  onChange: (data: RichTextData) => void;
};

export function RichTextForm({ data, onChange }: RichTextFormProps) {
  return (
    <div className="space-y-2">
      <p className="font-sans text-[10px] uppercase tracking-label text-stone">Content</p>
      <RichTextEditor
        value={data.content}
        onChange={(content) => onChange({ content })}
      />
    </div>
  );
}
