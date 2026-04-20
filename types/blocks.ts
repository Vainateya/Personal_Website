// ============================================================
// Core data model — v2 grid-based page builder
// ============================================================

export const blockTypes = [
  "card_list",
  "richtext",
  "linklist",
  "media",
  "embed",
  "form",
  "timeline"
] as const;

export type BlockType = (typeof blockTypes)[number];

export const blockTypeLabels: Record<BlockType, string> = {
  card_list: "Card List",
  richtext:  "Rich Text",
  linklist:  "Link List",
  media:     "Media",
  embed:     "Embed",
  form:      "Form",
  timeline:  "Timeline"
};

// Default block dimensions (w × h) per type
export const blockTypeDefaults: Record<BlockType, { w: number; h: number }> = {
  card_list: { w: 12, h: 8 },
  richtext:  { w: 8,  h: 4 },
  linklist:  { w: 4,  h: 4 },
  media:     { w: 6,  h: 4 },
  embed:     { w: 8,  h: 4 },
  form:      { w: 6,  h: 6 },
  timeline:  { w: 8,  h: 6 }
};

// ── Pages ─────────────────────────────────────────────────
export type PageRecord = {
  id: string;
  name: string;
  slug: string;
  nav_order: number;
  created_at: string;
  updated_at: string;
};

// ── Block data types ──────────────────────────────────────

export type CardItem = {
  id: string;
  thumbnail_url: string;
  title: string;
  institution: string;
  description: string;
  year: string;
  tags: string[];
  links: { label: string; url: string }[];
};

export type CardListData = {
  cards: CardItem[];
};

export type RichTextData = {
  content: string; // HTML from Tiptap
};

export type LinkListData = {
  items: { icon: string; label: string; url: string }[];
};

export type MediaData = {
  url: string;
  caption: string;
  type: "image" | "video";
};

export type EmbedData = {
  url: string;
  caption: string;
};

export type FormFieldDef = {
  name: string;
  type: string;        // text | email | textarea | ...
  placeholder: string;
  required: boolean;
};

export type FormData = {
  form_type: "contact" | "feedback" | "bookrec";
  fields: FormFieldDef[];
};

export type TimelineEntry = {
  year: string;
  title: string;
  institution: string;
  description: string;
};

export type TimelineData = {
  entries: TimelineEntry[];
};

export type BlockData =
  | CardListData
  | RichTextData
  | LinkListData
  | MediaData
  | EmbedData
  | FormData
  | TimelineData;

// ── Block record (matches DB) ─────────────────────────────
export type BlockRecord = {
  id: string;
  page_id: string;
  type: BlockType;
  x: number; // column start, 0-indexed
  y: number; // row start, 0-indexed
  w: number; // column span (1–12)
  h: number; // row span (1+)
  data: BlockData;
  created_at: string;
  updated_at: string;
};

// ── Helpers ───────────────────────────────────────────────

export function emptyCardItem(): CardItem {
  return {
    id: crypto.randomUUID(),
    thumbnail_url: "",
    title: "",
    institution: "",
    description: "",
    year: "",
    tags: [],
    links: []
  };
}

export function defaultBlockData(type: BlockType): BlockData {
  switch (type) {
    case "card_list": return { cards: [] };
    case "richtext":  return { content: "<p></p>" };
    case "linklist":  return { items: [] };
    case "media":     return { url: "", caption: "", type: "image" };
    case "embed":     return { url: "", caption: "" };
    case "form":      return { form_type: "contact", fields: [] };
    case "timeline":  return { entries: [] };
  }
}
