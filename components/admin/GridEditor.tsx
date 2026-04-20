"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { BlockRecord, BlockType } from "@/types/blocks";
import { blockTypes, blockTypeLabels } from "@/types/blocks";

const COLS = 12;
const ROW_H = 80; // px per grid row in the editor

type DragState = {
  kind: "move" | "resize";
  blockId: string;
  startMouseX: number;
  startMouseY: number;
  origX: number;
  origY: number;
  origW: number;
  origH: number;
};

type GridEditorProps = {
  blocks: BlockRecord[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
  onAddBlock: (type: BlockType, x: number, y: number) => Promise<void>;
  onUpdateBlock: (id: string, updates: Partial<Pick<BlockRecord, "x" | "y" | "w" | "h">>) => Promise<void>;
  onDeleteBlock: (id: string) => void;
};

function getBlockPreview(block: BlockRecord): string {
  const d = block.data as Record<string, unknown>;
  if (block.type === "richtext") {
    const raw = (d.content as string) ?? "";
    return raw.replace(/<[^>]+>/g, "").slice(0, 80);
  }
  if (block.type === "card_list") {
    const cards = (d.cards as unknown[]) ?? [];
    return `${cards.length} card${cards.length !== 1 ? "s" : ""}`;
  }
  if (block.type === "linklist") {
    const items = (d.items as unknown[]) ?? [];
    return `${items.length} link${items.length !== 1 ? "s" : ""}`;
  }
  if (block.type === "form") return `${d.form_type ?? "form"}`;
  if (block.type === "timeline") {
    const entries = (d.entries as unknown[]) ?? [];
    return `${entries.length} entr${entries.length !== 1 ? "ies" : "y"}`;
  }
  if (block.type === "media" || block.type === "embed") return (d.caption as string) || (d.url as string) || "";
  return "";
}

function BlockTypePicker({
  onSelect,
  onClose
}: {
  onSelect: (type: BlockType) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="z-50 min-w-[180px] border border-border bg-ivory shadow-none"
      style={{ position: "absolute" }}
    >
      <div className="border-b border-border px-3 py-2">
        <p className="font-sans text-[10px] uppercase tracking-label text-stone">Add block</p>
      </div>
      {blockTypes.map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onSelect(type)}
          className="block w-full border-b border-border px-3 py-2.5 text-left font-sans text-[11px] text-warm-grey last:border-b-0 hover:bg-mist"
        >
          {blockTypeLabels[type]}
        </button>
      ))}
      <button
        type="button"
        onClick={onClose}
        className="block w-full px-3 py-2 text-center font-sans text-[10px] uppercase tracking-label text-stone hover:bg-mist"
      >
        Cancel
      </button>
    </div>
  );
}

