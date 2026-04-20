"use client";

import { useState, useRef, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult
} from "@hello-pangea/dnd";
import type { PageRecord } from "@/types/blocks";

type PageSidebarProps = {
  pages: PageRecord[];
  selectedPageId: string | null;
  onSelect: (page: PageRecord) => void;
  onAdd: (name: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
};

export function PageSidebar({
  pages,
  selectedPageId,
  onSelect,
  onAdd,
  onDelete,
  onRename,
  onReorder
}: PageSidebarProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [addingName, setAddingName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const addInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus add input when shown
  useEffect(() => {
    if (isAdding) addInputRef.current?.focus();
  }, [isAdding]);

  // Auto-focus rename input when shown
  useEffect(() => {
    if (editingId) editInputRef.current?.focus();
  }, [editingId]);

  function handleAddConfirm() {
    const name = addingName.trim();
    if (name) onAdd(name);
    setIsAdding(false);
    setAddingName("");
  }

  function handleAddKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleAddConfirm();
    if (e.key === "Escape") { setIsAdding(false); setAddingName(""); }
  }

  function handleStartRename(page: PageRecord) {
    setEditingId(page.id);
    setEditingName(page.name);
    setConfirmDeleteId(null);
  }

  function handleRenameConfirm() {
    const name = editingName.trim();
    if (name && editingId) onRename(editingId, name);
    setEditingId(null);
    setEditingName("");
  }

  function handleRenameKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleRenameConfirm();
    if (e.key === "Escape") { setEditingId(null); setEditingName(""); }
  }

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return;
    const from = result.source.index;
    const to = result.destination.index;
    if (from !== to) onReorder(from, to);
  }

  return (
    <aside className="flex flex-col border-r border-border bg-admin-ivory overflow-hidden">
      {/* Header */}
      <div className="border-b border-border px-4 py-4 shrink-0">
        <p className="font-sans text-[10px] uppercase tracking-label text-stone">Pages</p>
      </div>

      {/* Page list */}
      <nav className="flex-1 overflow-y-auto p-2">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="pages">
            {(provided) => (
              <div
                className="space-y-0.5"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {pages.map((page, i) => {
                  const isSelected = selectedPageId === page.id;
                  const isEditing = editingId === page.id;
                  const isConfirmingDelete = confirmDeleteId === page.id;

                  return (
                    <Draggable key={page.id} draggableId={page.id} index={i}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`group flex items-center gap-1 px-3 py-2 transition-colors rounded-sm select-none ${
                            snapshot.isDragging
                              ? "opacity-80 shadow-sm bg-mist"
                              : isSelected
                              ? "bg-prussian text-ivory"
                              : "text-warm-grey hover:bg-mist hover:text-ink"
                          }`}
                        >
                          {isEditing ? (
                            /* Inline rename input */
                            <div className="flex-1 flex flex-col gap-0.5">
                              <input
                                ref={editInputRef}
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                onKeyDown={handleRenameKeyDown}
                                onBlur={handleRenameConfirm}
                                className="w-full bg-white border border-prussian/40 px-1.5 py-0.5 font-sans text-[11px] text-ink outline-none rounded-sm"
                              />
                              <p className="font-sans text-[9px] text-warm-grey/70 leading-tight">
                                Slug &amp; links will update · Enter to save
                              </p>
                            </div>
                          ) : isConfirmingDelete ? (
                            /* Inline delete confirmation */
                            <div className="flex-1 flex items-center gap-1.5">
                              <span className="font-sans text-[10px] text-[#8b3a2e]">Delete?</span>
                              <button
                                type="button"
                                onClick={() => { onDelete(page.id); setConfirmDeleteId(null); }}
                                className="font-sans text-[10px] text-[#8b3a2e] underline"
                              >
                                Yes
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="font-sans text-[10px] text-warm-grey underline"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            /* Normal page row */
                            <>
                              <button
                                type="button"
                                className="flex-1 text-left font-sans text-[11px] cursor-pointer"
                                onClick={() => {
                                  if (!snapshot.isDragging) onSelect(page);
                                }}
                                onDoubleClick={() => handleStartRename(page)}
                              >
                                {page.name}
                              </button>

                              {/* Delete button — visible on hover */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmDeleteId(page.id);
                                  setEditingId(null);
                                }}
                                className={`hidden px-1 font-sans text-[10px] group-hover:block ${
                                  isSelected
                                    ? "text-ivory/60 hover:text-ivory"
                                    : "text-[#8b3a2e]/70 hover:text-[#8b3a2e]"
                                }`}
                              >
                                ×
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </nav>

      {/* Footer — add page */}
      <div className="border-t border-border p-2 shrink-0">
        {isAdding ? (
          <div className="px-1 py-1">
            <input
              ref={addInputRef}
              value={addingName}
              onChange={(e) => setAddingName(e.target.value)}
              onKeyDown={handleAddKeyDown}
              onBlur={() => { if (!addingName.trim()) { setIsAdding(false); setAddingName(""); } }}
              placeholder="Page name…"
              className="w-full bg-white border border-prussian/40 px-2 py-1 font-sans text-[11px] text-ink outline-none rounded-sm placeholder:text-warm-grey/50"
            />
            <p className="mt-0.5 font-sans text-[9px] text-warm-grey/60">
              Enter to add · Esc to cancel
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => { setIsAdding(true); setConfirmDeleteId(null); setEditingId(null); }}
            className="w-full py-2.5 font-sans text-[10px] uppercase tracking-label text-warm-grey hover:bg-mist flex items-center justify-center gap-1"
          >
            <span className="text-[14px] leading-none">⊕</span>
            <span>Add page</span>
          </button>
        )}
      </div>
    </aside>
  );
}
