import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import type {
  BlockRecord,
  FormSubmissionRecord,
  PageName
} from "@/types/blocks";
import { slugify } from "@/lib/utils";

function getSupabasePublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false
      }
    }
  );
}

function getSupabaseServiceClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    return getSupabasePublicClient();
  }

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey, {
    auth: {
      persistSession: false
    }
  });
}

export const getPublicBlocksByPage = cache(async (page: PageName) => {
  const supabase = getSupabasePublicClient();
  const { data, error } = await supabase
    .from("blocks")
    .select("*")
    .eq("page", page)
    .eq("is_public", true)
    .order("order", { ascending: true });

  if (error) {
    console.error(error);
    return [] as BlockRecord[];
  }

  return (data ?? []) as BlockRecord[];
});

export async function getAllBlocksByPage(page: PageName) {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("blocks")
    .select("*")
    .eq("page", page)
    .order("order", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as BlockRecord[];
}

export async function getWritingPostSlugs() {
  const blocks = await getPublicBlocksByPage("writing");

  return blocks
    .filter((block) => block.type === "richtext" && block.section === "essays")
    .map((block) => {
      const data = block.data as {
        title?: string;
        slug?: string;
      };

      return data.slug || slugify(data.title || "untitled");
    });
}

export async function getPublicWritingPostBySlug(slug: string) {
  const blocks = await getPublicBlocksByPage("writing");

  return (
    blocks.find((block) => {
      if (block.type !== "richtext" || block.section !== "essays") {
        return false;
      }

      const data = block.data as {
        title?: string;
        slug?: string;
      };

      return (data.slug || slugify(data.title || "")) === slug;
    }) ?? null
  );
}

export async function createBlock(input: Partial<BlockRecord>) {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("blocks")
    .insert(input)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as BlockRecord;
}

export async function updateBlock(
  id: string,
  updates: Partial<Omit<BlockRecord, "id" | "created_at" | "updated_at">>
) {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("blocks")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as BlockRecord;
}

export async function deleteBlock(id: string) {
  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from("blocks").delete().eq("id", id);

  if (error) {
    throw error;
  }
}

export async function reorderBlocks(
  page: PageName,
  orderedIds: string[]
) {
  const supabase = getSupabaseServiceClient();
  const updates = orderedIds.map((id, index) => ({
    id,
    page,
    order: index + 1,
    updated_at: new Date().toISOString()
  }));

  const { error } = await supabase.from("blocks").upsert(updates);

  if (error) {
    throw error;
  }
}

export async function submitForm(
  form_type: string,
  data: Record<string, unknown>
) {
  const supabase = getSupabaseServiceClient();
  const { data: row, error } = await supabase
    .from("form_submissions")
    .insert({ form_type, data })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return row as FormSubmissionRecord;
}
