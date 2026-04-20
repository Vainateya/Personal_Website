"use client";

import { useState, useEffect } from "react";
import {
  AlignLeft,
  LayoutGrid,
  List,
  Image,
  Code2,
  ClipboardList,
  Clock
} from "lucide-react";
import type {
  BlockRecord,
  BlockData,
  BlockType,
  CardListData,
  RichTextData,
  LinkListData,
  MediaData,
  EmbedData,
  FormData,
  TimelineData
} from "@/types/blocks";
import { blockTypeLabels, blockTypes } from "@/types/blocks";
import { CardListForm } from "@/components/admin/forms/CardListForm";
import { RichTextForm } from "@/components/admin/forms/RichTextForm";
import { LinkListForm } from "@/components/admin/forms/LinkListForm";
import { MediaForm } from "@/components/admin/forms/MediaForm";
import { EmbedForm } from "@/components/admin/forms/EmbedForm";
import { FormEditorForm } from "@/components/admin/forms/FormEditorForm";
import { TimelineForm } from "@/components/admin/forms/TimelineForm";

// ── Block catalog metadata ─────────────────────────────────

const blockTypeIcons: Record<BlockType, React.ReactNode> = {
  card_list: <LayoutGrid size={18} strokeWidth={1.5} />,
  richtext:  <AlignLeft   size={18} strokeWidth={1.5} />,
  linklist:  <List         size={18} strokeWidth={1.5} />,
  media:     <Image        size={18} strokeWidth={1.5} />,
  embed:     <Code2        size={18} strokeWidth={1.5} />,
  form:      <ClipboardList size={18} strokeWidth={1.5} />,
  timeline:  <Clock        size={18} strokeWidth={1.5} />
};

const blockTypeDescriptions: Record<BlockType, string> = {
  card_list: "Grid of cards with image, title, tags & links",
  richtext:  "Formatted text with headings & lists",
  linklist:  "Clean list of links with icons",
  media:     "Image or video with caption",
  embed:     "Embed any URL (YouTube, maps, etc.)",
  form:      "Contact, feedback or book-rec form",
  timeline:  "Chronological entries with year & role"
};

// ── Component ──────────────────────────────────────────────

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

  // ── Catalog mode (no block selected) ──────────────────────
  if (!block || !draft) {
    return (
      <div className="flex h-full flex-col border-l border-border bg-admin-ivory overflow-hidden">
        {/* Header */}
        <div className="border-b border-border px-5 py-4 shrink-0">
          <p className="font-sans text-[10px] uppercase tracking-label text-stone">Blocks</p>
          <p className="mt-0.5 font-sans text-[10px] text-warm-grey">
            Drag a block onto the canvas
          </p>
        </div>

        {/* Catalog list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {blockTypes.map((type) => (
            <div
              key={type}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", type);
                e.dataTransfer.effectAllowed = "copy";
              }}
              className="flex items-start gap-3 px-3 py-3 border border-border bg-ivory rounded-sm cursor-grab hover:border-prussian/30 hover:bg-mist transition-colors active:cursor-grabbing select-none"
            >
              <span className="text-stone mt-0.5 shrink-0">{blockTypeIcons[type]}</span>
              <div className="min-w-0">
                <p className="font-sans text-[11px] font-medium text-ink">
                  {blockTypeLabels[type]}
                </p>
                <p className="font-sans text-[10px] text-warm-grey leading-snug mt-0.5">
                  {blockTypeDescriptions[type]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Editor mode (block selected) ──────────────────────────
  const data = draft.data;

  return (
    <div className="flex h-full flex-col border-l border-border bg-ivory overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4 shrink-0">
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

      {/* Form — scrollable middle */}
      <div className="flex-1 overflow-y-auto p-5 min-h-0">
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

      {/* Footer — always visible */}
      <div className="border-t border-border px-5 py-4 shrink-0">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-prussian py-2 font-sans text-[10px] uppercase tracking-label text-ivory disabled:opacity-60 hover:bg-prussian/90 transition-colors"
        >
          {isSaving ? "Saving…" : saved ? "Saved ✓" : "Save block"}
        </button>
      </div>
    </div>
  );
}
