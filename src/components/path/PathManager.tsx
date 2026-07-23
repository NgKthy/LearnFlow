"use client";

import React, { useState, useTransition, useEffect } from "react";
import { createPath, updatePath } from "@/app/paths/actions";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Map, 
  X, 
  Check, 
  Loader2, 
  Save,
  FolderOpen
} from "lucide-react";
import { useRouter } from "next/navigation";

interface CourseOption {
  id: string;
  title: string;
}

interface PathData {
  id: string;
  title: string;
  description: string | null;
  courses: { id: string }[];
}

interface PathManagerProps {
  courses: CourseOption[];
  editingPath: PathData | null;
  onClearEdit: () => void;
}

export function PathManager({ courses, editingPath, onClearEdit }: PathManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);

  // Hydrate editing data
  useEffect(() => {
    if (editingPath) {
      setTitle(editingPath.title);
      setDescription(editingPath.description || "");
      setSelectedCourseIds(editingPath.courses.map(c => c.id));
    } else {
      setTitle("");
      setDescription("");
      setSelectedCourseIds([]);
    }
  }, [editingPath]);

  const handleCourseToggle = (courseId: string) => {
    setSelectedCourseIds((prev) => 
      prev.includes(courseId) 
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) return;

    startTransition(async () => {
      try {
        if (editingPath) {
          // Update
          const res = await updatePath(editingPath.id, {
            title,
            description: description || undefined,
            courseIds: selectedCourseIds,
          });
          if (res.success) {
            onClearEdit();
            router.refresh();
          }
        } else {
          // Create
          const res = await createPath({
            title,
            description: description || undefined,
            courseIds: selectedCourseIds,
          });
          if (res.success) {
            setTitle("");
            setDescription("");
            setSelectedCourseIds([]);
            router.refresh();
          }
        }
      } catch (err: any) {
        setError(err.message || "Không thể lưu lộ trình.");
      }
    });
  };

  return (
    <Card className="border border-slate-200 bg-white shadow-sm rounded-xl">
      <CardHeader className="border-b border-slate-100 py-4 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
            <Map className="h-4.5 w-4.5 text-[#0056D2]" />
            {editingPath ? "Cập nhật Lộ trình" : "Tạo Lộ trình mới"}
          </CardTitle>
          <CardDescription className="text-[10px] text-slate-500">
            Kết nối các khóa học chủ đề riêng biệt thành một lộ trình hoàn thiện.
          </CardDescription>
        </div>

        {editingPath && (
          <Button
            size="icon"
            variant="ghost"
            onClick={onClearEdit}
            className="h-6 w-6 text-slate-400 hover:text-slate-600 rounded"
            title="Hủy sửa"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label htmlFor="path_title" className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              Tên lộ trình *
            </label>
            <input
              id="path_title"
              type="text"
              placeholder="Ví dụ: Lập trình viên React & NextJS"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#0056D2]"
              disabled={isPending}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label htmlFor="path_desc" className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              Mô tả ngắn
            </label>
            <textarea
              id="path_desc"
              rows={2}
              placeholder="Tóm tắt mục tiêu lộ trình..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#0056D2] resize-none"
              disabled={isPending}
            />
          </div>

          {/* Courses checkboxes selection list */}
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Các khóa học trong lộ trình ({selectedCourseIds.length})
            </label>

            {courses.length === 0 ? (
              <p className="text-[10px] text-slate-500 font-semibold italic bg-slate-50 border border-slate-100 rounded p-3">
                Không tìm thấy khóa học đang hoạt động nào. Hãy tạo khóa học trước.
              </p>
            ) : (
              <div className="border border-slate-200 rounded-lg max-h-[140px] overflow-y-auto divide-y divide-slate-100 bg-white">
                {courses.map((course) => {
                  const isChecked = selectedCourseIds.includes(course.id);
                  return (
                    <div 
                      key={course.id}
                      onClick={() => handleCourseToggle(course.id)}
                      className="p-2.5 flex items-center justify-between gap-3 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 truncate">
                        <FolderOpen className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {course.title}
                      </span>
                      <div className={`h-4.5 w-4.5 border rounded flex items-center justify-center transition-all ${
                        isChecked 
                          ? "bg-[#0056D2] border-[#0056D2] text-white" 
                          : "border-slate-300 bg-white"
                      }`}>
                        {isChecked && <Check className="h-3 w-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isPending || !title.trim()}
            className="w-full rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white text-xs font-semibold py-1.5 flex items-center justify-center gap-1"
          >
            {isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : editingPath ? (
              <>
                <Save className="h-3.5 w-3.5" />
                Lưu cập nhật
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                Tạo lộ trình
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
