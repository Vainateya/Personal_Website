import type { EmbedData } from "@/types/blocks";

type EmbedBlockProps = {
  data: EmbedData;
};

function getEmbedUrl(url: string) {
  try {
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = new URL(url).searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }
  } catch {
    return url;
  }

  return url;
}

export function EmbedBlock({ data }: EmbedBlockProps) {
  return (
    <figure className="space-y-3 border border-border p-4">
      <div className="aspect-video border border-border bg-admin-ivory">
        <iframe
          src={getEmbedUrl(data.url)}
          title={data.caption || "Embedded media"}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {data.caption ? (
        <figcaption className="font-sans text-[11px] text-warm-grey">
          {data.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
