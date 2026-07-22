"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Search, Eye } from "lucide-react";
import dayjs from "dayjs";

interface Resource {
  id: string;
  status: string;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  status: string;
  createdAt: Date | string;
  resources: Resource[];
}

interface CourseTableProps {
  courses: Course[];
}

export function CourseTable({ courses }: CourseTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortField, setSortField] = useState<"title" | "progress" | "date">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Calculate course stats helper
  const getStats = (course: Course) => {
    const total = course.resources.length;
    const completed = course.resources.filter(r => r.status === "COMPLETED").length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, progress };
  };

  // Sort and filter logic
  const processedCourses = useMemo(() => {
    return courses
      .filter((course) => {
        const matchesSearch = 
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
        
        const matchesStatus = statusFilter === "ALL" || course.status === statusFilter;
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortField === "title") {
          comparison = a.title.localeCompare(b.title);
        } else if (sortField === "progress") {
          comparison = getStats(a).progress - getStats(b).progress;
        } else if (sortField === "date") {
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }

        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [courses, searchTerm, statusFilter, sortField, sortOrder]);

  const handleSort = (field: "title" | "progress" | "date") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const statusColors: Record<string, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
    DRAFT: "bg-slate-50 text-slate-700 border-slate-200",
    ARCHIVED: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <div className="space-y-4">
      {/* Filtering and Search Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:bg-white focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="statusFilter" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Lọc trạng thái:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0056D2]"
          >
            <option value="ALL">Tất cả</option>
            <option value="ACTIVE">Đang mở (Active)</option>
            <option value="DRAFT">Nháp (Draft)</option>
            <option value="ARCHIVED">Lưu trữ (Archived)</option>
          </select>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-bold text-slate-500 border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-4">
                  <button 
                    onClick={() => handleSort("title")} 
                    className="flex items-center gap-1 hover:text-slate-800 focus:outline-none font-bold"
                  >
                    Tên khóa học
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                </th>
                <th scope="col" className="px-6 py-4">Trạng thái</th>
                <th scope="col" className="px-6 py-4">Số bài học</th>
                <th scope="col" className="px-6 py-4">
                  <button 
                    onClick={() => handleSort("progress")} 
                    className="flex items-center gap-1 hover:text-slate-800 focus:outline-none font-bold"
                  >
                    Tiến độ
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                </th>
                <th scope="col" className="px-6 py-4">
                  <button 
                    onClick={() => handleSort("date")} 
                    className="flex items-center gap-1 hover:text-slate-800 focus:outline-none font-bold"
                  >
                    Ngày tạo
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                </th>
                <th scope="col" className="px-6 py-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processedCourses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400 font-medium">
                    Không tìm thấy khóa học nào phù hợp.
                  </td>
                </tr>
              ) : (
                processedCourses.map((course) => {
                  const { total, completed, progress } = getStats(course);

                  return (
                    <tr key={course.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{course.title}</div>
                        {course.description && (
                          <div className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-sm">
                            {course.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`text-[10px] uppercase font-semibold py-0.5 px-2 ${statusColors[course.status]}`}>
                          {course.status === "ACTIVE" ? "Đang mở" : course.status === "DRAFT" ? "Nháp" : "Lưu trữ"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">{total} bài học</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-800 text-xs w-9 shrink-0">{progress}%</span>
                          <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#0056D2] rounded-full" 
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 font-semibold">({completed}/{total})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                        {dayjs(course.createdAt).format("DD/MM/YYYY")}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link 
                          href={`/courses/${course.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#0056D2] hover:underline"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Chi tiết
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
