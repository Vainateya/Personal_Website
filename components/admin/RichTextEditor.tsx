"use client";

import { useEffect } from "react";
import ImageExt from "@tiptap/extension-image";
import LinkExt from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

function Btn({
  active,
  onClick,
  children
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`px-2 py-1 font-sans text-[10px] uppercase tracking-label transition-colors ${
        active ? "bg-prussian text-ivory" : "text-warm-grey hover:bg-mist hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      LinkExt.configure({ openOnClick: false }),
      ImageExt.configure({ inline: false, allowBase64: false })
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "tiptap prose-editorial",
        "data-placeholder": "Write here…"
      }
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML())
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  function addLink() {
    const url = window.prompt("Enter URL");
    if (!url) return;
    editor?.chain().focus().toggleLink({ href: url }).run();
  }

  function addImage() {
    const url = window.prompt("Image URL");
    if (!url) return;
    const alt = window.prompt("Alt text / caption") ?? "";
    editor?.chain().focus().setImage({ src: url, alt, title: alt }).run();
  }

  return (
    <div className="border border-border bg-ivory">
      <div className="flex flex-wrap gap-px border-b border-border p-1.5">
        <Btn active={editor?.isActive("bold")} onClick={() => editor?.chain().focus().toggleBold().run()}>B</Btn>
        <Btn active={editor?.isActive("italic")} onClick={() => editor?.chain().focus().toggleItalic().run()}>I</Btn>
        <span className="mx-1 w-px self-stretch bg-border" />
        <Btn active={editor?.isActive("heading", { level: 2 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>H2</Btn>
        <Btn active={editor?.isActive("heading", { level: 3 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>H3</Btn>
        <span className="mx-1 w-px self-stretch bg-border" />
        <Btn active={editor?.isActive("bulletList")} onClick={() => editor?.chain().focus().toggleBulletList().run()}>• List</Btn>
        <Btn active={editor?.isActive("orderedList")} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>1. List</Btn>
        <span className="mx-1 w-px self-stretch bg-border" />
        <Btn active={editor?.isActive("link")} onClick={addLink}>Link</Btn>
        <Btn onClick={addImage}>Image</Btn>
      </div>
      <div className="p-3">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
