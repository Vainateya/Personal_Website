import type { LinkListData } from "@/types/blocks";

type LinkListBlockProps = {
  data: LinkListData;
};

export function LinkListBlock({ data }: LinkListBlockProps) {
  return (
    <div className="border border-border">
      {data.items.map((item, index) => (
        <a
          key={item.url}
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between border-b border-border px-4 py-3 font-sans text-[12px] text-prussian last:border-b-0 hover:bg-mist hover:no-underline"
        >
          <span className="uppercase tracking-label text-warm-grey">{item.icon}</span>
          <span className="font-serif text-[18px] normal-case tracking-editorial text-ink">
            {item.label}
          </span>
        </a>
      ))}
    </div>
  );
}
