import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, CheckCircle2, Circle } from "lucide-react";

interface Resource {
  id: string;
  status: string;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  status: string;
  resources: Resource[];
}

export function CourseCard({ course }: { course: Course }) {
  const totalResources = course.resources.length;
  const completedResources = course.resources.filter(r => r.status === "COMPLETED").length;
  const progressPercent = totalResources > 0 ? Math.round((completedResources / totalResources) * 100) : 0;

  // Status badge styling
  const statusColors: Record<string, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
    DRAFT: "bg-slate-50 text-slate-700 border-slate-200",
    ARCHIVED: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <Card className="hover:border-slate-300 transition-all duration-200">
      <Link href={`/courses/${course.id}`} className="block h-full flex flex-col justify-between">
        <div>
          {/* Flat Thumbnail Header placeholder matching Coursera Blue style */}
          <div className="h-28 w-full bg-[#0056D2]/5 border-b border-slate-100 flex items-center justify-center rounded-t-lg -mx-5 -mt-5 mb-4 shrink-0">
            <FolderOpen className="h-10 w-10 text-[#0056D2]/60" />
          </div>

          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="text-base font-bold text-slate-900 group-hover:text-[#0056D2] line-clamp-1 transition-colors">
              {course.title}
            </h4>
            <Badge variant="outline" className={`text-[10px] uppercase tracking-wider font-semibold py-0.5 px-2 ${statusColors[course.status] || statusColors.ACTIVE}`}>
              {course.status === "ACTIVE" ? "Đang mở" : course.status === "DRAFT" ? "Nháp" : "Lưu trữ"}
            </Badge>
          </div>

          {course.description && (
            <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
              {course.description}
            </p>
          )}
        </div>

        <div className="space-y-3 pt-3 border-t border-slate-100 mt-4">
          {/* Progress Indicator */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Tiến độ</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#0056D2] rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Counts */}
          <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <Circle className="h-3.5 w-3.5 text-slate-400 fill-current" />
              {totalResources} bài học
            </span>
            <span className="flex items-center gap-1 text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {completedResources} hoàn thành
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}
