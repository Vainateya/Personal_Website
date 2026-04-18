import type { TimelineData } from "@/types/blocks";

type TimelineBlockProps = {
  data: TimelineData;
};

export function TimelineBlock({ data }: TimelineBlockProps) {
  return (
    <div className="border border-border">
      {data.entries.map((entry) => (
        <article
          key={`${entry.year}-${entry.title}`}
          className="grid gap-2 border-b border-border px-4 py-4 last:border-b-0 md:grid-cols-[84px_minmax(0,1fr)]"
        >
          <p className="font-sans text-[11px] text-warm-grey">{entry.year}</p>
          <div className="space-y-2">
            <h3 className="font-serif text-[21px] font-normal tracking-editorial text-ink">
              {entry.title}
            </h3>
            <p className="font-sans text-[11px] text-warm-grey">{entry.institution}</p>
            <p className="text-ink/80">{entry.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
