"use client";

import React from "react";
import { type Editor } from "@tiptap/react";
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered, 
  Quote, 
  Code,
  Undo,
  Redo
} from "lucide-react";

interface ToolbarProps {
  editor: Editor | null;
}

export function Toolbar({ editor }: ToolbarProps) {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 bg-slate-50 rounded-t-lg">
      {/* Bold */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1.5 rounded transition-all hover:bg-slate-200 text-slate-600 ${
          editor.isActive("bold") ? "bg-slate-200 text-[#0056D2]" : ""
        }`}
        title="In đậm (Ctrl+B)"
      >
        <Bold className="h-4 w-4" />
      </button>

      {/* Italic */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded transition-all hover:bg-slate-200 text-slate-600 ${
          editor.isActive("italic") ? "bg-slate-200 text-[#0056D2]" : ""
        }`}
        title="In nghiêng (Ctrl+I)"
      >
        <Italic className="h-4 w-4" />
      </button>

      <span className="w-[1px] h-4 bg-slate-200 mx-1 shrink-0" />

      {/* Heading 1 */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-1.5 rounded transition-all hover:bg-slate-200 text-slate-600 ${
          editor.isActive("heading", { level: 1 }) ? "bg-slate-200 text-[#0056D2]" : ""
        }`}
        title="Tiêu đề 1"
      >
        <Heading1 className="h-4 w-4" />
      </button>

      {/* Heading 2 */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1.5 rounded transition-all hover:bg-slate-200 text-slate-600 ${
          editor.isActive("heading", { level: 2 }) ? "bg-slate-200 text-[#0056D2]" : ""
        }`}
        title="Tiêu đề 2"
      >
        <Heading2 className="h-4 w-4" />
      </button>

      <span className="w-[1px] h-4 bg-slate-200 mx-1 shrink-0" />

      {/* Bullet List */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1.5 rounded transition-all hover:bg-slate-200 text-slate-600 ${
          editor.isActive("bulletList") ? "bg-slate-200 text-[#0056D2]" : ""
        }`}
        title="Danh sách gạch đầu dòng"
      >
        <List className="h-4 w-4" />
      </button>

      {/* Ordered List */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1.5 rounded transition-all hover:bg-slate-200 text-slate-600 ${
          editor.isActive("orderedList") ? "bg-slate-200 text-[#0056D2]" : ""
        }`}
        title="Danh sách số"
      >
        <ListOrdered className="h-4 w-4" />
      </button>

      <span className="w-[1px] h-4 bg-slate-200 mx-1 shrink-0" />

      {/* Blockquote */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-1.5 rounded transition-all hover:bg-slate-200 text-slate-600 ${
          editor.isActive("blockquote") ? "bg-slate-200 text-[#0056D2]" : ""
        }`}
        title="Trích dẫn"
      >
        <Quote className="h-4 w-4" />
      </button>

      {/* Code Block */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-1.5 rounded transition-all hover:bg-slate-200 text-slate-600 ${
          editor.isActive("codeBlock") ? "bg-slate-200 text-[#0056D2]" : ""
        }`}
        title="Khối code"
      >
        <Code className="h-4 w-4" />
      </button>

      <span className="w-[1px] h-4 bg-slate-200 mx-1 shrink-0" />

      {/* Undo */}
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        className="p-1.5 rounded transition-all hover:bg-slate-200 text-slate-600 disabled:opacity-40"
        disabled={!editor.can().undo()}
        title="Hoàn tác (Ctrl+Z)"
      >
        <Undo className="h-4 w-4" />
      </button>

      {/* Redo */}
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        className="p-1.5 rounded transition-all hover:bg-slate-200 text-slate-600 disabled:opacity-40"
        disabled={!editor.can().redo()}
        title="Làm lại (Ctrl+Y)"
      >
        <Redo className="h-4 w-4" />
      </button>
    </div>
  );
}
