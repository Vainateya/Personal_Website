import Image from "next/image";
import type { CardData } from "@/types/blocks";

type CardBlockProps = {
  data: CardData;
};

export function CardBlock({ data }: CardBlockProps) {
  return (
    <article className="grid gap-4 border border-border p-4 transition-colors hover:bg-mist md:grid-cols-[140px_minmax(0,1fr)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone/25">
        {data.thumbnail_url ? (
          <Image
            src={data.thumbnail_url}
            alt={data.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 140px"
          />
        ) : null}
      </div>
      <div className="space-y-3">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-baseline gap-2">
            <h3 className="font-serif text-[22px] font-normal tracking-editorial text-ink">
              {data.title}
            </h3>
            {data.tags?.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className={`rounded-[3px] px-2 py-0.5 font-sans text-[9px] uppercase tracking-label ${
                  index === 0
                    ? "bg-prussian text-mist"
                    : "bg-mist text-prussian"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 font-sans text-[11px] text-warm-grey">
            {data.institution ? <span>{data.institution}</span> : null}
            {data.year ? <span>{data.year}</span> : null}
            {data.date ? <span>{data.date}</span> : null}
          </div>
        </div>
        {data.description ? (
          <p className="text-[14px] leading-[1.8] text-ink/75">{data.description}</p>
        ) : null}
        {data.links?.length ? (
          <div className="flex flex-wrap gap-4 font-sans text-[11px] text-prussian">
            {data.links.map((link) => (
              <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
