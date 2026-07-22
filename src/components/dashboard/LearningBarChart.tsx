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
import { BarChart3 } from "lucide-react";

interface ResourceChartData {
  date: string;
  count: number;
}

interface LearningBarChartProps {
  data: ResourceChartData[];
}

export function LearningBarChart({ data }: LearningBarChartProps) {
  const isDataEmpty = data.every((item) => item.count === 0);

  return (
    <Card className="border border-slate-200 bg-white shadow-sm rounded-xl flex flex-col h-[340px]">
      <CardHeader className="border-b border-slate-100 py-4">
        <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
          <BarChart3 className="h-4 w-4 text-[#0056D2]" />
          Tích lũy tài nguyên (7 ngày)
        </CardTitle>
        <CardDescription className="text-[10px] text-slate-500">
          Biểu đồ hiển thị số lượng tài liệu đã lưu mỗi ngày trong tuần qua.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 p-4 flex items-center justify-center min-h-0">
        {isDataEmpty ? (
          <div className="text-center py-12 text-slate-400 text-xs font-semibold">
            Không có hoạt động lưu tài liệu nào trong 7 ngày qua.
          </div>
        ) : (
          <div className="w-full h-full text-[10px] font-semibold text-slate-500">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  tickLine={false} 
                  axisLine={false} 
                  stroke="#94a3b8" 
                  dy={8}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  stroke="#94a3b8"
                  allowDecimals={false}
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
                  labelStyle={{ color: "#64748b", marginBottom: "4px" }}
                  formatter={(value) => [`${value} tài liệu`, "Đã lưu"]}
                />
                <Bar 
                  dataKey="count" 
                  fill="#0056D2" 
                  radius={[4, 4, 0, 0]} 
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
