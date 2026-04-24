"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";

import {
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Eraser,
} from "lucide-react";

export default function JobDescriptionEditor({ value, onChange }) {
  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],

    content: value || "",

    editorProps: {
      attributes: {
        class: "min-h-[200px] p-4 focus:outline-none prose max-w-none",
      },
    },

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border rounded-md bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b p-2 bg-gray-50">
        <IconButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={16} />
        </IconButton>

        <IconButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={16} />
        </IconButton>

        <IconButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={16} />
        </IconButton>

        <IconButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={16} />
        </IconButton>

        <IconButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft size={16} />
        </IconButton>

        <IconButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter size={16} />
        </IconButton>

        <IconButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight size={16} />
        </IconButton>

        <IconButton
          onClick={() => {
            const url = prompt("Enter URL");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
        >
          <LinkIcon size={16} />
        </IconButton>

        <IconButton
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
        >
          <Eraser size={16} />
        </IconButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}

function IconButton({ children, onClick, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded-md border transition ${
        active ? "bg-black text-white" : "bg-white hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}
