import type { EmbedData } from "@/types/blocks";

type EmbedBlockProps = {
  data: EmbedData;
};

export function EmbedBlock({ data }: EmbedBlockProps) {
  if (!data.url) return null;

  return (
    <figure className="space-y-2">
      <div className="relative aspect-video w-full border border-border bg-stone/10">
        <iframe
          src={data.url}
          title={data.caption || "Embedded content"}
          className="absolute inset-0 h-full w-full"
          allowFullScreen
          loading="lazy"
        />
      </div>
      {data.caption ? (
        <figcaption className="font-sans text-[11px] text-warm-grey">{data.caption}</figcaption>
      ) : null}
    </figure>
  );
}
