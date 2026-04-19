import type { BlockRecord, BlockType, PageName } from "@/types/blocks";

export function createEmptyBlock(
  page: PageName,
  section: string,
  type: BlockType,
  order = 1
) {
  const base: Partial<BlockRecord> = {
    page,
    section,
    type,
    order,
    is_public: false
  };

  switch (type) {
    case "card":
      return {
        ...base,
        data: {
          title: "",
          institution: "",
          description: "",
          year: "",
          links: [],
          tags: [],
          thumbnail_url: ""
        }
      };
    case "richtext":
      return {
        ...base,
        data: {
          title: "",
          slug: "",
          date: "",
          excerpt: "",
          content: "<p></p>"
        }
      };
    case "linklist":
      return {
        ...base,
        data: {
          items: []
        }
      };
    case "embed":
      return {
        ...base,
        data: {
          url: "",
          caption: "",
          type: "video"
        }
      };
    case "form":
      return {
        ...base,
        data: {
          form_type: "contact",
          fields: []
        }
      };
    case "timeline":
      return {
        ...base,
        data: {
          entries: []
        }
      };
  }
}
