import type { BlockRecord } from "@/types/blocks";
import { CardListBlock } from "@/components/public/blocks/CardListBlock";
import { RichTextBlock } from "@/components/public/blocks/RichTextBlock";
import { LinkListBlock } from "@/components/public/blocks/LinkListBlock";
import { MediaBlock } from "@/components/public/blocks/MediaBlock";
import { EmbedBlock } from "@/components/public/blocks/EmbedBlock";
import { FormBlock } from "@/components/public/blocks/FormBlock";
import { TimelineBlock } from "@/components/public/blocks/TimelineBlock";

type BlockRendererProps = {
  block: BlockRecord;
};

export function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.type) {
    case "card_list": return <CardListBlock data={block.data as never} />;
    case "richtext":  return <RichTextBlock data={block.data as never} />;
    case "linklist":  return <LinkListBlock data={block.data as never} />;
    case "media":     return <MediaBlock data={block.data as never} />;
    case "embed":     return <EmbedBlock data={block.data as never} />;
    case "form":      return <FormBlock blockId={block.id} data={block.data as never} />;
    case "timeline":  return <TimelineBlock data={block.data as never} />;
    default:          return null;
  }
}
