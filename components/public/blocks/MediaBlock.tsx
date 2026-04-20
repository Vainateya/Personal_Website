import Image from "next/image";
import type { MediaData } from "@/types/blocks";

type MediaBlockProps = {
  data: MediaData;
};

export function MediaBlock({ data }: MediaBlockProps) {
  if (!data.url) return null;

  return (
    <figure className="space-y-2">
      {data.type === "video" ? (
        <video
          src={data.url}
          controls
          className="w-full border border-border"
          style={{ display: "block" }}
        />
      ) : (
        <div className="relative aspect-video w-full overflow-hidden border border-border bg-stone/20">
          <Image src={data.url} alt={data.caption || ""} fill className="object-cover" />
        </div>
      )}
      {data.caption ? (
        <figcaption className="font-sans text-[11px] text-warm-grey">{data.caption}</figcaption>
      ) : null}
    </figure>
  );
}
