"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { BlockRecord, BlockType, PageRecord } from "@/types/blocks";
import { blockTypeDefaults, defaultBlockData } from "@/types/blocks";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { GridEditor } from "@/components/admin/GridEditor";
import { BlockPanel } from "@/components/admin/BlockPanel";
import { PageSidebar } from "@/components/admin/PageSidebar";

type AdminEditorProps = {
  initialPages: PageRecord[];
  initialBlocks: BlockRecord[]; // blocks for first selected page
  initialPageId: string;
};

export function AdminEditor({ initialPages, initialBlocks, initialPageId }: AdminEditorProps) {
  const [pages, setPages] = useState<PageRecord[]>(initialPages);
  const [selectedPageId, setSelectedPageId] = useState<string>(initialPageId);
  const [blocks, setBlocks] = useState<BlockRecord[]>(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [status, setStatus] = useState("Ready");
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const selectedPage = pages.find((p) => p.id === selectedPageId) ?? null;
  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) ?? null;

  // ── Revalidate ─────────────────────────────────────────
  async function revalidate(slug: string) {
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug })
    });
    router.refresh();
  }

  // ── Pages ──────────────────────────────────────────────
  async function handleSelectPage(page: PageRecord) {
    setSelectedPageId(page.id);
    setSelectedBlockId(null);
    setStatus("Loading…");
    const { data, error } = await supabase
      .from("blocks")
      .select("*")
      .eq("page_id", page.id)
      .order("y", { ascending: true })
      .order("x", { ascending: true });
    if (error) {
      setStatus("Failed to load blocks.");
      return;
    }
    setBlocks((data ?? []) as BlockRecord[]);
    setStatus("Ready");
  }

  async function handleAddPage() {
    const name = window.prompt("Page name (e.g. Research)");
    if (!name?.trim()) return;
    const raw = window.prompt("URL slug (e.g. research)", name.toLowerCase().replace(/\s+/g, "-"));
    if (!raw?.trim()) return;
    const slug = raw.trim();

    const maxOrder = Math.max(0, ...pages.map((p) => p.nav_order));
    const { data, error } = await supabase
      .from("pages")
      .insert({ name: name.trim(), slug, nav_order: maxOrder + 1 })
      .select("*")
      .single();

    if (error) {
      setStatus(`Error: ${error.message}`);
      return;
    }
    const newPage = data as PageRecord;
    setPages((prev) => [...prev, newPage]);
    setSelectedPageId(newPage.id);
    setBlocks([]);
    setSelectedBlockId(null);
    setStatus("Page created.");
  }

  async function handleDeletePage(id: string) {
    const { error } = await supabase.from("pages").delete().eq("id", id);
    if (error) { setStatus(`Error: ${error.message}`); return; }
    const remaining = pages.filter((p) => p.id !== id);
    setPages(remaining);
    if (selectedPageId === id) {
      const first = remaining[0];
      if (first) {
        await handleSelectPage(first);
      } else {
        setSelectedPageId("");
        setBlocks([]);
        setSelectedBlockId(null);
      }
    }
    setStatus("Page deleted.");
  }

  async function handleMovePage(id: string, direction: "up" | "down") {
    const sorted = [...pages].sort((a, b) => a.nav_order - b.nav_order);
    const idx = sorted.findIndex((p) => p.id === id);
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sorted.length) return;

    const a = sorted[idx];
    const b = sorted[targetIdx];
    const newOrder = { [a.id]: b.nav_order, [b.id]: a.nav_order };

    const updates = [
      supabase.from("pages").update({ nav_order: newOrder[a.id] }).eq("id", a.id),
      supabase.from("pages").update({ nav_order: newOrder[b.id] }).eq("id", b.id)
    ];
    await Promise.all(updates);

    setPages((prev) =>
      prev.map((p) =>
        p.id === a.id ? { ...p, nav_order: newOrder[a.id] } :
        p.id === b.id ? { ...p, nav_order: newOrder[b.id] } : p
      ).sort((x, y) => x.nav_order - y.nav_order)
    );
  }

  // ── Blocks ─────────────────────────────────────────────
  const handleAddBlock = useCallback(
    async (type: BlockType, x: number, y: number) => {
      if (!selectedPageId) return;
      const defaults = blockTypeDefaults[type];
      const { data, error } = await supabase
        .from("blocks")
        .insert({
          page_id: selectedPageId,
          type,
          x,
          y,
          w: defaults.w,
          h: defaults.h,
          data: defaultBlockData(type)
        })
        .select("*")
        .single();

      if (error) { setStatus(`Error: ${error.message}`); return; }
      const newBlock = data as BlockRecord;
      setBlocks((prev) => [...prev, newBlock]);
      setSelectedBlockId(newBlock.id);
      setStatus("Block added — edit it in the panel.");
      if (selectedPage) await revalidate(selectedPage.slug);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedPageId, selectedPage, supabase]
  );

  const handleUpdateBlock = useCallback(
    async (id: string, updates: Partial<Pick<BlockRecord, "x" | "y" | "w" | "h">>) => {
      const { data, error } = await supabase
        .from("blocks")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select("*")
        .single();
      if (error) { setStatus(`Error: ${error.message}`); return; }
      setBlocks((prev) => prev.map((b) => (b.id === id ? (data as BlockRecord) : b)));
      if (selectedPage) await revalidate(selectedPage.slug);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedPage, supabase]
  );

  async function handleSaveBlock(block: BlockRecord) {
    const { data, error } = await supabase
      .from("blocks")
      .update({ data: block.data, updated_at: new Date().toISOString() })
      .eq("id", block.id)
      .select("*")
      .single();
    if (error) { setStatus(`Error: ${error.message}`); return; }
    setBlocks((prev) => prev.map((b) => (b.id === block.id ? (data as BlockRecord) : b)));
    setStatus("Block saved.");
    if (selectedPage) await revalidate(selectedPage.slug);
  }

  async function handleDeleteBlock(id: string) {
    const { error } = await supabase.from("blocks").delete().eq("id", id);
    if (error) { setStatus(`Error: ${error.message}`); return; }
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
    setStatus("Block deleted.");
    if (selectedPage) await revalidate(selectedPage.slug);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="grid min-h-screen" style={{ gridTemplateColumns: "180px minmax(0,1fr) 320px" }}>
      {/* Page sidebar */}
      <PageSidebar
        pages={pages}
        selectedPageId={selectedPageId}
        onSelect={handleSelectPage}
        onAdd={handleAddPage}
        onDelete={handleDeletePage}
        onMoveUp={(id) => handleMovePage(id, "up")}
        onMoveDown={(id) => handleMovePage(id, "down")}
      />

      {/* Main canvas */}
      <div className="flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-border bg-ivory px-5 py-3">
          <div className="flex items-center gap-4">
            <p className="font-sans text-[11px] font-medium text-ink">
              {selectedPage?.name ?? "No page selected"}
            </p>
            <p className="font-sans text-[10px] text-warm-grey">{status}</p>
          </div>
          <div className="flex items-center gap-2">
            {selectedPage && (
              <a
                href={selectedPage.slug === "home" ? "/" : `/${selectedPage.slug}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 font-sans text-[10px] uppercase tracking-label text-warm-grey hover:bg-mist hover:no-underline"
              >
                Preview ↗
              </a>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-2 font-sans text-[10px] uppercase tracking-label text-warm-grey hover:bg-mist"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Grid canvas */}
        {selectedPageId ? (
          <GridEditor
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
            onAddBlock={handleAddBlock}
            onUpdateBlock={handleUpdateBlock}
            onDeleteBlock={handleDeleteBlock}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="font-sans text-[11px] text-warm-grey">Select or create a page.</p>
          </div>
        )}
      </div>

      {/* Block panel */}
      <BlockPanel
        block={selectedBlock}
        onClose={() => setSelectedBlockId(null)}
        onSave={handleSaveBlock}
      />
    </div>
  );
}
