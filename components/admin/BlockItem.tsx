"use client";

import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import type { BlockRecord } from "@/types/blocks";

type BlockItemProps = {
  block: BlockRecord;
  onEdit: () => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
};

export function BlockItem({
  block,
  onEdit,
  onDelete,
  onToggleVisibility,
  dragHandleProps
}: BlockItemProps) {
  return (
    <div
      className={`border border-border bg-ivory ${
        block.is_public ? "border-l-prussian" : "border-l-stone"
      } border-l p-4`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              aria-label="Drag block"
              className="border-0 px-0 py-0 font-sans text-[10px] uppercase tracking-label text-stone"
              {...dragHandleProps}
            >
              Move
            </button>
            <span className="font-sans text-[10px] uppercase tracking-label text-stone">
              {block.section}
            </span>
            <span className="rounded-editorial border border-border px-2 py-1 font-sans text-[10px] uppercase tracking-label text-warm-grey">
              {block.type}
            </span>
          </div>
          <p className="font-serif text-[22px] font-normal tracking-editorial text-ink">
            {"title" in block.data && typeof block.data.title === "string"
              ? block.data.title || "Untitled block"
              : `${block.type} block`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onToggleVisibility}
            className={`flex items-center gap-2 border px-3 py-2 font-sans text-[10px] uppercase tracking-label ${
              block.is_public
                ? "border-prussian bg-prussian text-ivory"
                : "border-warm-grey bg-warm-grey text-ivory"
            }`}
          >
            {block.is_public ? "Public" : "Draft"}
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="px-3 py-2 font-sans text-[10px] uppercase tracking-label text-warm-grey hover:bg-mist"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="px-3 py-2 font-sans text-[10px] uppercase tracking-label text-[#8b3a2e] hover:bg-mist"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
