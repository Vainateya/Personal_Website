import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/auth";
import type { PageName } from "@/types/blocks";

const pathByPage: Record<PageName, string[]> = {
  home: ["/"],
  writing: ["/writing"],
  talks: ["/talks"],
  now: ["/now"],
  connect: ["/connect"]
};

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { page?: PageName };
  const page = body.page;

  if (!page || !(page in pathByPage)) {
    return NextResponse.json({ error: "Invalid page." }, { status: 400 });
  }

  for (const path of pathByPage[page]) {
    revalidatePath(path);
  }

  if (page === "writing") {
    revalidatePath("/writing", "layout");
  }

  return NextResponse.json({ ok: true });
}
