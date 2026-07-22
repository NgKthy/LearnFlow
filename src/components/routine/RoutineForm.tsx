"use client";

import React, { useTransition, useState, useEffect } from "react";
import { createRoutine, updateRoutine } from "@/app/routine/actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Edit2, Sparkles } from "lucide-react";

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
  resourceId: string | null;
}

interface RoutineFormProps {
  courses: Course[];
  resources: Resource[];
  editingRoutine?: Routine | null;
  onCancelEdit?: () => void;
  onSuccess: () => void;
}

const DAYS_OF_WEEK = [
  { value: "MONDAY", label: "T2" },
  { value: "TUESDAY", label: "T3" },
  { value: "WEDNESDAY", label: "T4" },
  { value: "THURSDAY", label: "T5" },
  { value: "FRIDAY", label: "T6" },
  { value: "SATURDAY", label: "T7" },
  { value: "SUNDAY", label: "CN" },
];

export function RoutineForm({
  courses,
  resources,
  editingRoutine,
  onCancelEdit,
  onSuccess
}: RoutineFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("08:00");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [isDaily, setIsDaily] = useState(true);
  const [courseId, setCourseId] = useState<string>("");
  const [resourceId, setResourceId] = useState<string>("");

  // Sync editing item
  useEffect(() => {
    if (editingRoutine) {
      setTitle(editingRoutine.title);
      setDescription(editingRoutine.description || "");
      setTime(editingRoutine.time);
      setCourseId(editingRoutine.courseId || "");
      setResourceId(editingRoutine.resourceId || "");
      if (editingRoutine.dayOfWeek) {
        setSelectedDays(editingRoutine.dayOfWeek.split(","));
        setIsDaily(false);
      } else {
        setSelectedDays([]);
        setIsDaily(true);
      }
    } else {
      // Reset form
      setTitle("");
      setDescription("");
      setTime("08:00");
      setSelectedDays([]);
      setIsDaily(true);
      setCourseId("");
      setResourceId("");
    }
    setError(null);
  }, [editingRoutine]);

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => {
      const next = prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day];
      setIsDaily(next.length === 0);
      return next;
    });
  };

  const handleDailyToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsDaily(checked);
    if (checked) {
      setSelectedDays([]);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Vui lòng điền tiêu đề lịch học");
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          title: title.trim(),
          description: description.trim() || null,
          time,
          dayOfWeek: isDaily ? null : selectedDays,
          courseId: courseId || null,
          resourceId: resourceId || null,
          active: editingRoutine ? editingRoutine.active : true,
        };

        let res;
        if (editingRoutine) {
          res = await updateRoutine(editingRoutine.id, payload);
        } else {
          res = await createRoutine(payload);
        }

        if (res.success) {
          onSuccess();
          if (!editingRoutine) {
            // Reset
            setTitle("");
            setDescription("");
            setTime("08:00");
            setSelectedDays([]);
            setIsDaily(true);
            setCourseId("");
            setResourceId("");
          }
        }
      } catch (err: any) {
        setError(err.message || "Đã xảy ra lỗi.");
      }
    });
  };

  return (
    <Card className="border border-slate-200 bg-white shadow-sm sticky top-6">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-1.5">
          <Sparkles className="h-4.5 w-4.5 text-[#0056D2]" />
          {editingRoutine ? "Cập nhật lịch học" : "Thiết lập lịch học mới"}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              Tiêu đề lịch trình *
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Học Từ vựng Tiếng Anh"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2]"
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              Ghi chú thêm
            </label>
            <textarea
              placeholder="Ghi chú mục tiêu học tập..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2]"
              disabled={isPending}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                Giờ học *
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2]"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-1.5 flex flex-col justify-end">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 pb-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDaily}
                  onChange={handleDailyToggle}
                  className="rounded border-slate-300 text-[#0056D2] focus:ring-[#0056D2] h-4 w-4"
                  disabled={isPending}
                />
                Lặp lại hàng ngày
              </label>
            </div>
          </div>

          {/* Day of Week Selector */}
          {!isDaily && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                Lặp lại vào các ngày
              </label>
              <div className="flex flex-wrap gap-1.5">
                {DAYS_OF_WEEK.map((day) => {
                  const isSelected = selectedDays.includes(day.value);
                  return (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => handleDayToggle(day.value)}
                      className={`h-9 w-9 rounded-lg border text-xs font-bold transition-all ${
                        isSelected 
                          ? "bg-[#0056D2] text-white border-[#0056D2] shadow-sm" 
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                      disabled={isPending}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Optional linkages */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                Gắn với Khóa học (Tùy chọn)
              </label>
              <select
                value={courseId}
                onChange={(e) => {
                  setCourseId(e.target.value);
                  if (e.target.value) setResourceId(""); // Mutually exclusive
                }}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0056D2]"
                disabled={isPending}
              >
                <option value="">-- Không gắn khóa học --</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                Hoặc gắn với Học liệu (Tùy chọn)
              </label>
              <select
                value={resourceId}
                onChange={(e) => {
                  setResourceId(e.target.value);
                  if (e.target.value) setCourseId(""); // Mutually exclusive
                }}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0056D2]"
                disabled={isPending}
              >
                <option value="">-- Không gắn học liệu --</option>
                {resources.map(r => (
                  <option key={r.id} value={r.id}>{r.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-3.5">
            {editingRoutine && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancelEdit} 
                disabled={isPending}
                className="rounded-lg text-xs"
              >
                Hủy sửa
              </Button>
            )}
            <Button
              type="submit"
              className="rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white shadow-md font-semibold text-xs py-2 px-4"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Đang lưu...
                </>
              ) : editingRoutine ? (
                "Lưu thay đổi"
              ) : (
                <>
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  Tạo lịch học
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
