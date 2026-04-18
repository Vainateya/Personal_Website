"use client";

import { useEffect, useState } from "react";
import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";
import type {
  BlockData,
  BlockRecord,
  CardData,
  EmbedData,
  FormData,
  LinkListData,
  RichTextData,
  TimelineData
} from "@/types/blocks";

type BlockFormProps = {
  block: BlockRecord | null;
  onCancel: () => void;
  onSave: (block: BlockRecord) => Promise<void>;
};

function RichTextEditor({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link],
    content: value,
    editorProps: {
      attributes: {
        class: "tiptap prose-editorial",
        "data-placeholder": "Write here..."
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  return (
    <div className="space-y-2 border border-border bg-ivory p-3">
      <div className="flex flex-wrap gap-2 font-sans text-[10px] uppercase tracking-label text-warm-grey">
        <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()}>
          Bold
        </button>
        <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()}>
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          Bullets
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function toJsonString(value: unknown) {
  return Array.isArray(value) ? value.join(", ") : "";
}

export function BlockForm({ block, onCancel, onSave }: BlockFormProps) {
  const [draft, setDraft] = useState<BlockRecord | null>(block);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDraft(block);
  }, [block]);

  if (!draft) {
    return (
      <div className="border border-dashed border-border p-5">
        <p className="font-sans text-[11px] text-warm-grey">
          Select a block to edit or add a new block.
        </p>
      </div>
    );
  }

  function updateData(nextData: BlockData) {
    setDraft((current) => (current ? { ...current, data: nextData } : current));
  }

  async function handleSave() {
    if (!draft) {
      return;
    }

    setIsSaving(true);
    await onSave(draft);
    setIsSaving(false);
  }

  const data = draft.data;

  return (
    <div className="space-y-5 border border-border bg-ivory p-5">
      <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
        <div className="space-y-1">
          <p className="font-sans text-[10px] uppercase tracking-label text-stone">
            Edit block
          </p>
          <h2 className="font-serif text-[26px] font-normal tracking-editorial text-ink">
            {draft.type}
          </h2>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-2 font-sans text-[10px] uppercase tracking-label text-warm-grey hover:bg-mist"
        >
          Close
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="font-sans text-[10px] uppercase tracking-label text-stone">
            Section
          </span>
          <input
            value={draft.section}
            onChange={(event) =>
              setDraft((current) =>
                current ? { ...current, section: event.target.value } : current
              )
            }
          />
        </label>
        <label className="space-y-2">
          <span className="font-sans text-[10px] uppercase tracking-label text-stone">
            Visibility
          </span>
          <select
            value={draft.is_public ? "public" : "draft"}
            onChange={(event) =>
              setDraft((current) =>
                current
                  ? { ...current, is_public: event.target.value === "public" }
                  : current
              )
            }
          >
            <option value="draft">Draft</option>
            <option value="public">Public</option>
          </select>
        </label>
      </div>

      {draft.type === "card" ? (
        <CardFields data={data as CardData} onChange={updateData} />
      ) : null}
      {draft.type === "richtext" ? (
        <RichTextFields data={data as RichTextData} onChange={updateData} />
      ) : null}
      {draft.type === "linklist" ? (
        <LinkListFields data={data as LinkListData} onChange={updateData} />
      ) : null}
      {draft.type === "embed" ? (
        <EmbedFields data={data as EmbedData} onChange={updateData} />
      ) : null}
      {draft.type === "form" ? (
        <FormFields data={data as FormData} onChange={updateData} />
      ) : null}
      {draft.type === "timeline" ? (
        <TimelineFields data={data as TimelineData} onChange={updateData} />
      ) : null}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="border-prussian bg-prussian px-4 py-2 font-sans text-[10px] uppercase tracking-label text-ivory"
          disabled={isSaving}
        >
          {isSaving ? "Saving" : "Save block"}
        </button>
      </div>
    </div>
  );
}

