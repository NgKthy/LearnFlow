"use client";

import React, { useState, useEffect } from "react";
import { runLinkScanner, getLinkScannerProgress } from "@/app/settings/actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ProgressBar } from "./ProgressBar";
import { 
  ShieldAlert, 
  RefreshCw, 
  ExternalLink, 
  Loader2, 
  Calendar, 
  BookOpen, 
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";

interface BrokenLink {
  id: string;
  title: string;
  url: string;
  statusCode?: number | null;
  error?: string | null;
}

interface LinkScannerProps {
  lastScanDate: string;
  totalScanned: number;
  brokenCount: number;
  brokenLinks: BrokenLink[];
}

export function LinkScanner({
  lastScanDate,
  totalScanned,
  brokenCount,
  brokenLinks
}: LinkScannerProps) {
  const [scanStatus, setScanStatus] = useState<string>("IDLE");
  const [processed, setProcessed] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [percentage, setPercentage] = useState<number>(0);
  const [failed, setFailed] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Statistics & display results
  const [displayBrokenLinks, setDisplayBrokenLinks] = useState<BrokenLink[]>(brokenLinks);
  const [displayLastScanDate, setDisplayLastScanDate] = useState<string>(lastScanDate);
  const [displayTotalScanned, setDisplayTotalScanned] = useState<number>(totalScanned);
  const [displayBrokenCount, setDisplayBrokenCount] = useState<number>(brokenCount);

  // Poll progress function
  const pollProgress = async () => {
    try {
      const progress = await getLinkScannerProgress();
      setScanStatus(progress.status);
      setProcessed(progress.processed);
      setTotal(progress.total);
      setPercentage(progress.percentage);
      setFailed(progress.failed);

      if (progress.status === "COMPLETED") {
        setDisplayBrokenLinks(progress.brokenLinks);
        setDisplayBrokenCount(progress.failed);
        setDisplayTotalScanned(progress.total);
        setDisplayLastScanDate(new Date().toISOString());
        return true; // Stop polling
      } else if (progress.status === "FAILED") {
        setError("Quá trình quét xảy ra lỗi.");
        return true; // Stop polling
      }
      return false;
    } catch (err: any) {
      console.error(err);
      return false;
    }
  };

  // Run polling on mount if status is currently SCANNING
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    const checkInitial = async () => {
      const initialProgress = await getLinkScannerProgress();
      if (initialProgress.status === "SCANNING") {
        setScanStatus("SCANNING");
        setProcessed(initialProgress.processed);
        setTotal(initialProgress.total);
        setPercentage(initialProgress.percentage);
        setFailed(initialProgress.failed);
        
        intervalId = setInterval(async () => {
          const shouldStop = await pollProgress();
          if (shouldStop) {
            clearInterval(intervalId);
          }
        }, 1000);
      }
    };
    
    checkInitial();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const handleScan = async () => {
    setError(null);
    setScanStatus("SCANNING");
    setProcessed(0);
    setTotal(0);
    setPercentage(0);
    setFailed(0);

    try {
      const res = await runLinkScanner();
      if (res.success) {
        // Start polling immediately
        const intervalId = setInterval(async () => {
          const shouldStop = await pollProgress();
          if (shouldStop) {
            clearInterval(intervalId);
          }
        }, 1000);
      } else {
        setError(res.error || "Không thể bắt đầu quét.");
        setScanStatus("FAILED");
      }
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi hệ thống.");
      setScanStatus("FAILED");
    }
  };

  const isScanning = scanStatus === "SCANNING";

  return (
    <Card className="border border-slate-200 bg-white shadow-sm rounded-xl">
      <CardHeader className="border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-5">
        <div className="space-y-1">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-1.5">
            <ShieldAlert className="h-4.5 w-4.5 text-[#0056D2]" />
            Kiểm tra liên kết hỏng (Broken Link Scanner)
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Quét toàn bộ thư viện học liệu để phát hiện các liên kết nguồn (URL) bị chết hoặc không thể kết nối.
          </CardDescription>
        </div>

        <Button
          onClick={handleScan}
          disabled={isScanning}
          className="rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white shadow-md font-semibold text-xs py-2 px-4 shrink-0"
        >
          {isScanning ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Đang quét...
            </>
          ) : (
            <>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Chạy quét thủ công
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Real-time Progress Bar */}
        {isScanning && (
          <ProgressBar
            processed={processed}
            total={total}
            percentage={percentage}
            failed={failed}
            status={scanStatus}
          />
        )}

        {scanStatus === "COMPLETED" && (
          <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle className="h-4 w-4" />
            Quá trình quét liên kết hoàn tất thành công!
          </div>
        )}

        {/* Scan Summary Metrics */}
        {displayLastScanDate ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between gap-2.5">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                Lần quét gần nhất
              </span>
              <span className="text-xs font-bold text-slate-800">
                {dayjs(displayLastScanDate).format("DD/MM/YYYY HH:mm")}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between gap-2.5">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5 text-slate-500" />
                Tổng liên kết kiểm tra
              </span>
              <span className="text-base font-extrabold text-slate-800">
                {displayTotalScanned} liên kết
              </span>
            </div>

            <div className={`p-4 rounded-xl border flex flex-col justify-between gap-2.5 ${
              displayBrokenCount > 0 
                ? "bg-red-50/50 border-red-100 text-red-800" 
                : "bg-emerald-50/40 border-emerald-100 text-emerald-800"
            }`}>
              <span className="text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 opacity-70">
                {displayBrokenCount > 0 ? (
                  <AlertTriangle className="h-3.5 w-3.5" />
                ) : (
                  <CheckCircle className="h-3.5 w-3.5" />
                )}
                Liên kết hỏng phát hiện
              </span>
              <span className="text-base font-extrabold">
                {displayBrokenCount > 0 ? `${displayBrokenCount} lỗi` : "Tất cả ổn định"}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 font-medium">
            Chưa thực hiện quét kiểm tra liên kết lần nào. Nhấp vào nút chạy quét thủ công ở trên để bắt đầu.
          </div>
        )}

        {/* Broken links details */}
        {displayBrokenLinks.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Danh sách chi tiết liên kết lỗi ({displayBrokenLinks.length})
            </h4>
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
                    <tr>
                      <th scope="col" className="px-4 py-3">Tên tài nguyên</th>
                      <th scope="col" className="px-4 py-3">Liên kết gốc</th>
                      <th scope="col" className="px-4 py-3">Lỗi phản hồi</th>
                      <th scope="col" className="px-4 py-3 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {displayBrokenLinks.map((link) => (
                      <tr key={link.id} className="hover:bg-slate-50/40">
                        <td className="px-4 py-3 font-semibold text-slate-900 max-w-xs truncate">
                          {link.title}
                        </td>
                        <td className="px-4 py-3 max-w-xs truncate">
                          <a 
                             href={link.url} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="inline-flex items-center gap-0.5 text-[#0056D2] hover:underline"
                          >
                            {link.url}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </td>
                        <td className="px-4 py-3 font-semibold text-red-600">
                          {link.statusCode 
                            ? `Status ${link.statusCode}` 
                            : link.error || "Không thể kết nối"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Link 
                            href={`/resource/${link.id}`}
                            className="font-bold text-[#0056D2] hover:underline"
                          >
                            Xem chi tiết
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
