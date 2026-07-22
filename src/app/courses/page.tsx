import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CourseCard } from "@/components/course/CourseCard";
import { CourseTable } from "@/components/course/CourseTable";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, KanbanSquare, Plus, FolderHeart } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    view?: string;
  }>;
}

export default async function CoursesPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentView = resolvedParams.view || "grid";

  const courses = await prisma.course.findMany({
    include: {
      resources: {
        select: {
          id: true,
          status: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <section className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FolderHeart className="h-8 w-8 text-[#0056D2]" />
            Khóa học của tôi
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Quản lý các tài nguyên học tập theo chủ đề chuyên sâu
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* View Toggles */}
          <div className="flex items-center border border-slate-200 bg-white rounded-lg p-0.5 shadow-sm">
            <Link 
              href="/courses?view=grid" 
              className={`p-1.5 rounded transition-colors ${currentView === "grid" ? "bg-[#EEF4FD] text-[#0056D2]" : "text-slate-400 hover:text-[#0056D2]"}`} 
              title="Xem dạng lưới"
            >
              <LayoutGrid className="h-4.5 w-4.5" />
            </Link>
            <Link 
              href="/courses?view=table" 
              className={`p-1.5 rounded transition-colors ${currentView === "table" ? "bg-[#EEF4FD] text-[#0056D2]" : "text-slate-400 hover:text-[#0056D2]"}`} 
              title="Xem bảng danh sách"
            >
              <List className="h-4.5 w-4.5" />
            </Link>
            <Link 
              href="/courses?view=board" 
              className={`p-1.5 rounded transition-colors ${currentView === "board" ? "bg-[#EEF4FD] text-[#0056D2]" : "text-slate-400 hover:text-[#0056D2]"}`} 
              title="Xem bảng kéo thả Kanban"
            >
              <KanbanSquare className="h-4.5 w-4.5" />
            </Link>
          </div>

          <Button asChild className="rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white shadow-md font-semibold">
            <Link href="/courses/new">
              <Plus className="mr-1.5 h-4 w-4" />
              Tạo khóa học
            </Link>
          </Button>
        </div>
      </div>

      {/* Grid Content / Table Content */}
      {courses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-16 text-center bg-white shadow-sm max-w-2xl mx-auto mt-8">
          <FolderHeart className="h-12 w-12 text-[#0056D2]/30 mx-auto mb-4" />
          <h4 className="text-lg font-bold text-slate-900">Chưa có khóa học nào</h4>
          <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
            Nhóm các tài liệu (PDF, URL) có chung chủ đề ôn tập vào một khóa học để dễ dàng học tập và kéo thả tiến độ.
          </p>
          <Button asChild className="mt-5 rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white font-semibold">
            <Link href="/courses/new">Bắt đầu tạo ngay</Link>
          </Button>
        </div>
      ) : currentView === "table" ? (
        <CourseTable courses={courses} />
      ) : currentView === "board" ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <KanbanSquare className="h-10 w-10 text-[#0056D2]/50 mx-auto mb-3" />
          <h4 className="font-bold text-slate-900">Bảng Kanban (Sắp ra mắt)</h4>
          <p className="text-xs text-slate-500 mt-1">Giao diện kéo thả Kanban sẽ được tích hợp trong Task tiếp theo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </section>
  );
}
