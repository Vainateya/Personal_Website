import type { BlockRecord } from "@/types/blocks";
import { CardBlock } from "@/components/public/CardBlock";
import { EmbedBlock } from "@/components/public/EmbedBlock";
import { FormBlock } from "@/components/public/FormBlock";
import { LinkListBlock } from "@/components/public/LinkListBlock";
import { RichTextBlock } from "@/components/public/RichTextBlock";
import { TimelineBlock } from "@/components/public/TimelineBlock";

type BlockRendererProps = {
  block: BlockRecord;
};

export function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.type) {
    case "card":
      return <CardBlock data={block.data as never} />;
    case "richtext":
      return <RichTextBlock data={block.data as never} />;
    case "linklist":
      return <LinkListBlock data={block.data as never} />;
    case "embed":
      return <EmbedBlock data={block.data as never} />;
    case "form":
      return <FormBlock data={block.data as never} />;
    case "timeline":
      return <TimelineBlock data={block.data as never} />;
    default:
      return null;
  }
}
