"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AddBlockMenu } from "@/components/admin/AddBlockMenu";
import { BlockForm } from "@/components/admin/BlockForm";
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
  const [editingBlock, setEditingBlock] = useState<BlockRecord | null>(null);
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
      headers: {
        "Content-Type": "application/json"
      },
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

    replacePageBlocks(selectedPage, [...pageBlocks, data as BlockRecord]);
    setEditingBlock(data as BlockRecord);
    setStatus("Block created.");
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
    setEditingBlock(data as BlockRecord);
    setStatus("Block saved.");
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
    if (editingBlock?.id === id) {
      setEditingBlock(null);
    }
    setStatus("Block deleted.");
    await revalidatePublicPaths(selectedPage);
  }

  async function handleToggleVisibility(id: string) {
    const target = pageBlocks.find((block) => block.id === id);

    if (!target) {
      return;
    }

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
    setStatus((data as BlockRecord).is_public ? "Block published." : "Block moved to draft.");
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

    setStatus("Block order updated.");
    await revalidatePublicPaths(selectedPage);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  function switchPage(page: PageName) {
    setSelectedPage(page);
    setEditingBlock(null);
    const next = new URLSearchParams(searchParams.toString());
    next.set("page", page);
    startTransition(() => {
      router.replace(`/admin?${next.toString()}`);
    });
  }

  return (
    <div className="grid min-h-screen bg-admin-ivory md:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="border-b border-border bg-admin-ivory p-5 md:border-b-0 md:border-r">
        <div className="space-y-8">
          <div className="space-y-1">
            <p className="font-sans text-[10px] uppercase tracking-label text-stone">
              Content
            </p>
            <h1 className="font-serif text-[26px] font-normal tracking-editorial text-ink">
              Admin
            </h1>
          </div>
          <nav className="space-y-2">
            {pages.map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => switchPage(page)}
                className={`block w-full border px-3 py-3 text-left font-sans text-[10px] uppercase tracking-label ${
                  selectedPage === page
                    ? "border-prussian bg-prussian text-ivory"
                    : "border-border bg-ivory text-warm-grey hover:bg-mist"
                }`}
              >
                {pageLabels[page]}
              </button>
            ))}
          </nav>
          <div className="space-y-2 border-t border-border pt-5">
            <p className="font-sans text-[10px] uppercase tracking-label text-stone">
              Future sections
            </p>
            <p className="text-sm text-ink/80">
              The shell is ready for more sidebar modules like your personal dashboard.
            </p>
          </div>
        </div>
      </aside>

      <main className="min-w-0">
        <div className="border-b border-border bg-ivory px-5 py-4 md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="font-sans text-[10px] uppercase tracking-label text-stone">
                {pageLabels[selectedPage]}
              </p>
              <p className="font-sans text-[11px] text-warm-grey">
                {isPending ? "Switching page..." : status}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <PreviewToggle
                enabled={previewMode}
                onToggle={() => setPreviewMode((current) => !current)}
              />
              <AddBlockMenu onAdd={handleAddBlock} />
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 font-sans text-[10px] uppercase tracking-label text-warm-grey hover:bg-mist"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

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
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_420px]">
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-sans text-[10px] uppercase tracking-label text-stone">
                    Blocks
                  </p>
                  <p className="font-sans text-[11px] text-warm-grey">
                    Drag to reorder. Draft and public live together here.
                  </p>
                </div>
                {pageBlocks.length ? (
                  <BlockList
                    blocks={pageBlocks}
                    onEdit={setEditingBlock}
                    onDelete={handleDeleteBlock}
                    onToggleVisibility={handleToggleVisibility}
                    onReorder={handleReorder}
                  />
                ) : (
                  <div className="border border-dashed border-border p-5 text-ink/80">
                    No blocks on this page yet. Add one to start composing.
                  </div>
                )}
              </section>
              <section>
                <BlockForm
                  block={editingBlock}
                  onCancel={() => setEditingBlock(null)}
                  onSave={handleSaveBlock}
                />
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
