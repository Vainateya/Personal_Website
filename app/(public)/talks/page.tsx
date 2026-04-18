import { BlockRenderer } from "@/components/public/BlockRenderer";
import { SectionLabel } from "@/components/public/SectionLabel";
import { getPublicBlocksByPage } from "@/lib/blocks";

export const revalidate = 120;

export default async function TalksPage() {
  const blocks = await getPublicBlocksByPage("talks");

  return (
    <main className="px-5 py-10 md:px-8 md:py-14">
      <div className="mx-auto max-w-content space-y-6">
        <SectionLabel>Talks</SectionLabel>
        <div className="space-y-card">
          {blocks.length ? (
            blocks.map((block) => <BlockRenderer key={block.id} block={block} />)
          ) : (
            <p className="border border-border p-4 text-ink/80">
              Talks will appear here as they are published.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
