import type { TimelineData } from "@/types/blocks";

type TimelineBlockProps = {
  data: TimelineData;
};

export function TimelineBlock({ data }: TimelineBlockProps) {
  const entries = data.entries ?? [];
  if (!entries.length) return null;

  return (
    <div className="space-y-0">
      {entries.map((entry, i) => (
        <div key={i} className="grid grid-cols-[64px_minmax(0,1fr)] gap-4 border-b border-border py-4 last:border-b-0">
          <div className="font-sans text-[11px] text-stone">{entry.year}</div>
          <div className="space-y-1">
            <p className="font-serif text-[16px] font-normal tracking-editorial text-ink">
              {entry.title}
            </p>
            {entry.institution ? (
              <p className="font-sans text-[11px] text-warm-grey">{entry.institution}</p>
            ) : null}
            {entry.description ? (
              <p className="text-[14px] leading-[1.7] text-ink/75">{entry.description}</p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
