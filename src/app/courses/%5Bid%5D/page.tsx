import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { KanbanBoard } from "@/components/course/KanbanBoard";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  LayoutGrid, 
  List, 
  KanbanSquare, 
  FileText, 
  Video, 
  ExternalLink,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

export const dynamic = "force-dynamic";

interface CourseDetailPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    view?: string;
  }>;
}

export default async function CourseDetailPage({ params, searchParams }: CourseDetailPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const courseId = resolvedParams.id;
  const currentView = resolvedSearchParams.view || "grid";

  // Fetch course details with resources
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      resources: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  const totalResources = course.resources.length;
  const completedResources = course.resources.filter(r => r.status === "DONE" || r.status === "COMPLETED").length;
  const progressPercent = totalResources > 0 ? Math.round((completedResources / totalResources) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link href="/courses" className="inline-flex items-center gap-1.5 text-sm text-[#0056D2] font-semibold hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Quay lại danh sách khóa học
      </Link>

      {/* Course Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#0056D2] bg-[#EEF4FD] px-2.5 py-1 rounded-full">
              Khóa học
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {course.title}
          </h1>
          {course.description && (
            <p className="text-slate-500 text-sm max-w-xl leading-relaxed">
              {course.description}
            </p>
          )}
        </div>

        {/* Course Statistics Panel */}
        <div className="w-full md:w-72 bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 shrink-0">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span>Tiến độ học tập</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#0056D2] rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {totalResources} bài học
            </span>
            <span className="flex items-center gap-1 text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {completedResources} đã học xong
            </span>
          </div>
        </div>
      </div>

      {/* View Selector Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h3 className="font-bold text-slate-800 text-lg">
          Nội dung học tập
        </h3>

        <div className="flex items-center border border-slate-200 bg-white rounded-lg p-0.5 shadow-sm">
          <Link 
            href={`/courses/${courseId}?view=grid`} 
            className={`p-1.5 rounded transition-colors ${currentView === "grid" ? "bg-[#EEF4FD] text-[#0056D2]" : "text-slate-400 hover:text-[#0056D2]"}`} 
            title="Xem dạng thẻ"
          >
            <LayoutGrid className="h-4.5 w-4.5" />
          </Link>
          <Link 
            href={`/courses/${courseId}?view=table`} 
            className={`p-1.5 rounded transition-colors ${currentView === "table" ? "bg-[#EEF4FD] text-[#0056D2]" : "text-slate-400 hover:text-[#0056D2]"}`} 
            title="Xem dạng danh sách"
          >
            <List className="h-4.5 w-4.5" />
          </Link>
          <Link 
            href={`/courses/${courseId}?view=board`} 
            className={`p-1.5 rounded transition-colors ${currentView === "board" ? "bg-[#EEF4FD] text-[#0056D2]" : "text-slate-400 hover:text-[#0056D2]"}`} 
            title="Xem bảng kéo thả Kanban"
          >
            <KanbanSquare className="h-4.5 w-4.5" />
          </Link>
        </div>
      </div>

      {/* View Rendering */}
      {totalResources === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm max-w-lg mx-auto">
          <BookOpen className="h-10 w-10 text-[#0056D2]/30 mx-auto mb-3" />
          <h4 className="font-bold text-slate-900">Khóa học này chưa có tài liệu</h4>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Bạn có thể thêm tài liệu từ Thư viện vào khóa học này, hoặc chọn gửi tài liệu trực tiếp qua Telegram Bot.
          </p>
          <Button asChild className="mt-4 rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white">
            <Link href="/library">Ghé thăm thư viện</Link>
          </Button>
        </div>
      ) : currentView === "board" ? (
        <KanbanBoard course={course} initialResources={course.resources} />
      ) : currentView === "table" ? (
        /* Table View of Resources inside Course */
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold text-slate-500 border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4">Tên bài học</th>
                  <th scope="col" className="px-6 py-4">Loại học liệu</th>
                  <th scope="col" className="px-6 py-4">Nguồn</th>
                  <th scope="col" className="px-6 py-4">Trạng thái ôn tập</th>
                  <th scope="col" className="px-6 py-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {course.resources.map((resource) => {
                  const Icon = resource.source === "YOUTUBE" ? Video : FileText;
                  
                  return (
                    <tr key={resource.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">{resource.title}</td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5">
                          <Icon className={`h-4 w-4 ${resource.source === "YOUTUBE" ? "text-red-500" : "text-[#0056D2]"}`} />
                          {resource.type === "VIDEO" ? "Video bài giảng" : "Tài liệu văn bản"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">{resource.source}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`text-[10px] uppercase font-semibold py-0.5 px-2 ${
                          resource.status === "DONE" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                          resource.status === "IN_PROGRESS" ? "bg-blue-50 text-blue-700 border-blue-200" :
                          "bg-slate-50 text-slate-700 border-slate-200"
                        }`}>
                          {resource.status === "DONE" ? "Đã học xong" : resource.status === "IN_PROGRESS" ? "Đang học" : "Chờ học"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link 
                          href={`/resource/${resource.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#0056D2] hover:underline"
                        >
                          Học ngay
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View of Resources inside Course */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {course.resources.map((resource) => {
            const Icon = resource.source === "YOUTUBE" ? Video : FileText;

            return (
              <Card key={resource.id} className="hover:border-slate-300 transition-shadow">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 border border-slate-100">
                        <Icon className={`h-4.5 w-4.5 ${resource.source === "YOUTUBE" ? "text-red-500" : "text-[#0056D2]"}`} />
                      </span>
                      <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-wider py-0.5 px-2 ${
                        resource.status === "DONE" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        resource.status === "IN_PROGRESS" ? "bg-blue-50 text-blue-700 border-blue-200" :
                        "bg-slate-50 text-slate-700 border-slate-200"
                      }`}>
                        {resource.status === "DONE" ? "Đã xong" : resource.status === "IN_PROGRESS" ? "Đang học" : "Chờ học"}
                      </Badge>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-relaxed">
                      {resource.title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {resource.source}
                    </span>
                    <Link 
                      href={`/resource/${resource.id}`}
                      className="inline-flex items-center gap-0.5 text-xs font-bold text-[#0056D2] hover:underline"
                    >
                      Mở bài học
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
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
