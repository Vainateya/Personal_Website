import Image from "next/image";
import type { CardData } from "@/types/blocks";

type CardBlockProps = {
  data: CardData;
};

export function CardBlock({ data }: CardBlockProps) {
  return (
    <article className="grid gap-4 border border-border p-4 hover:bg-mist md:grid-cols-[140px_minmax(0,1fr)]">
      <div className="relative aspect-[4/3] overflow-hidden border border-border bg-admin-ivory">
        {data.thumbnail_url ? (
          <Image
            src={data.thumbnail_url}
            alt={data.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 140px"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-sans text-[11px] text-warm-grey">
            No image
          </div>
        )}
      </div>
      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-serif text-[24px] font-normal tracking-editorial text-ink">
              {data.title}
            </h3>
            {data.tags?.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className={`rounded-editorial border px-2 py-1 font-sans text-[10px] uppercase tracking-label ${
                  index === 0
                    ? "border-prussian bg-prussian text-mist"
                    : index === 1
                      ? "border-[#ced7e4] bg-mist text-prussian"
                      : "border-border text-warm-grey"
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
        <p className="text-[15px] leading-8 text-ink/80">{data.description}</p>
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
