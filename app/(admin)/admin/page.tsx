import { BlockEditor } from "@/components/admin/BlockEditor";
import { requireAdminSession } from "@/lib/auth";
import { getAllBlocksByPage } from "@/lib/blocks";
import { pages, type BlockRecord, type PageName } from "@/types/blocks";

export default async function AdminPage({
  searchParams
}: {
  searchParams?: { page?: string };
}) {
  await requireAdminSession();

  const requestedPage = searchParams?.page;
  const initialPage = (pages.includes(requestedPage as PageName)
    ? requestedPage
    : "home") as PageName;

  const entries = await Promise.all(
    pages.map(async (page) => [page, await getAllBlocksByPage(page)] as const)
  );

  const initialBlocks = Object.fromEntries(entries) as Record<PageName, BlockRecord[]>;

  return <BlockEditor initialPage={initialPage} initialBlocks={initialBlocks} />;
}
