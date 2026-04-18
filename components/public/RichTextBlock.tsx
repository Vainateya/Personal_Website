import type { RichTextData } from "@/types/blocks";

type RichTextBlockProps = {
  data: RichTextData;
};

export function RichTextBlock({ data }: RichTextBlockProps) {
  return (
    <section className="space-y-3 border-border">
      {data.title ? (
        <h2 className="font-serif text-[28px] font-normal tracking-editorial text-ink">
          {data.title}
        </h2>
      ) : null}
      {data.date ? (
        <p className="font-sans text-[11px] text-warm-grey">{data.date}</p>
      ) : null}
      <div
        className="prose-editorial"
        dangerouslySetInnerHTML={{ __html: data.content }}
      />
    </section>
  );
}
