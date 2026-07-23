"use client";

import React, { useTransition } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteOpportunity } from "@/app/opportunities/actions";
import { useRouter } from "next/navigation";
import { 
  Briefcase, 
  GraduationCap, 
  ExternalLink, 
  Trash2, 
  Edit2, 
  Clock, 
  CheckCircle, 
  XCircle 
} from "lucide-react";

interface Opportunity {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  type: string; // JOB, SCHOLARSHIP
  status: string; // OPEN, APPLIED, CLOSED
}

interface OpportunityCardProps {
  opportunity: Opportunity;
  onEdit: () => void;
}

export function OpportunityCard({ opportunity, onEdit }: OpportunityCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Bạn có chắc chắn muốn xóa cơ hội này?")) return;

    startTransition(async () => {
      try {
        const res = await deleteOpportunity(opportunity.id);
        if (res.success) {
          router.refresh();
        }
      } catch (err: any) {
        alert(err.message || "Xóa cơ hội thất bại.");
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-50 rounded text-[10px] font-bold px-1.5 py-0.5 flex items-center gap-0.5">
            <Clock className="h-2.5 w-2.5" />
            Đang mở (Open)
          </Badge>
        );
      case "APPLIED":
        return (
          <Badge className="bg-blue-50 text-[#0056D2] border border-blue-100 hover:bg-blue-50 rounded text-[10px] font-bold px-1.5 py-0.5 flex items-center gap-0.5">
            <CheckCircle className="h-2.5 w-2.5" />
            Đã nộp (Applied)
          </Badge>
        );
      case "CLOSED":
        return (
          <Badge className="bg-slate-50 text-slate-500 border border-slate-100 hover:bg-slate-50 rounded text-[10px] font-bold px-1.5 py-0.5 flex items-center gap-0.5">
            <XCircle className="h-2.5 w-2.5" />
            Đã đóng (Closed)
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="border border-slate-200 bg-white shadow-sm rounded-xl overflow-hidden flex flex-col justify-between">
      <CardHeader className="border-b border-slate-100 py-4 flex flex-row items-start justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-1.5">
            {opportunity.type === "JOB" ? (
              <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-50 rounded text-[10px] font-bold px-1.5 py-0.5 flex items-center gap-1">
                <Briefcase className="h-2.5 w-2.5" />
                Việc làm/Thực tập
              </Badge>
            ) : (
              <Badge className="bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-50 rounded text-[10px] font-bold px-1.5 py-0.5 flex items-center gap-1">
                <GraduationCap className="h-2.5 w-2.5" />
                Học bổng
              </Badge>
            )}
            {getStatusBadge(opportunity.status)}
          </div>
          <CardTitle className="text-sm font-bold text-slate-900 truncate">
            {opportunity.title}
          </CardTitle>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            size="icon"
            variant="ghost"
            onClick={onEdit}
            disabled={isPending}
            className="h-7 w-7 text-slate-400 hover:text-slate-700 rounded"
            title="Sửa cơ hội"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleDelete}
            disabled={isPending}
            className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
            title="Xóa cơ hội"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-4 flex-1 flex flex-col justify-between gap-4">
        {opportunity.description && (
          <p className="text-[11px] text-slate-600 font-medium leading-relaxed whitespace-pre-wrap line-clamp-3">
            {opportunity.description}
          </p>
        )}

        {opportunity.url && (
          <div className="border-t border-slate-100 pt-3">
            <Button 
              asChild 
              size="sm" 
              variant="outline" 
              className="w-full rounded-lg border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold px-3 py-1 flex items-center justify-center gap-1"
            >
              <a href={opportunity.url} target="_blank" rel="noopener noreferrer">
                Xem liên kết gốc
                <ExternalLink className="h-3 w-3 text-slate-400" />
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
