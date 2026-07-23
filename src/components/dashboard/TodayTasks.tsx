"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Inbox, 
  Clock, 
  BookOpen, 
  Folder,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import Link from "next/link";

interface TodayTasksProps {
  todayRoutines: {
    id: string;
    title: string;
    description: string | null;
    time: string;
    courseTitle: string | null;
    resourceTitle: string | null;
  }[];
  inboxCount: number;
}

export function TodayTasks({ todayRoutines, inboxCount }: TodayTasksProps) {
  const hasRoutines = todayRoutines.length > 0;
  const hasInbox = inboxCount > 0;

  return (
    <Card className="border border-slate-200 bg-white shadow-sm rounded-xl">
      <CardHeader className="border-b border-slate-100 py-4 flex flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
            <Calendar className="h-4 w-4 text-[#0056D2]" />
            Nhiệm vụ hôm nay (Today)
          </CardTitle>
          <CardDescription className="text-[10px] text-slate-500">
            Xem lịch trình học tập lặp lại và tài liệu cần xử lý trong ngày.
          </CardDescription>
        </div>

        {hasInbox && (
          <Badge className="bg-red-50 hover:bg-red-50 text-red-600 border border-red-100 rounded text-[10px] font-bold px-2 py-0.5 shrink-0 flex items-center gap-1">
            <Inbox className="h-3 w-3" />
            {inboxCount} Inbox
          </Badge>
        )}
      </CardHeader>

      <CardContent className="pt-5 space-y-5">
        {/* Inbox warning banner */}
        {hasInbox && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 bg-red-50/50 border border-red-100 rounded-xl text-xs">
            <div className="flex items-start gap-2.5">
              <Inbox className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-slate-800">Tài liệu chưa phân loại</p>
                <p className="text-slate-500 text-[11px]">Bạn có {inboxCount} học liệu mới gửi từ bot cần gắn tag hoặc khóa học.</p>
              </div>
            </div>
            <Button asChild size="sm" variant="outline" className="rounded-lg border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 text-xs font-bold px-3 py-1 shrink-0">
              <Link href="/inbox" className="flex items-center gap-1">
                Phân loại ngay
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        )}

        {/* Routines list */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
            Lịch học trong ngày ({todayRoutines.length})
          </h4>

          {!hasRoutines ? (
            <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 rounded-xl border border-slate-100">
              <CheckCircle className="h-7 w-7 text-emerald-500 mb-2" />
              <p className="text-slate-600 font-bold text-xs">Hôm nay không có lịch học</p>
              <p className="text-slate-400 text-[10px] font-semibold mt-0.5">Bạn đã hoàn tất mọi lịch trình đặt sẵn hoặc chưa cấu hình.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {todayRoutines.map((routine) => (
                <div 
                  key={routine.id} 
                  className="flex items-start justify-between gap-4 p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#0056D2] bg-blue-50 px-2 py-0.5 rounded">
                        <Clock className="h-3 w-3" />
                        {routine.time}
                      </span>
                      <h5 className="text-xs font-bold text-slate-800 truncate">
                        {routine.title}
                      </h5>
                    </div>

                    {routine.description && (
                      <p className="text-slate-500 text-[10px] font-medium leading-relaxed max-w-md">
                        {routine.description}
                      </p>
                    )}

                    {/* Metadata Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {routine.courseTitle && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          <Folder className="h-2.5 w-2.5" />
                          Khóa học: {routine.courseTitle}
                        </span>
                      )}
                      {routine.resourceTitle && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          <BookOpen className="h-2.5 w-2.5" />
                          Học liệu: {routine.resourceTitle}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
