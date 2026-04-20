import type { RichTextData } from "@/types/blocks";

type RichTextBlockProps = {
  data: RichTextData;
};

export function RichTextBlock({ data }: RichTextBlockProps) {
  if (!data.content) return null;
  return (
    <div
      className="prose-editorial"
      dangerouslySetInnerHTML={{ __html: data.content }}
    />
  );
}
