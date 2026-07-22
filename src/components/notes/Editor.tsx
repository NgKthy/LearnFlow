"use client";

import React, { useEffect, useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Toolbar } from "./Toolbar";
import { saveNote } from "@/app/resource/actions";
import { Loader2, CloudCheck, Check, AlertCircle } from "lucide-react";

interface EditorProps {
  resourceId: string;
  initialContent: string;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function Editor({ resourceId, initialContent }: EditorProps) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose max-w-none focus:outline-none min-h-[300px] max-h-[500px] overflow-y-auto px-4 py-3 bg-white text-slate-800",
      },
    },
    onUpdate: ({ editor }) => {
      setSaveStatus("saving");

      // Clear previous timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Debounce saving note for 1.5 seconds
      saveTimeoutRef.current = setTimeout(async () => {
        const html = editor.getHTML();
        try {
          const res = await saveNote(resourceId, html);
          if (res.success) {
            setSaveStatus("saved");
            // Clear status back to idle after a few seconds
            setTimeout(() => {
              setSaveStatus((current) => current === "saved" ? "idle" : current);
            }, 3000);
          } else {
            setSaveStatus("error");
          }
        } catch (err) {
          console.error("[NoteEditor] Autosave failed:", err);
          setSaveStatus("error");
        }
      }, 1500);
    },
  });

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  if (!editor) {
    return (
      <div className="flex items-center justify-center p-12 border border-slate-200 rounded-lg bg-white">
        <Loader2 className="h-6 w-6 animate-spin text-[#0056D2]" />
        <span className="text-sm font-semibold text-slate-500 ml-2">
          Đang khởi tạo khung ghi chép...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col border border-slate-200 rounded-lg shadow-sm bg-white overflow-hidden">
      {/* Editor Toolbar */}
      <Toolbar editor={editor} />

      {/* Editor Content Area */}
      <div className="relative border-b border-slate-100">
        <EditorContent editor={editor} />
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-semibold border-t border-slate-100">
        <span>Tự động lưu ghi chép</span>
        
        <div className="flex items-center gap-1.5 font-bold">
          {saveStatus === "saving" && (
            <span className="flex items-center gap-1 text-[#0056D2]">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Đang tự động lưu...
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="flex items-center gap-1 text-emerald-600">
              <Check className="h-3.5 w-3.5" />
              Đã lưu thay đổi
            </span>
          )}
          {saveStatus === "error" && (
            <span className="flex items-center gap-1 text-red-500">
              <AlertCircle className="h-3.5 w-3.5" />
              Lỗi khi lưu!
            </span>
          )}
          {saveStatus === "idle" && (
            <span className="flex items-center gap-1 text-slate-400">
              Sẵn sàng ghi chép
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
