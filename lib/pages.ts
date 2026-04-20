import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import type { PageRecord } from "@/types/blocks";

function getClient() {
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false }
  });
}

export const getAllPages = cache(async (): Promise<PageRecord[]> => {
  const { data, error } = await getClient()
    .from("pages")
    .select("*")
    .order("nav_order", { ascending: true });
  if (error) {
    console.error("getAllPages:", error.message);
    return [];
  }
  return (data ?? []) as PageRecord[];
});

export const getPageBySlug = cache(async (slug: string): Promise<PageRecord | null> => {
  const { data, error } = await getClient()
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data as PageRecord;
});
