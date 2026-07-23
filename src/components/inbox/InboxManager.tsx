"use client";

import React, { useState, useTransition } from "react";
import { assignInboxResource, deleteInboxResource } from "@/app/inbox/actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Video, 
  Trash2, 
  FolderPlus, 
  ExternalLink,
  Loader2,
  CheckCircle2,
  Inbox
} from "lucide-react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

interface Course {
  id: string;
  title: string;
}

interface Resource {
  id: string;
  title: string;
  url: string;
  source: string;
  type: string;
  createdAt: Date | string;
}

interface InboxManagerProps {
  resources: Resource[];
  courses: Course[];
}

export function InboxManager({ resources, courses }: InboxManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedCourses, setSelectedCourses] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const handleCourseSelect = (resourceId: string, courseId: string) => {
    setSelectedCourses(prev => ({ ...prev, [resourceId]: courseId }));
  };

  const handleAssign = (resourceId: string) => {
    const courseId = selectedCourses[resourceId];
    if (!courseId) return;

    setError(null);
    startTransition(async () => {
      try {
        const res = await assignInboxResource(resourceId, courseId);
        if (res.success) {
          router.refresh();
        }
      } catch (err: any) {
        setError(err.message || "Không thể gắn khóa học.");
      }
    });
  };

  const handleDelete = (resourceId: string) => {
    if (!confirm("Bạn có chắc muốn xóa học liệu thô này khỏi hòm thư?")) return;

    setError(null);
    startTransition(async () => {
      try {
        const res = await deleteInboxResource(resourceId);
        if (res.success) {
          router.refresh();
        }
      } catch (err: any) {
        setError(err.message || "Xóa thất bại.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-semibold max-w-xl">
          {error}
        </div>
      )}

      {resources.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-16 text-center bg-white shadow-sm max-w-2xl mx-auto mt-8">
          <Inbox className="h-12 w-12 text-[#0056D2]/30 mx-auto mb-4" />
          <h4 className="text-lg font-bold text-slate-900">Hòm thư trống</h4>
          <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
            Mọi bài viết gửi qua Telegram Bot đã được phân loại hoặc hòm thư chưa nhận được tài nguyên thô nào.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {resources.map((resource) => {
            const Icon = resource.source === "YOUTUBE" ? Video : FileText;
            const chosenCourse = selectedCourses[resource.id] || "";

            return (
              <Card key={resource.id} className="hover:border-slate-300 transition-colors">
                <div className="p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  {/* Info details */}
                  <div className="space-y-2.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 border border-slate-100 shrink-0">
                        <Icon className={`h-4 w-4 ${resource.source === "YOUTUBE" ? "text-red-500" : "text-[#0056D2]"}`} />
                      </span>
                      <Badge variant="outline" className="text-[10px] uppercase font-semibold py-0.5 px-2 bg-slate-50 text-slate-500">
                        {resource.source}
                      </Badge>
                      <span className="text-xs font-semibold text-slate-500">
                        Đã nhận: {dayjs(resource.createdAt).format("DD/MM/YYYY")}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-slate-900 leading-snug">
                        {resource.title}
                      </h4>
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-[#0056D2] font-medium"
                      >
                        Chuyển tiếp nguồn link
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  {/* Actions wrapper */}
                  <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                    {/* Course selector */}
                    <div className="relative">
                      <select
                        value={chosenCourse}
                        onChange={(e) => handleCourseSelect(resource.id, e.target.value)}
                        className="w-full sm:w-56 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0056D2]"
                        disabled={isPending || courses.length === 0}
                      >
                        <option value="">-- Chọn khóa học học tập --</option>
                        {courses.map(c => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                    </div>

                    {/* Submit / delete */}
                    <div className="flex items-center gap-2.5">
                      <Button
                        onClick={() => handleAssign(resource.id)}
                        disabled={isPending || !chosenCourse}
                        className="flex-1 sm:flex-initial rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white font-semibold text-xs py-1.5 px-3.5"
                      >
                        {isPending ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <>
                            <FolderPlus className="mr-1 h-3.5 w-3.5" />
                            Phân loại
                          </>
                        )}
                      </Button>

                      <Button
                        onClick={() => handleDelete(resource.id)}
                        disabled={isPending}
                        variant="outline"
                        className="rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 border-slate-200 p-2"
                        title="Loại bỏ học liệu"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
