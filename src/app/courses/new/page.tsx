"use client";

import React, { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { createCourse } from "../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewCoursePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as "ACTIVE" | "DRAFT" | "ARCHIVED";

    if (!title || !title.trim()) {
      setError("Vui lòng nhập tên khóa học");
      return;
    }

    startTransition(async () => {
      try {
        const res = await createCourse({
          title: title.trim(),
          description: description?.trim() || null,
          status,
        });

        if (res.success) {
          router.push("/courses");
          router.refresh();
        } else {
          setError("Tạo khóa học thất bại. Vui lòng thử lại.");
        }
      } catch (err: any) {
        setError(err.message || "Đã xảy ra lỗi hệ thống.");
      }
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Link href="/courses" className="inline-flex items-center gap-1.5 text-sm text-[#0056D2] font-semibold hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Quay lại danh sách
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Tạo khóa học mới</CardTitle>
          <CardDescription>
            Nhóm các tài liệu học tập theo từng chủ đề hoặc chứng chỉ cụ thể.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-semibold">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="title" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Tên khóa học *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Ví dụ: Lập trình ReactJS căn bản"
                className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2]"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="description" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Mô tả khóa học
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Mô tả mục tiêu học tập, tài liệu ôn tập..."
                className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2]"
                disabled={isPending}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="status" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Trạng thái hoạt động
              </label>
              <select
                id="status"
                name="status"
                defaultValue="ACTIVE"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2]"
                disabled={isPending}
              >
                <option value="ACTIVE">Đang mở (Active)</option>
                <option value="DRAFT">Bản nháp (Draft)</option>
                <option value="ARCHIVED">Lưu trữ (Archived)</option>
              </select>
            </div>

            <div className="pt-3 flex justify-end gap-3">
              <Button asChild variant="outline" className="rounded-lg" disabled={isPending}>
                <Link href="/courses">Hủy</Link>
              </Button>
              <Button 
                type="submit" 
                className="rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white shadow-md font-semibold"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  "Tạo khóa học"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
