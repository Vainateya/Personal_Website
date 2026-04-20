"use client";

import { useState, useEffect } from "react";
import type {
  BlockRecord,
  BlockData,
  CardListData,
  RichTextData,
  LinkListData,
  MediaData,
  EmbedData,
  FormData,
  TimelineData
} from "@/types/blocks";
import { blockTypeLabels } from "@/types/blocks";
import { CardListForm } from "@/components/admin/forms/CardListForm";
import { RichTextForm } from "@/components/admin/forms/RichTextForm";
import { LinkListForm } from "@/components/admin/forms/LinkListForm";
import { MediaForm } from "@/components/admin/forms/MediaForm";
import { EmbedForm } from "@/components/admin/forms/EmbedForm";
import { FormEditorForm } from "@/components/admin/forms/FormEditorForm";
import { TimelineForm } from "@/components/admin/forms/TimelineForm";

type BlockPanelProps = {
  block: BlockRecord | null;
  onClose: () => void;
  onSave: (block: BlockRecord) => Promise<void>;
};

export function BlockPanel({ block, onClose, onSave }: BlockPanelProps) {
  const [draft, setDraft] = useState<BlockRecord | null>(block);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(block);
    setSaved(false);
  }, [block]);

  if (!block || !draft) {
    return (
      <div className="flex h-full items-center justify-center border-l border-border p-8">
        <p className="font-sans text-[11px] text-warm-grey">
          Click a block on the canvas to edit it.
        </p>
      </div>
    );
  }

  function updateData(nextData: BlockData) {
    setDraft((d) => (d ? { ...d, data: nextData } : d));
    setSaved(false);
  }

  async function handleSave() {
    if (!draft) return;
    setIsSaving(true);
    await onSave(draft);
    setIsSaving(false);
    setSaved(true);
  }

  const data = draft.data;

  return (
    <div className="flex h-full flex-col border-l border-border bg-ivory">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="space-y-0.5">
          <p className="font-sans text-[10px] uppercase tracking-label text-stone">
            {blockTypeLabels[draft.type]}
          </p>
          <p className="font-sans text-[11px] text-warm-grey">
            col {draft.x + 1}, row {draft.y + 1} — {draft.w}w × {draft.h}h
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-2 font-sans text-[10px] uppercase tracking-label text-warm-grey hover:bg-mist"
        >
          Close
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-5">
        {draft.type === "card_list" && (
          <CardListForm data={data as CardListData} onChange={updateData} />
        )}
        {draft.type === "richtext" && (
          <RichTextForm data={data as RichTextData} onChange={updateData} />
        )}
        {draft.type === "linklist" && (
          <LinkListForm data={data as LinkListData} onChange={updateData} />
        )}
        {draft.type === "media" && (
          <MediaForm data={data as MediaData} onChange={updateData} />
        )}
        {draft.type === "embed" && (
          <EmbedForm data={data as EmbedData} onChange={updateData} />
        )}
        {draft.type === "form" && (
          <FormEditorForm data={data as FormData} onChange={updateData} />
        )}
        {draft.type === "timeline" && (
          <TimelineForm data={data as TimelineData} onChange={updateData} />
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border px-5 py-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-prussian py-2 font-sans text-[10px] uppercase tracking-label text-ivory disabled:opacity-60"
        >
          {isSaving ? "Saving…" : saved ? "Saved ✓" : "Save block"}
        </button>
      </div>
    </div>
  );
}
