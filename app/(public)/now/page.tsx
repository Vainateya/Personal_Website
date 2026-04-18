import { BlockRenderer } from "@/components/public/BlockRenderer";
import { SectionLabel } from "@/components/public/SectionLabel";
import { getPublicBlocksByPage } from "@/lib/blocks";

export const revalidate = 120;

const sections = [
  { key: "working", label: "What I’m Working On This Month" },
  { key: "reading", label: "What I’m Reading" },
  { key: "book-recommendations", label: "Suggest A Book" }
] as const;

export default async function NowPage() {
  const blocks = await getPublicBlocksByPage("now");

  return (
    <main className="px-5 py-10 md:px-8 md:py-14">
      <div className="mx-auto max-w-content space-y-section">
        {sections.map((section) => {
          const sectionBlocks = blocks.filter((block) => block.section === section.key);

          if (!sectionBlocks.length) {
            return null;
          }

          return (
            <section key={section.key} className="space-y-6">
              <SectionLabel>{section.label}</SectionLabel>
              <div className="space-y-card">
                {sectionBlocks.map((block) => (
                  <BlockRenderer key={block.id} block={block} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
