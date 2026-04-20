import type { BlockRecord } from "@/types/blocks";
import { BlockRenderer } from "@/components/public/BlockRenderer";

type PageGridProps = {
  blocks: BlockRecord[];
};

export function PageGrid({ blocks }: PageGridProps) {
  if (!blocks.length) {
    return (
      <main className="px-5 py-14 md:px-8">
        <div className="mx-auto max-w-[1100px]">
          <p className="font-sans text-[11px] text-warm-grey">Nothing here yet.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="px-5 py-10 md:px-8 md:py-14">
      <div
        className="mx-auto w-full max-w-[1100px]"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gridAutoRows: "minmax(auto, auto)",
          gap: "24px"
        }}
      >
        {blocks.map((block) => (
          <div
            key={block.id}
            style={{
              gridColumn: `${block.x + 1} / span ${block.w}`,
              gridRow: `${block.y + 1} / span ${block.h}`
            }}
          >
            <BlockRenderer block={block} />
          </div>
        ))}
      </div>
    </main>
  );
}
