"use client";

import React from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface ProgressBarProps {
  processed: number;
  total: number;
  percentage: number;
  failed: number;
  status: string; // "IDLE" | "SCANNING" | "COMPLETED" | "FAILED"
}

export function ProgressBar({
  processed,
  total,
  percentage,
  failed,
  status,
}: ProgressBarProps) {
  const isScanning = status === "SCANNING";
  const isCompleted = status === "COMPLETED";
  const isFailed = status === "FAILED";

  // Color scheme based on status and errors
  let progressColor = "bg-[#0056D2]"; // Default blue
  if (isCompleted) {
    progressColor = failed > 0 ? "bg-amber-500" : "bg-emerald-500";
  } else if (isFailed) {
    progressColor = "bg-red-500";
  }

  return (
    <div className="space-y-3.5 p-4 bg-slate-50 border border-slate-200 rounded-xl">
      {/* Top Details info */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
        <span className="flex items-center gap-1.5">
          {isScanning && (
            <>
              <Loader2 className="h-4 w-4 text-[#0056D2] animate-spin" />
              <span>Đang tiến hành quét...</span>
            </>
          )}
          {isCompleted && (
            <>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Quét hoàn tất</span>
            </>
          )}
          {isFailed && (
            <>
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span>Tiến trình quét bị gián đoạn</span>
            </>
          )}
          {!isScanning && !isCompleted && !isFailed && (
            <span>Chuẩn bị quét...</span>
          )}
        </span>
        <span className="font-bold text-[#0056D2]">
          {percentage}%
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden relative shadow-inner">
        <div
          className={`h-full ${progressColor} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Footer statistics */}
      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
        <span>
          Đã xử lý: <strong className="text-slate-800 font-bold">{processed}</strong> / <strong className="text-slate-800 font-bold">{total}</strong> URL
        </span>
        {failed > 0 && (
          <span className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-100 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Phát hiện {failed} liên kết lỗi
          </span>
        )}
      </div>
    </div>
  );
}
