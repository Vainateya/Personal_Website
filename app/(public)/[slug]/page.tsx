import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPages, getPageBySlug } from "@/lib/pages";
import { getBlocksByPageId } from "@/lib/blocks";
import { PageGrid } from "@/components/public/PageGrid";

export const revalidate = 120;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const pages = await getAllPages();
    return pages
      .filter((p) => p.slug !== "home")
      .map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const page = await getPageBySlug(params.slug);
  return { title: page?.name ?? params.slug };
}

export default async function DynamicPage({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug);
  if (!page) notFound();
  const blocks = await getBlocksByPageId(page.id);
  return <PageGrid blocks={blocks} />;
}
