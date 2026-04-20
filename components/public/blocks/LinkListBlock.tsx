import type { LinkListData } from "@/types/blocks";

type LinkListBlockProps = {
  data: LinkListData;
};

export function LinkListBlock({ data }: LinkListBlockProps) {
  const items = data.items ?? [];
  if (!items.length) return null;

  return (
    <nav className="space-y-2">
      {items.map((item, i) => (
        <a
          key={i}
          href={item.url}
          target={item.url.startsWith("mailto") ? undefined : "_blank"}
          rel="noreferrer"
          className="flex items-center gap-3 border border-border p-3 font-sans text-[13px] text-ink transition-colors hover:bg-mist hover:no-underline"
        >
          {item.icon ? (
            <span className="font-sans text-[10px] uppercase tracking-label text-stone">
              {item.icon}
            </span>
          ) : null}
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}
