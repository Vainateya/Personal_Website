"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AddBlockMenu } from "@/components/admin/AddBlockMenu";
import { BlockList } from "@/components/admin/BlockList";
import { PreviewToggle } from "@/components/admin/PreviewToggle";
import { BlockRenderer } from "@/components/public/BlockRenderer";
import { createEmptyBlock } from "@/lib/block-defaults";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { pageLabels, pages, type BlockRecord, type PageName } from "@/types/blocks";

type BlockEditorProps = {
  initialPage: PageName;
  initialBlocks: Record<PageName, BlockRecord[]>;
};

export function BlockEditor({ initialPage, initialBlocks }: BlockEditorProps) {
  const [selectedPage, setSelectedPage] = useState<PageName>(initialPage);
  const [blocksByPage, setBlocksByPage] =
    useState<Record<PageName, BlockRecord[]>>(initialBlocks);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [status, setStatus] = useState<string>("Ready");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createSupabaseBrowserClient();

  const pageBlocks = blocksByPage[selectedPage] ?? [];
  const publicBlocks = pageBlocks.filter((block) => block.is_public);

  function replacePageBlocks(page: PageName, nextBlocks: BlockRecord[]) {
    setBlocksByPage((current) => ({ ...current, [page]: nextBlocks }));
  }

  async function revalidatePublicPaths(page: PageName) {
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page })
    });
  }

  async function handleAddBlock(type: BlockRecord["type"]) {
    const draft = createEmptyBlock(selectedPage, "untitled", type);
    const { data, error } = await supabase
      .from("blocks")
      .insert(draft)
      .select("*")
      .single();

    if (error) {
      setStatus("Unable to add block.");
      return;
    }

    const newBlock = data as BlockRecord;
    replacePageBlocks(selectedPage, [...pageBlocks, newBlock]);
    setEditingBlockId(newBlock.id);
    setStatus("Block created — fill in details below.");
  }

  async function handleSaveBlock(block: BlockRecord) {
    const { data, error } = await supabase
      .from("blocks")
      .update({
        page: block.page,
        section: block.section,
        type: block.type,
        order: block.order,
        is_public: block.is_public,
        data: block.data
      })
      .eq("id", block.id)
      .select("*")
      .single();

    if (error) {
      setStatus("Unable to save block.");
      return;
    }

    replacePageBlocks(
      selectedPage,
      pageBlocks.map((item) => (item.id === block.id ? (data as BlockRecord) : item))
    );
    setStatus("Saved.");
    await revalidatePublicPaths(selectedPage);
    router.refresh();
  }

  async function handleDeleteBlock(id: string) {
    const { error } = await supabase.from("blocks").delete().eq("id", id);

    if (error) {
      setStatus("Unable to delete block.");
      return;
    }

    replacePageBlocks(
      selectedPage,
      pageBlocks.filter((block) => block.id !== id)
    );
    if (editingBlockId === id) setEditingBlockId(null);
    setStatus("Block deleted.");
    await revalidatePublicPaths(selectedPage);
  }

  async function handleToggleVisibility(id: string) {
    const target = pageBlocks.find((block) => block.id === id);
    if (!target) return;

    const { data, error } = await supabase
      .from("blocks")
      .update({ is_public: !target.is_public })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      setStatus("Unable to update visibility.");
      return;
    }

    replacePageBlocks(
      selectedPage,
      pageBlocks.map((block) => (block.id === id ? (data as BlockRecord) : block))
    );
    setStatus((data as BlockRecord).is_public ? "Published." : "Moved to draft.");
    await revalidatePublicPaths(selectedPage);
  }

  async function handleReorder(nextBlocks: BlockRecord[]) {
    const reordered = nextBlocks.map((block, index) => ({
      ...block,
      order: index + 1
    }));

    replacePageBlocks(selectedPage, reordered);

    const payload = reordered.map((block) => ({
      id: block.id,
      page: block.page,
      section: block.section,
      type: block.type,
      order: block.order,
      is_public: block.is_public,
      data: block.data
    }));

    const { error } = await supabase.from("blocks").upsert(payload);

    if (error) {
      setStatus("Unable to reorder blocks.");
      return;
    }

    setStatus("Order updated.");
    await revalidatePublicPaths(selectedPage);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  function switchPage(page: PageName) {
    setSelectedPage(page);
    setEditingBlockId(null);
    const next = new URLSearchParams(searchParams.toString());
    next.set("page", page);
    startTransition(() => {
      router.replace(`/admin?${next.toString()}`);
    });
  }

  return (
    <div className="grid min-h-screen bg-admin-ivory md:grid-cols-[200px_minmax(0,1fr)]">
      {/* Sidebar */}
      <aside className="border-b border-border bg-admin-ivory p-5 md:border-b-0 md:border-r">
        <div className="space-y-8">
          <div className="space-y-1">
            <p className="font-sans text-[10px] uppercase tracking-label text-stone">Content</p>
            <h1 className="font-serif text-[26px] font-normal tracking-editorial text-ink">
              Admin
            </h1>
          </div>
          <nav className="space-y-1.5">
            {pages.map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => switchPage(page)}
                className={`block w-full px-3 py-2.5 text-left font-sans text-[10px] uppercase tracking-label transition-colors ${
                  selectedPage === page
                    ? "bg-prussian text-ivory"
                    : "text-warm-grey hover:bg-mist"
                }`}
              >
                {pageLabels[page]}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main */}
      <main className="min-w-0">
        {/* Toolbar */}
        <div className="border-b border-border bg-ivory px-5 py-3 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <p className="font-sans text-[10px] uppercase tracking-label text-stone">
                {pageLabels[selectedPage]}
              </p>
              <p className="font-sans text-[11px] text-warm-grey">
                {isPending ? "Switching…" : status}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <PreviewToggle
                enabled={previewMode}
                onToggle={() => setPreviewMode((current) => !current)}
              />
              <AddBlockMenu onAdd={handleAddBlock} />
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-2 font-sans text-[10px] uppercase tracking-label text-warm-grey hover:bg-mist"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="px-5 py-6 md:px-8">
          {previewMode ? (
            <div className="mx-auto max-w-content space-y-card">
              {publicBlocks.length ? (
                publicBlocks.map((block) => <BlockRenderer key={block.id} block={block} />)
              ) : (
                <div className="border border-dashed border-border p-5 text-ink/80">
                  No public blocks on this page yet.
                </div>
              )}
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-3">
              {pageBlocks.length ? (
                <BlockList
                  blocks={pageBlocks}
                  editingBlockId={editingBlockId}
                  onEdit={(block) =>
                    setEditingBlockId(
                      block.id === editingBlockId ? null : block.id
                    )
                  }
                  onCancelEdit={() => setEditingBlockId(null)}
                  onSave={handleSaveBlock}
                  onDelete={handleDeleteBlock}
                  onToggleVisibility={handleToggleVisibility}
                  onReorder={handleReorder}
                />
              ) : (
                <div className="border border-dashed border-border p-5 text-center">
                  <p className="font-sans text-[11px] text-warm-grey">
                    No blocks yet. Use &ldquo;Add block&rdquo; above to start building this page.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
