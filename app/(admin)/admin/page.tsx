import { requireAdminSession } from "@/lib/auth";
import { getAllPages } from "@/lib/pages";
import { getBlocksByPageId } from "@/lib/blocks";
import { AdminEditor } from "@/components/admin/AdminEditor";

export default async function AdminPage() {
  await requireAdminSession();

  const pages = await getAllPages();
  const firstPage = pages[0] ?? null;
  const initialBlocks = firstPage ? await getBlocksByPageId(firstPage.id) : [];

  return (
    <AdminEditor
      initialPages={pages}
      initialBlocks={initialBlocks}
      initialPageId={firstPage?.id ?? ""}
    />
  );
}