export function GridEditor({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock
}: GridEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const colWidthRef = useRef(0);

  const [liveBlocks, setLiveBlocks] = useState<BlockRecord[]>(blocks);
  const [blockPicker, setBlockPicker] = useState<{ x: number; y: number } | null>(null);
  const [containerWidth, setContainerWidth] = useState(960);

  // Keep live blocks in sync with prop
  useEffect(() => {
    if (!dragRef.current) {
      setLiveBlocks(blocks);
    }
  }, [blocks]);

  // Measure container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.offsetWidth;
      setContainerWidth(w);
      colWidthRef.current = w / COLS;
    });
    ro.observe(el);
    const w = el.offsetWidth;
    setContainerWidth(w);
    colWidthRef.current = w / COLS;
    return () => ro.disconnect();
  }, []);

  const colWidth = containerWidth / COLS;
  const maxRow = Math.max(8, ...liveBlocks.map((b) => b.y + b.h)) + 4;

  const startDrag = useCallback(
    (kind: DragState["kind"], e: React.MouseEvent, block: BlockRecord) => {
      e.preventDefault();
      e.stopPropagation();

      dragRef.current = {
        kind,
        blockId: block.id,
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        origX: block.x,
        origY: block.y,
        origW: block.w,
        origH: block.h
      };

      function onMouseMove(ev: MouseEvent) {
        const drag = dragRef.current;
        if (!drag) return;
        const cw = colWidthRef.current;
        const dx = Math.round((ev.clientX - drag.startMouseX) / cw);
        const dy = Math.round((ev.clientY - drag.startMouseY) / ROW_H);

        setLiveBlocks((prev) =>
          prev.map((b) => {
            if (b.id !== drag.blockId) return b;
            if (drag.kind === "move") {
              return {
                ...b,
                x: Math.max(0, Math.min(COLS - drag.origW, drag.origX + dx)),
                y: Math.max(0, drag.origY + dy)
              };
            }
            return {
              ...b,
              w: Math.max(1, Math.min(COLS - drag.origX, drag.origW + dx)),
              h: Math.max(1, drag.origH + dy)
            };
          })
        );
      }

      function onMouseUp(ev: MouseEvent) {
        const drag = dragRef.current;
        if (!drag) return;
        dragRef.current = null;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);

        const cw = colWidthRef.current;
        const dx = Math.round((ev.clientX - drag.startMouseX) / cw);
        const dy = Math.round((ev.clientY - drag.startMouseY) / ROW_H);

        if (drag.kind === "move") {
          const newX = Math.max(0, Math.min(COLS - drag.origW, drag.origX + dx));
          const newY = Math.max(0, drag.origY + dy);
          if (newX !== drag.origX || newY !== drag.origY) {
            onUpdateBlock(drag.blockId, { x: newX, y: newY });
          }
        } else {
          const newW = Math.max(1, Math.min(COLS - drag.origX, drag.origW + dx));
          const newH = Math.max(1, drag.origH + dy);
          if (newW !== drag.origW || newH !== drag.origH) {
            onUpdateBlock(drag.blockId, { w: newW, h: newH });
          }
        }
      }

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [onUpdateBlock]
  );

  function handleContainerClick(e: React.MouseEvent) {
    if (e.target !== containerRef.current) return;
    if (dragRef.current) return;
    const rect = containerRef.current!.getBoundingClientRect();
    const x = Math.max(0, Math.min(11, Math.floor((e.clientX - rect.left) / colWidthRef.current)));
    const y = Math.max(0, Math.floor((e.clientY - rect.top) / ROW_H));
    setBlockPicker({ x, y });
  }

  return (
    <div className="relative flex-1 overflow-auto">
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          minHeight: maxRow * ROW_H,
          userSelect: "none",
          cursor: "crosshair"
        }}
        onClick={handleContainerClick}
      >
        {/* Grid overlay — vertical lines */}
        <div
          style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}
        >
          {Array.from({ length: COLS + 1 }).map((_, i) => (
            <div
              key={`v${i}`}
              style={{
                position: "absolute",
                left: `${(i / COLS) * 100}%`,
                top: 0,
                bottom: 0,
                width: 1,
                background: "#B8A99A",
                opacity: 0.3
              }}
            />
          ))}
          {Array.from({ length: maxRow + 1 }).map((_, i) => (
            <div
              key={`h${i}`}
              style={{
                position: "absolute",
                top: i * ROW_H,
                left: 0,
                right: 0,
                height: 1,
                background: "#B8A99A",
                opacity: 0.3
              }}
            />
          ))}
        </div>

        {/* Blocks */}
        {liveBlocks.map((block) => {
          const isSelected = block.id === selectedBlockId;
          return (
            <div
              key={block.id}
              style={{
                position: "absolute",
                left: block.x * colWidth,
                top: block.y * ROW_H,
                width: block.w * colWidth,
                height: block.h * ROW_H,
                zIndex: isSelected ? 10 : 1,
                boxSizing: "border-box",
                padding: 1
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectBlock(block.id);
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  border: isSelected ? "2px solid #1D3557" : "1px solid #E0DDD6",
                  background: isSelected ? "#EBF0F7" : "#F8F5EF",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {/* Drag handle bar */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "4px 8px",
                    borderBottom: "1px solid #E0DDD6",
                    cursor: "move",
                    background: isSelected ? "#D6E4F0" : "#F0EDE6"
                  }}
                  onMouseDown={(e) => startDrag("move", e, block)}
                >
                  <span
                    style={{
                      fontSize: 9,
                      fontFamily: "ui-sans-serif, system-ui, sans-serif",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "#6E6B64"
                    }}
                  >
                    {blockTypeLabels[block.type]}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteBlock(block.id);
                    }}
                    style={{
                      fontSize: 12,
                      color: "#8b3a2e",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      padding: "0 2px",
                      lineHeight: 1
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* Content preview */}
                <div
                  style={{
                    padding: "4px 8px",
                    fontSize: 11,
                    color: "#6E6B64",
                    overflow: "hidden",
                    lineHeight: 1.4,
                    maxHeight: block.h * ROW_H - 30
                  }}
                >
                  {getBlockPreview(block)}
                </div>

                {/* Resize handle — bottom-right corner */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 14,
                    height: 14,
                    cursor: "se-resize",
                    background: "#B8A99A",
                    opacity: 0.6
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    startDrag("resize", e, block);
                  }}
                />
              </div>
            </div>
          );
        })}

        {/* Block type picker */}
        {blockPicker && (
          <div
            style={{
              position: "absolute",
              left: Math.min(blockPicker.x * colWidth, containerWidth - 200),
              top: blockPicker.y * ROW_H,
              zIndex: 50
            }}
          >
            <BlockTypePicker
              onSelect={async (type) => {
                setBlockPicker(null);
                await onAddBlock(type, blockPicker.x, blockPicker.y);
              }}
              onClose={() => setBlockPicker(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
