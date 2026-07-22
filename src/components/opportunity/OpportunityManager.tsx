"use client";

import React, { useState, useTransition, useEffect } from "react";
import { createOpportunity, updateOpportunity } from "@/app/opportunities/actions";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Briefcase, 
  X, 
  Loader2, 
  Save, 
  ExternalLink 
} from "lucide-react";
import { useRouter } from "next/navigation";

interface OpportunityData {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  type: string; // JOB, SCHOLARSHIP
  status: string; // OPEN, APPLIED, CLOSED
}

interface OpportunityManagerProps {
  editingOpportunity: OpportunityData | null;
  onClearEdit: () => void;
}

export function OpportunityManager({ editingOpportunity, onClearEdit }: OpportunityManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState<"JOB" | "SCHOLARSHIP">("JOB");
  const [status, setStatus] = useState<"OPEN" | "APPLIED" | "CLOSED">("OPEN");

  // Hydrate editing data
  useEffect(() => {
    if (editingOpportunity) {
      setTitle(editingOpportunity.title);
      setDescription(editingOpportunity.description || "");
      setUrl(editingOpportunity.url || "");
      setType(editingOpportunity.type as "JOB" | "SCHOLARSHIP");
      setStatus(editingOpportunity.status as "OPEN" | "APPLIED" | "CLOSED");
    } else {
      setTitle("");
      setDescription("");
      setUrl("");
      setType("JOB");
      setStatus("OPEN");
    }
  }, [editingOpportunity]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) return;

    startTransition(async () => {
      try {
        if (editingOpportunity) {
          // Update
          const res = await updateOpportunity(editingOpportunity.id, {
            title,
            description: description || undefined,
            url: url || undefined,
            type,
            status,
          });
          if (res.success) {
            onClearEdit();
            router.refresh();
          }
        } else {
          // Create
          const res = await createOpportunity({
            title,
            description: description || undefined,
            url: url || undefined,
            type,
            status,
          });
          if (res.success) {
            setTitle("");
            setDescription("");
            setUrl("");
            setType("JOB");
            setStatus("OPEN");
            router.refresh();
          }
        }
      } catch (err: any) {
        setError(err.message || "Không thể lưu cơ hội.");
      }
    });
  };

  return (
    <Card className="border border-slate-200 bg-white shadow-sm rounded-xl">
      <CardHeader className="border-b border-slate-100 py-4 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
            <Briefcase className="h-4.5 w-4.5 text-[#0056D2]" />
            {editingOpportunity ? "Cập nhật Cơ hội" : "Thêm Cơ hội mới"}
          </CardTitle>
          <CardDescription className="text-[10px] text-slate-500">
            Lưu trữ và theo dõi tiến trình nộp hồ sơ việc làm, thực tập hoặc học bổng.
          </CardDescription>
        </div>

        {editingOpportunity && (
          <Button
            size="icon"
            variant="ghost"
            onClick={onClearEdit}
            className="h-6 w-6 text-slate-400 hover:text-slate-600 rounded"
            title="Hủy sửa"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label htmlFor="opp_title" className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              Tên cơ hội *
            </label>
            <input
              id="opp_title"
              type="text"
              placeholder="Ví dụ: Thực tập Sinh NodeJS - VNG Corporation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#0056D2]"
              disabled={isPending}
              required
            />
          </div>

          {/* Type & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="opp_type" className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                Phân loại
              </label>
              <select
                id="opp_type"
                value={type}
                onChange={(e) => setType(e.target.value as "JOB" | "SCHOLARSHIP")}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#0056D2]"
                disabled={isPending}
              >
                <option value="JOB">Việc làm/Thực tập</option>
                <option value="SCHOLARSHIP">Học bổng</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="opp_status" className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                Trạng thái tuyển
              </label>
              <select
                id="opp_status"
                value={status}
                onChange={(e) => setStatus(e.target.value as "OPEN" | "APPLIED" | "CLOSED")}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#0056D2]"
                disabled={isPending}
              >
                <option value="OPEN">Đang mở (Open)</option>
                <option value="APPLIED">Đã nộp (Applied)</option>
                <option value="CLOSED">Đã đóng (Closed)</option>
              </select>
            </div>
          </div>

          {/* URL */}
          <div className="space-y-1.5">
            <label htmlFor="opp_url" className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              Liên kết chi tiết (URL)
            </label>
            <input
              id="opp_url"
              type="url"
              placeholder="https://example.com/job-post"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#0056D2]"
              disabled={isPending}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label htmlFor="opp_desc" className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              Mô tả/Yêu cầu công việc (JD)
            </label>
            <textarea
              id="opp_desc"
              rows={3}
              placeholder="Nhập JD hoặc ghi chú nộp hồ sơ..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#0056D2] resize-none"
              disabled={isPending}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isPending || !title.trim()}
            className="w-full rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white text-xs font-semibold py-1.5 flex items-center justify-center gap-1"
          >
            {isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : editingOpportunity ? (
              <>
                <Save className="h-3.5 w-3.5" />
                Lưu thay đổi
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                Thêm cơ hội
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
