"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

interface CourseProgressData {
  name: string;
  progress: number; // e.g. 75
  total: number;
  completed: number;
}

interface CourseProgressChartProps {
  data: CourseProgressData[];
}

export function CourseProgressChart({ data }: CourseProgressChartProps) {
  const isEmpty = data.length === 0;

  return (
    <Card className="border border-slate-200 bg-white shadow-sm rounded-xl flex flex-col h-[340px]">
      <CardHeader className="border-b border-slate-100 py-4">
        <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
          <GraduationCap className="h-4.5 w-4.5 text-[#0056D2]" />
          Tiến độ khóa học
        </CardTitle>
        <CardDescription className="text-[10px] text-slate-500">
          Tỷ lệ hoàn thành các học liệu (Done / Total) trong từng khóa học đang chạy.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 p-4 flex items-center justify-center min-h-0">
        {isEmpty ? (
          <div className="text-center py-12 text-slate-400 text-xs font-semibold">
            Không có khóa học nào đang hoạt động.
          </div>
        ) : (
          <div className="w-full h-full text-[10px] font-semibold text-slate-500">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis 
                  type="number" 
                  domain={[0, 100]} 
                  tickFormatter={(tick) => `${tick}%`}
                  tickLine={false}
                  axisLine={false}
                  stroke="#94a3b8"
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tickLine={false} 
                  axisLine={false} 
                  stroke="#475569" 
                  width={90}
                  tickFormatter={(val) => val.length > 12 ? `${val.substring(0, 10)}...` : val}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)",
                    fontSize: "11px",
                    fontWeight: "bold",
                    color: "#1e293b"
                  }}
                  formatter={(value, name, props) => {
                    const payload = props.payload as CourseProgressData;
                    return [`${value}% (${payload.completed}/${payload.total} bài)`, "Tiến độ"];
                  }}
                />
                <Bar 
                  dataKey="progress" 
                  fill="#0056D2" 
                  radius={[0, 4, 4, 0]} 
                  maxBarSize={16}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
