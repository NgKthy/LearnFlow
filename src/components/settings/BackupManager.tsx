"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Database, 
  CheckCircle,
  FileJson
} from "lucide-react";

export function BackupManager() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    // Simple window trigger for downloading attachment file
    window.location.href = "/api/backup";
    
    // Reset state after a short delay since download trigger is async in browser
    setTimeout(() => {
      setDownloading(false);
    }, 2000);
  };

  return (
    <Card className="border border-slate-200 bg-white shadow-sm rounded-xl">
      <CardHeader className="border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-5">
        <div className="space-y-1">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-1.5">
            <Database className="h-4.5 w-4.5 text-[#0056D2]" />
            Sao lưu & Xuất dữ liệu
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Xuất và tải về toàn bộ cơ sở dữ liệu học tập cá nhân (Khóa học, Học liệu, Note, Thẻ ghi nhớ) dưới dạng tệp JSON.
          </CardDescription>
        </div>

        <Button
          onClick={handleDownload}
          disabled={downloading}
          className="rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white shadow-sm font-semibold text-xs py-2 px-4 shrink-0 flex items-center gap-1.5"
        >
          <Download className="h-3.5 w-3.5" />
          {downloading ? "Đang chuẩn bị..." : "Tải bản sao lưu (JSON)"}
        </Button>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="flex items-start gap-3 p-3.5 bg-blue-50/30 border border-blue-100 rounded-xl text-xs text-slate-600 font-medium">
          <FileJson className="h-4.5 w-4.5 text-[#0056D2] shrink-0 mt-0.5" />
          <div className="space-y-1 leading-relaxed">
            <p className="font-bold text-slate-800">Thông tin hữu ích về bản sao lưu:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-500 pl-1 text-[11px]">
              <li>Bản sao lưu chứa toàn bộ thông tin cấu hình, tiến trình và dữ liệu học của bạn.</li>
              <li>Thông tin khóa bảo mật (API Key) được loại bỏ tự động để đảm bảo an toàn.</li>
              <li>Bạn có thể import tệp tin này trở lại bất kỳ lúc nào để chuyển đổi máy chủ.</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
