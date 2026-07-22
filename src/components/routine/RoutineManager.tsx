"use client";

import React, { useState, useTransition } from "react";
import { RoutineForm } from "./RoutineForm";
import { toggleRoutineActive, deleteRoutine } from "@/app/routine/actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  Calendar, 
  BookOpen, 
  GraduationCap, 
  Trash2, 
  Edit2, 
  Check, 
  X,
  CalendarCheck,
  AlertCircle
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Course {
  id: string;
  title: string;
}

interface Resource {
  id: string;
  title: string;
}

interface Routine {
  id: string;
  title: string;
  description: string | null;
  time: string;
  dayOfWeek: string | null;
  active: boolean;
  courseId: string | null;
  course?: Course | null;
  resourceId: string | null;
  resource?: Resource | null;
}

interface RoutineManagerProps {
  initialRoutines: Routine[];
  courses: Course[];
  resources: Resource[];
}

const DAY_MAP: Record<string, string> = {
  MONDAY: "T2",
  TUESDAY: "T3",
  WEDNESDAY: "T4",
  THURSDAY: "T5",
  FRIDAY: "T6",
  SATURDAY: "T7",
  SUNDAY: "CN",
};

export function RoutineManager({ initialRoutines, courses, resources }: RoutineManagerProps) {
  const router = useRouter();
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleToggleActive = (routineId: string, currentActive: boolean) => {
    startTransition(async () => {
      try {
        await toggleRoutineActive(routineId, !currentActive);
        router.refresh();
      } catch (err) {
        console.error(err);
      }
    });
  };

  const handleDelete = (routineId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa lịch học này không?")) return;

    startTransition(async () => {
      try {
        await deleteRoutine(routineId);
        if (editingRoutine?.id === routineId) {
          setEditingRoutine(null);
        }
        router.refresh();
      } catch (err) {
        console.error(err);
      }
    });
  };

  // Helper to format repeat days
  const formatDays = (dayOfWeekStr: string | null) => {
    if (!dayOfWeekStr) return "Hàng ngày";
    return dayOfWeekStr
      .split(",")
      .map(day => DAY_MAP[day] || day)
      .join(", ");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* List of Routines */}
      <div className="lg:col-span-2 space-y-4">
        {initialRoutines.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-16 text-center bg-white shadow-sm">
            <Calendar className="h-12 w-12 text-[#0056D2]/30 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-slate-900 font-sans">Chưa thiết lập lịch học</h4>
            <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
              Tạo lập thời gian biểu học tập hàng ngày để nhắc nhở và quản lý tiến độ hiệu quả hơn.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {initialRoutines.map((routine) => (
              <Card 
                key={routine.id} 
                className={`transition-all ${
                  routine.active ? "border-slate-200" : "border-slate-100 bg-slate-50/50 opacity-70"
                }`}
              >
                <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Left detail info */}
                  <div className="space-y-2.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 py-0.5 px-2 rounded">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {routine.time}
                      </span>
                      <span className="text-xs font-bold text-[#0056D2] bg-[#EEF4FD] py-0.5 px-2 rounded">
                        {formatDays(routine.dayOfWeek)}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-900 truncate">
                        {routine.title}
                      </h4>
                      {routine.description && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1 leading-relaxed">
                          {routine.description}
                        </p>
                      )}
                    </div>

                    {/* Linked entities */}
                    {(routine.course || routine.resource) && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {routine.course && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#0056D2] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                            <GraduationCap className="h-3 w-3" />
                            Khóa học: {routine.course.title}
                          </span>
                        )}
                        {routine.resource && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                            <BookOpen className="h-3 w-3" />
                            Bài học: {routine.resource.title}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions & Switch */}
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    {/* Toggle Active Switch */}
                    <button
                      onClick={() => handleToggleActive(routine.id, routine.active)}
                      disabled={isPending}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        routine.active ? "bg-[#0056D2]" : "bg-slate-200"
                      }`}
                      aria-label="Kích hoạt lịch học"
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          routine.active ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>

                    <div className="flex items-center border border-slate-200 bg-white rounded-lg p-0.5 shadow-sm">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setEditingRoutine(routine)}
                        className="h-7 w-7 rounded-md text-slate-500 hover:text-slate-800"
                        title="Chỉnh sửa"
                        disabled={isPending}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(routine.id)}
                        className="h-7 w-7 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50"
                        title="Xóa"
                        disabled={isPending}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Routine Form Panel */}
      <div className="lg:col-span-1">
        <RoutineForm
          courses={courses}
          resources={resources}
          editingRoutine={editingRoutine}
          onCancelEdit={() => setEditingRoutine(null)}
          onSuccess={() => {
            setEditingRoutine(null);
            router.refresh();
          }}
        />
      </div>
    </div>
  );
}
