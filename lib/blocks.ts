import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import type { BlockRecord } from "@/types/blocks";

function getPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}

// Server-side: fetch blocks for a page (used by public site SSR)
export const getBlocksByPageId = cache(async (pageId: string): Promise<BlockRecord[]> => {
  const { data, error } = await getPublicClient()
    .from("blocks")
    .select("*")
    .eq("page_id", pageId)
    .order("y", { ascending: true })
    .order("x", { ascending: true });

  if (error) {
    console.error("getBlocksByPageId:", error.message);
    return [];
  }
  return (data ?? []) as BlockRecord[];
});

// Public form submission (no auth required — RLS allows)
export async function submitFormResponse(
  blockId: string,
  data: Record<string, unknown>
): Promise<void> {
  const { error } = await getPublicClient()
    .from("form_submissions")
    .insert({ block_id: blockId, data });
  if (error) throw error;
}
