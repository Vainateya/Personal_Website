"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { BlockRecord, BlockType } from "@/types/blocks";
import { blockTypeLabels } from "@/types/blocks";

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
  onDropBlock: (type: BlockType, x: number, y: number) => Promise<void>;
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

export function GridEditor({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onDropBlock,
  onUpdateBlock,
  onDeleteBlock
}: GridEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const colWidthRef = useRef(0);

  const [liveBlocks, setLiveBlocks] = useState<BlockRecord[]>(blocks);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dropPreview, setDropPreview] = useState<{ x: number; y: number } | null>(null);
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

  // ── Block drag/resize (existing blocks) ──────────────────
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

  // ── Catalog → grid drop handling ─────────────────────────

  function getCoordsFromEvent(e: React.DragEvent): { x: number; y: number } {
    const rect = containerRef.current!.getBoundingClientRect();
    const x = Math.max(0, Math.min(COLS - 1, Math.floor((e.clientX - rect.left) / colWidthRef.current)));
    const y = Math.max(0, Math.floor((e.clientY - rect.top) / ROW_H));
    return { x, y };
  }

  function handleDragOver(e: React.DragEvent) {
    // Only handle drags that carry a block type (from catalog)
    if (!e.dataTransfer.types.includes("text/plain")) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsDragOver(true);
    setDropPreview(getCoordsFromEvent(e));
  }

  function handleDragLeave(e: React.DragEvent) {
    // Only clear if leaving the container itself (not a child)
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
      setDropPreview(null);
    }
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    setDropPreview(null);

    const type = e.dataTransfer.getData("text/plain") as BlockType;
    if (!type) return;

    const { x, y } = getCoordsFromEvent(e);
    await onDropBlock(type, x, y);
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
          cursor: isDragOver ? "copy" : "default"
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Grid overlay — vertical lines */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
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
                opacity: isDragOver ? 0.5 : 0.3
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
                opacity: isDragOver ? 0.5 : 0.3
              }}
            />
          ))}
        </div>

        {/* Drop preview cell */}
        {isDragOver && dropPreview && (
          <div
            style={{
              position: "absolute",
              left: dropPreview.x * colWidth,
              top: dropPreview.y * ROW_H,
              width: colWidth,
              height: ROW_H,
              background: "#1D355720",
              border: "2px dashed #1D3557",
              boxSizing: "border-box",
              pointerEvents: "none",
              zIndex: 5
            }}
          />
        )}

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
      </div>
    </div>
  );
}
