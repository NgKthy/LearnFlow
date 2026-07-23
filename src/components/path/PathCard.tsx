"use client";

import React, { useTransition } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deletePath } from "@/app/paths/actions";
import { useRouter } from "next/navigation";
import { 
  Route, 
  Trash2, 
  Edit2, 
  BookOpen, 
  CheckCircle2, 
  MapPin, 
  Layers 
} from "lucide-react";

interface Resource {
  status: string;
}

interface Course {
  id: string;
  title: string;
  resources: Resource[];
}

interface PathCardProps {
  path: {
    id: string;
    title: string;
    description: string | null;
    courses: Course[];
  };
  onEdit: () => void;
}

export function PathCard({ path, onEdit }: PathCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Aggregate resources statistics
  let totalResources = 0;
  let completedResources = 0;

  path.courses.forEach((course) => {
    totalResources += course.resources.length;
    completedResources += course.resources.filter((r) => r.status === "DONE").length;
  });

  const progress = totalResources > 0 ? Math.round((completedResources / totalResources) * 100) : 0;

  const handleDelete = () => {
    if (!confirm("Bạn có chắc chắn muốn xóa lộ trình này? Các khóa học liên quan sẽ không bị ảnh hưởng.")) return;

    startTransition(async () => {
      try {
        const res = await deletePath(path.id);
        if (res.success) {
          router.refresh();
        }
      } catch (err: any) {
        alert(err.message || "Xóa lộ trình thất bại.");
      }
    });
  };

  return (
    <Card className="border border-slate-200 bg-white shadow-sm rounded-xl overflow-hidden flex flex-col justify-between">
      <CardHeader className="border-b border-slate-100 py-4 flex flex-row items-start justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <Badge className="bg-blue-50 text-[#0056D2] border border-blue-100 hover:bg-blue-50 rounded text-[10px] font-bold px-1.5 py-0.5 flex items-center gap-1 w-max">
            <Route className="h-3 w-3" />
            Lộ trình học
          </Badge>
          <CardTitle className="text-sm font-bold text-slate-900 truncate">
            {path.title}
          </CardTitle>
          {path.description && (
            <p className="text-[10px] text-slate-500 font-semibold leading-relaxed line-clamp-2">
              {path.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            size="icon"
            variant="ghost"
            onClick={onEdit}
            disabled={isPending}
            className="h-7 w-7 text-slate-400 hover:text-slate-700 rounded"
            title="Sửa lộ trình"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleDelete}
            disabled={isPending}
            className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
            title="Xóa lộ trình"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-4 flex-1 flex flex-col justify-between gap-4">
        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
            <span>Tiến trình lộ trình</span>
            <span className="text-[#0056D2]">{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#0056D2] rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
            <span className="flex items-center gap-0.5">
              <Layers className="h-2.5 w-2.5" />
              {path.courses.length} Khóa học
            </span>
            <span className="flex items-center gap-0.5">
              <BookOpen className="h-2.5 w-2.5" />
              {completedResources}/{totalResources} Học liệu hoàn thành
            </span>
          </div>
        </div>

        {/* List of Courses inside */}
        {path.courses.length > 0 && (
          <div className="border-t border-slate-100 pt-3 space-y-2">
            <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block">
              Thứ tự các khóa học:
            </span>
            <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
              {path.courses.map((course, idx) => {
                const total = course.resources.length;
                const completed = course.resources.filter((r) => r.status === "DONE").length;
                const courseProg = total > 0 ? Math.round((completed / total) * 100) : 0;

                return (
                  <div key={course.id} className="flex items-center justify-between gap-3 text-[10px] text-slate-700 bg-slate-50 border border-slate-100 rounded px-2 py-1">
                    <span className="font-bold truncate flex items-center gap-1.5">
                      <span className="flex h-4 w-4 items-center justify-center bg-slate-200 text-slate-600 rounded-full font-mono text-[10px]">
                        {idx + 1}
                      </span>
                      {course.title}
                    </span>
                    <span className={`font-semibold shrink-0 flex items-center gap-0.5 ${courseProg === 100 ? "text-emerald-600" : "text-slate-500"}`}>
                      {courseProg === 100 && <CheckCircle2 className="h-2.5 w-2.5" />}
                      {courseProg}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
