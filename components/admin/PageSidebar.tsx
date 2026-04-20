"use client";

import type { PageRecord } from "@/types/blocks";

type PageSidebarProps = {
  pages: PageRecord[];
  selectedPageId: string | null;
  onSelect: (page: PageRecord) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
};

export function PageSidebar({
  pages,
  selectedPageId,
  onSelect,
  onAdd,
  onDelete,
  onMoveUp,
  onMoveDown
}: PageSidebarProps) {
  return (
    <aside className="flex flex-col border-r border-border bg-admin-ivory">
      <div className="border-b border-border px-4 py-4">
        <p className="font-sans text-[10px] uppercase tracking-label text-stone">Pages</p>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {pages.map((page, i) => (
            <div
              key={page.id}
              className={`group flex items-center gap-1 px-3 py-2 transition-colors ${
                selectedPageId === page.id
                  ? "bg-prussian text-ivory"
                  : "text-warm-grey hover:bg-mist hover:text-ink"
              }`}
            >
              <button
                type="button"
                className="flex-1 text-left font-sans text-[11px]"
                onClick={() => onSelect(page)}
              >
                {page.name}
              </button>
              {/* Reorder buttons */}
              <button
                type="button"
                onClick={() => onMoveUp(page.id)}
                disabled={i === 0}
                className={`hidden px-1 font-sans text-[10px] group-hover:block disabled:opacity-30 ${
                  selectedPageId === page.id ? "text-ivory/70" : "text-warm-grey"
                }`}
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => onMoveDown(page.id)}
                disabled={i === pages.length - 1}
                className={`hidden px-1 font-sans text-[10px] group-hover:block disabled:opacity-30 ${
                  selectedPageId === page.id ? "text-ivory/70" : "text-warm-grey"
                }`}
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete page "${page.name}"? All its blocks will be removed.`)) {
                    onDelete(page.id);
                  }
                }}
                className={`hidden px-1 font-sans text-[10px] group-hover:block ${
                  selectedPageId === page.id ? "text-ivory/70 hover:text-ivory" : "text-[#8b3a2e]"
                }`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </nav>
      <div className="border-t border-border p-2">
        <button
          type="button"
          onClick={onAdd}
          className="w-full py-2.5 font-sans text-[10px] uppercase tracking-label text-warm-grey hover:bg-mist"
        >
          + Add page
        </button>
      </div>
    </aside>
  );
}
