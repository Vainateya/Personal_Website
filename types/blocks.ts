export const pages = ["home", "writing", "talks", "now", "connect"] as const;
export type PageName = (typeof pages)[number];

export const blockTypes = [
  "card",
  "richtext",
  "linklist",
  "embed",
  "form",
  "timeline"
] as const;
export type BlockType = (typeof blockTypes)[number];

export type LinkItem = {
  label: string;
  url: string;
};

export type CardData = {
  title: string;
  institution: string;
  description: string;
  year: string;
  links: LinkItem[];
  tags: string[];
  thumbnail_url: string;
  date?: string;
  slug?: string;
  venue?: string;
};

export type RichTextData = {
  title?: string;
  slug?: string;
  date?: string;
  excerpt?: string;
  content: string;
};

export type LinkListData = {
  items: Array<{
    icon: string;
    label: string;
    url: string;
  }>;
};

export type EmbedData = {
  url: string;
  caption: string;
  type: "video" | "slides";
};

export type FormField = {
  name: string;
  type: string;
  placeholder: string;
  required: boolean;
};

export type FormData = {
  form_type: "contact" | "feedback" | "bookrec";
  fields: FormField[];
};

export type TimelineData = {
  entries: Array<{
    year: string;
    title: string;
    institution: string;
    description: string;
  }>;
};

export type BlockData =
  | CardData
  | RichTextData
  | LinkListData
  | EmbedData
  | FormData
  | TimelineData;

export type BlockRecord = {
  id: string;
  page: PageName;
  section: string;
  type: BlockType;
  order: number;
  is_public: boolean;
  data: BlockData;
  created_at: string;
  updated_at: string;
};

export type FormSubmissionRecord = {
  id: string;
  form_type: string;
  data: Record<string, unknown>;
  created_at: string;
};

export const pageLabels: Record<PageName, string> = {
  home: "Home",
  writing: "Writing",
  talks: "Talks",
  now: "Now",
  connect: "Connect"
};

export const pagePaths: Record<PageName, string> = {
  home: "/",
  writing: "/writing",
  talks: "/talks",
  now: "/now",
  connect: "/connect"
};
