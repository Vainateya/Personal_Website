import { notFound } from "next/navigation";
import { getPublicWritingPostBySlug, getWritingPostSlugs } from "@/lib/blocks";
import type { RichTextData } from "@/types/blocks";

export const revalidate = 120;

export async function generateStaticParams() {
  const slugs = await getWritingPostSlugs();

  return slugs.map((slug) => ({ slug }));
}

export default async function WritingPostPage({
  params
}: {
  params: { slug: string };
}) {
  const block = await getPublicWritingPostBySlug(params.slug);

  if (!block) {
    notFound();
  }

  const data = block.data as RichTextData;

  return (
    <main className="px-5 py-10 md:px-8 md:py-14">
      <article className="mx-auto max-w-content space-y-6">
        <div className="space-y-3 border-b border-border pb-6">
          <p className="font-sans text-[10px] uppercase tracking-label text-stone">
            Writing
          </p>
          <h1 className="font-serif text-[38px] font-normal tracking-editorial text-ink">
            {data.title}
          </h1>
          {data.date ? (
            <p className="font-sans text-[11px] text-warm-grey">{data.date}</p>
          ) : null}
        </div>
        <div
          className="prose-editorial"
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      </article>
    </main>
  );
}
