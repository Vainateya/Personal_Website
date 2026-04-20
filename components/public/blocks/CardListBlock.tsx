import Image from "next/image";
import type { CardListData } from "@/types/blocks";

type CardListBlockProps = {
  data: CardListData;
};

export function CardListBlock({ data }: CardListBlockProps) {
  const cards = data.cards ?? [];

  if (!cards.length) return null;

  return (
    <div className="space-y-4">
      {cards.map((card) => (
        <article
          key={card.id}
          className="grid gap-4 border border-border p-4 transition-colors hover:bg-mist md:grid-cols-[140px_minmax(0,1fr)]"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-stone/25">
            {card.thumbnail_url ? (
              <Image
                src={card.thumbnail_url}
                alt={card.title}
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
                  {card.title}
                </h3>
                {card.tags?.map((tag, i) => (
                  <span
                    key={`${tag}-${i}`}
                    className={`rounded-[3px] px-2 py-0.5 font-sans text-[9px] uppercase tracking-label ${
                      i === 0 ? "bg-prussian text-mist" : "bg-mist text-prussian"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 font-sans text-[11px] text-warm-grey">
                {card.institution ? <span>{card.institution}</span> : null}
                {card.year ? <span>{card.year}</span> : null}
              </div>
            </div>
            {card.description ? (
              <p className="text-[14px] leading-[1.8] text-ink/75">{card.description}</p>
            ) : null}
            {card.links?.length ? (
              <div className="flex flex-wrap gap-4 font-sans text-[11px] text-prussian">
                {card.links.map((link) => (
                  <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
