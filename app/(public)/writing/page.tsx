import Link from "next/link";
import { SectionLabel } from "@/components/public/SectionLabel";
import { getPublicBlocksByPage } from "@/lib/blocks";
import { slugify } from "@/lib/utils";
import type { RichTextData } from "@/types/blocks";

export const revalidate = 120;

export default async function WritingPage() {
  const blocks = await getPublicBlocksByPage("writing");
  const essays = blocks.filter((block) => block.section === "essays");
  const notes = blocks.filter((block) => block.section === "notes");

  return (
    <main className="px-5 py-10 md:px-8 md:py-14">
      <div className="mx-auto max-w-content space-y-section">
        <section className="space-y-6">
          <SectionLabel>Essays</SectionLabel>
          <div className="space-y-4">
            {essays.map((block) => {
              const data = block.data as RichTextData;
              const slug = data.slug || slugify(data.title || "untitled");

              return (
                <Link
                  key={block.id}
                  href={`/writing/${slug}`}
                  className="block border border-border p-4 hover:bg-mist hover:no-underline"
                >
                  <div className="space-y-2">
                    <p className="font-sans text-[11px] text-warm-grey">{data.date}</p>
                    <h2 className="font-serif text-[28px] font-normal tracking-editorial text-ink">
                      {data.title}
                    </h2>
                    <p className="text-ink/80">{data.excerpt}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
        <section className="space-y-6">
          <SectionLabel>Research Notes</SectionLabel>
          <div className="space-y-4">
            {notes.map((block) => {
              const data = block.data as RichTextData;

              return (
                <article key={block.id} className="border border-border p-4 hover:bg-mist">
                  <p className="font-sans text-[11px] text-warm-grey">{data.date}</p>
                  <div
                    className="prose-editorial mt-3"
                    dangerouslySetInnerHTML={{ __html: data.content }}
                  />
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
