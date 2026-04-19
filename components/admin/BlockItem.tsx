"use client";

import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import type { BlockRecord } from "@/types/blocks";
import { BlockForm } from "@/components/admin/BlockForm";

type BlockItemProps = {
  block: BlockRecord;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: (block: BlockRecord) => Promise<void>;
  onDelete: () => void;
  onToggleVisibility: () => void;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
};

function getBlockTitle(block: BlockRecord): string {
  const d = block.data as Record<string, unknown>;
  if (typeof d.title === "string" && d.title) return d.title;
  return `${block.type} block`;
}

export function BlockItem({
  block,
  isEditing,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
  onToggleVisibility,
  dragHandleProps
}: BlockItemProps) {
  const title = getBlockTitle(block);

  return (
    <div
      className={`border border-border bg-ivory transition-colors ${
        isEditing ? "border-prussian/30" : ""
      }`}
    >
      {/* Block header row */}
      <div className="flex items-start gap-3 p-4">
        {/* Drag handle */}
        <button
          type="button"
          aria-label="Drag to reorder"
          className="mt-0.5 flex-shrink-0 cursor-grab border-0 px-0 py-0 text-stone active:cursor-grabbing"
          {...dragHandleProps}
        >
          <svg
            width="12"
            height="16"
            viewBox="0 0 12 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <rect x="0" y="1" width="4" height="2" rx="1" />
            <rect x="0" y="5" width="4" height="2" rx="1" />
            <rect x="0" y="9" width="4" height="2" rx="1" />
            <rect x="0" y="13" width="4" height="2" rx="1" />
            <rect x="8" y="1" width="4" height="2" rx="1" />
            <rect x="8" y="5" width="4" height="2" rx="1" />
            <rect x="8" y="9" width="4" height="2" rx="1" />
            <rect x="8" y="13" width="4" height="2" rx="1" />
          </svg>
        </button>

        {/* Content */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-sans text-[10px] uppercase tracking-label text-stone">
              {block.section}
            </span>
            <span className="rounded-[3px] bg-mist px-1.5 py-0.5 font-sans text-[9px] uppercase tracking-label text-warm-grey">
              {block.type}
            </span>
            {!block.is_public && (
              <span className="rounded-[3px] bg-stone/20 px-1.5 py-0.5 font-sans text-[9px] uppercase tracking-label text-warm-grey">
                Draft
              </span>
            )}
          </div>
          <p className="truncate font-serif text-[18px] font-normal tracking-editorial text-ink">
            {title}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleVisibility}
            title={block.is_public ? "Published — click to draft" : "Draft — click to publish"}
            className={`h-5 w-5 transition-colors ${
              block.is_public ? "text-prussian" : "text-stone"
            }`}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              {block.is_public ? (
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z M2 10c1.5-4.5 5-7 8-7s6.5 2.5 8 7c-1.5 4.5-5 7-8 7s-6.5-2.5-8-7z" />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z"
                  clipRule="evenodd"
                />
              )}
            </svg>
          </button>
          <button
            type="button"
            onClick={isEditing ? onCancelEdit : onEdit}
            className={`px-2 py-1 font-sans text-[10px] uppercase tracking-label transition-colors ${
              isEditing
                ? "bg-prussian text-ivory"
                : "text-warm-grey hover:bg-mist"
            }`}
          >
            {isEditing ? "Close" : "Edit"}
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="px-2 py-1 font-sans text-[10px] uppercase tracking-label text-[#8b3a2e] hover:bg-mist"
          >
            Del
          </button>
        </div>
      </div>

      {/* Inline edit form — expands in place */}
      {isEditing && (
        <div className="border-t border-border/60">
          <BlockForm
            block={block}
            inline
            onCancel={onCancelEdit}
            onSave={onSave}
          />
        </div>
      )}
    </div>
  );
}
