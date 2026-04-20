import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/pages";
import { getBlocksByPageId } from "@/lib/blocks";
import { PageGrid } from "@/components/public/PageGrid";

export const revalidate = 120;

export default async function HomePage() {
  const page = await getPageBySlug("home");
  if (!page) notFound();
  const blocks = await getBlocksByPageId(page.id);
  return <PageGrid blocks={blocks} />;
}