function CardFields({
  data,
  onChange
}: {
  data: CardData;
  onChange: (value: CardData) => void;
}) {
  const links = data.links ?? [];
  const tags = data.tags ?? [];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <LabeledInput
          label="Title"
          value={data.title}
          onChange={(value) => onChange({ ...data, title: value })}
        />
        <LabeledInput
          label="Institution / Event"
          value={data.institution}
          onChange={(value) => onChange({ ...data, institution: value })}
        />
      </div>
      <LabeledTextarea
        label="Description"
        value={data.description}
        onChange={(value) => onChange({ ...data, description: value })}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <LabeledInput
          label="Year"
          value={data.year}
          onChange={(value) => onChange({ ...data, year: value })}
        />
        <LabeledInput
          label="Thumbnail URL"
          value={data.thumbnail_url}
          onChange={(value) => onChange({ ...data, thumbnail_url: value })}
        />
      </div>
      <LabeledInput
        label="Tags"
        value={toJsonString(tags)}
        onChange={(value) =>
          onChange({
            ...data,
            tags: value
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          })
        }
        hint="Comma-separated"
      />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-sans text-[10px] uppercase tracking-label text-stone">Links</p>
          <button
            type="button"
            onClick={() =>
              onChange({
                ...data,
                links: [...links, { label: "", url: "" }]
              })
            }
            className="px-3 py-2 font-sans text-[10px] uppercase tracking-label text-warm-grey hover:bg-mist"
          >
            Add link
          </button>
        </div>
        <div className="space-y-3">
          {links.map((link, index) => (
            <div key={index} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <input
                value={link.label}
                placeholder="Label"
                onChange={(event) => {
                  const nextLinks = [...links];
                  nextLinks[index] = { ...link, label: event.target.value };
                  onChange({ ...data, links: nextLinks });
                }}
              />
              <input
                value={link.url}
                placeholder="URL"
                onChange={(event) => {
                  const nextLinks = [...links];
                  nextLinks[index] = { ...link, url: event.target.value };
                  onChange({ ...data, links: nextLinks });
                }}
              />
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...data,
                    links: links.filter((_, itemIndex) => itemIndex !== index)
                  })
                }
                className="px-3 py-2 font-sans text-[10px] uppercase tracking-label text-[#8b3a2e] hover:bg-mist"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RichTextFields({
  data,
  onChange
}: {
  data: RichTextData;
  onChange: (value: RichTextData) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <LabeledInput
          label="Title"
          value={data.title ?? ""}
          onChange={(value) => onChange({ ...data, title: value })}
        />
        <LabeledInput
          label="Slug"
          value={data.slug ?? ""}
          onChange={(value) => onChange({ ...data, slug: value })}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <LabeledInput
          label="Date"
          value={data.date ?? ""}
          onChange={(value) => onChange({ ...data, date: value })}
        />
        <LabeledInput
          label="Excerpt"
          value={data.excerpt ?? ""}
          onChange={(value) => onChange({ ...data, excerpt: value })}
        />
      </div>
      <div className="space-y-2">
        <p className="font-sans text-[10px] uppercase tracking-label text-stone">
          Content
        </p>
        <RichTextEditor
          value={data.content}
          onChange={(value) => onChange({ ...data, content: value })}
        />
      </div>
    </div>
  );
}

function LinkListFields({
  data,
  onChange
}: {
  data: LinkListData;
  onChange: (value: LinkListData) => void;
}) {
  const items = data.items ?? [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-sans text-[10px] uppercase tracking-label text-stone">Links</p>
        <button
          type="button"
          onClick={() =>
            onChange({
              ...data,
              items: [...items, { icon: "", label: "", url: "" }]
            })
          }
          className="px-3 py-2 font-sans text-[10px] uppercase tracking-label text-warm-grey hover:bg-mist"
        >
          Add item
        </button>
      </div>
      {items.map((item, index) => (
        <div key={index} className="grid gap-3 md:grid-cols-[120px_1fr_1fr_auto]">
          <input
            value={item.icon}
            placeholder="Icon"
            onChange={(event) => {
              const nextItems = [...items];
              nextItems[index] = { ...item, icon: event.target.value };
              onChange({ ...data, items: nextItems });
            }}
          />
          <input
            value={item.label}
            placeholder="Label"
            onChange={(event) => {
              const nextItems = [...items];
              nextItems[index] = { ...item, label: event.target.value };
              onChange({ ...data, items: nextItems });
            }}
          />
          <input
            value={item.url}
            placeholder="URL"
            onChange={(event) => {
              const nextItems = [...items];
              nextItems[index] = { ...item, url: event.target.value };
              onChange({ ...data, items: nextItems });
            }}
          />
          <button
            type="button"
            onClick={() =>
              onChange({
                ...data,
                items: items.filter((_, itemIndex) => itemIndex !== index)
              })
            }
            className="px-3 py-2 font-sans text-[10px] uppercase tracking-label text-[#8b3a2e] hover:bg-mist"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

function EmbedFields({
  data,
  onChange
}: {
  data: EmbedData;
  onChange: (value: EmbedData) => void;
}) {
  return (
    <div className="space-y-4">
      <LabeledInput
        label="URL"
        value={data.url}
        onChange={(value) => onChange({ ...data, url: value })}
      />
      <LabeledInput
        label="Caption"
        value={data.caption}
        onChange={(value) => onChange({ ...data, caption: value })}
      />
      <label className="space-y-2">
        <span className="font-sans text-[10px] uppercase tracking-label text-stone">
          Embed type
        </span>
        <select
          value={data.type}
          onChange={(event) =>
            onChange({ ...data, type: event.target.value as EmbedData["type"] })
          }
        >
          <option value="video">Video</option>
          <option value="slides">Slides</option>
        </select>
      </label>
    </div>
  );
}

function FormFields({
  data,
  onChange
}: {
  data: FormData;
  onChange: (value: FormData) => void;
}) {
  const fields = data.fields ?? [];

  return (
    <div className="space-y-4">
      <label className="space-y-2">
        <span className="font-sans text-[10px] uppercase tracking-label text-stone">
          Form type
        </span>
        <select
          value={data.form_type}
          onChange={(event) =>
            onChange({
              ...data,
              form_type: event.target.value as FormData["form_type"]
            })
          }
        >
          <option value="contact">Contact</option>
          <option value="feedback">Feedback</option>
          <option value="bookrec">Book Recommendation</option>
        </select>
      </label>
      <div className="flex items-center justify-between">
        <p className="font-sans text-[10px] uppercase tracking-label text-stone">Fields</p>
        <button
          type="button"
          onClick={() =>
            onChange({
              ...data,
              fields: [
                ...fields,
                { name: "", type: "text", placeholder: "", required: false }
              ]
            })
          }
          className="px-3 py-2 font-sans text-[10px] uppercase tracking-label text-warm-grey hover:bg-mist"
        >
          Add field
        </button>
      </div>
      {fields.map((field, index) => (
        <div key={index} className="grid gap-3 md:grid-cols-[1fr_120px_1fr_auto_auto]">
          <input
            value={field.name}
            placeholder="Name"
            onChange={(event) => {
              const nextFields = [...fields];
              nextFields[index] = { ...field, name: event.target.value };
              onChange({ ...data, fields: nextFields });
            }}
          />
          <input
            value={field.type}
            placeholder="Type"
            onChange={(event) => {
              const nextFields = [...fields];
              nextFields[index] = { ...field, type: event.target.value };
              onChange({ ...data, fields: nextFields });
            }}
          />
          <input
            value={field.placeholder}
            placeholder="Placeholder"
            onChange={(event) => {
              const nextFields = [...fields];
              nextFields[index] = { ...field, placeholder: event.target.value };
              onChange({ ...data, fields: nextFields });
            }}
          />
          <label className="flex items-center gap-2 border border-border px-3 py-2 font-sans text-[10px] uppercase tracking-label text-warm-grey">
            <input
              type="checkbox"
              checked={field.required}
              className="h-4 w-4"
              onChange={(event) => {
                const nextFields = [...fields];
                nextFields[index] = { ...field, required: event.target.checked };
                onChange({ ...data, fields: nextFields });
              }}
            />
            Required
          </label>
          <button
            type="button"
            onClick={() =>
              onChange({
                ...data,
                fields: fields.filter((_, itemIndex) => itemIndex !== index)
              })
            }
            className="px-3 py-2 font-sans text-[10px] uppercase tracking-label text-[#8b3a2e] hover:bg-mist"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

function TimelineFields({
  data,
  onChange
}: {
  data: TimelineData;
  onChange: (value: TimelineData) => void;
}) {
  const entries = data.entries ?? [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-sans text-[10px] uppercase tracking-label text-stone">
          Timeline entries
        </p>
        <button
          type="button"
          onClick={() =>
            onChange({
              ...data,
              entries: [
                ...entries,
                { year: "", title: "", institution: "", description: "" }
              ]
            })
          }
          className="px-3 py-2 font-sans text-[10px] uppercase tracking-label text-warm-grey hover:bg-mist"
        >
          Add entry
        </button>
      </div>
      {entries.map((entry, index) => (
        <div key={index} className="space-y-3 border border-border p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={entry.year}
              placeholder="Year"
              onChange={(event) => {
                const nextEntries = [...entries];
                nextEntries[index] = { ...entry, year: event.target.value };
                onChange({ ...data, entries: nextEntries });
              }}
            />
            <input
              value={entry.institution}
              placeholder="Institution"
              onChange={(event) => {
                const nextEntries = [...entries];
                nextEntries[index] = { ...entry, institution: event.target.value };
                onChange({ ...data, entries: nextEntries });
              }}
            />
          </div>
          <input
            value={entry.title}
            placeholder="Title"
            onChange={(event) => {
              const nextEntries = [...entries];
              nextEntries[index] = { ...entry, title: event.target.value };
              onChange({ ...data, entries: nextEntries });
            }}
          />
          <textarea
            value={entry.description}
            placeholder="Description"
            onChange={(event) => {
              const nextEntries = [...entries];
              nextEntries[index] = { ...entry, description: event.target.value };
              onChange({ ...data, entries: nextEntries });
            }}
          />
          <button
            type="button"
            onClick={() =>
              onChange({
                ...data,
                entries: entries.filter((_, itemIndex) => itemIndex !== index)
              })
            }
            className="px-3 py-2 font-sans text-[10px] uppercase tracking-label text-[#8b3a2e] hover:bg-mist"
          >
            Remove entry
          </button>
        </div>
      ))}
    </div>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  hint
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}) {
  return (
    <label className="space-y-2">
      <span className="font-sans text-[10px] uppercase tracking-label text-stone">
        {label}
      </span>
      <input value={value} onChange={(event) => onChange(event.target.value)} />
      {hint ? <span className="block font-sans text-[11px] text-warm-grey">{hint}</span> : null}
    </label>
  );
}

function LabeledTextarea({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="font-sans text-[10px] uppercase tracking-label text-stone">
        {label}
      </span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
