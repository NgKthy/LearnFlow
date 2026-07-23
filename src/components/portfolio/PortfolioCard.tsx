"use client";

import React, { useTransition } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Globe, 
  Lock, 
  Trash2, 
  Edit2, 
  ArrowUp, 
  ArrowDown, 
  Link2,
  Copy,
  Check
} from "lucide-react";
import { deletePortfolioItem, togglePublicStatus } from "@/app/portfolio/actions";
import { useRouter } from "next/navigation";

interface PortfolioItemProps {
  item: {
    id: string;
    title: string;
    description: string | null;
    isPublic: boolean;
    order: number;
    resource: { id: string; title: string } | null;
  };
  onEdit: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function PortfolioCard({
  item,
  onEdit,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: PortfolioItemProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = React.useState(false);

  const handleDelete = () => {
    if (!confirm("Bạn có chắc chắn muốn xóa thành quả học tập này khỏi Portfolio?")) return;

    startTransition(async () => {
      await deletePortfolioItem(item.id);
      router.refresh();
    });
  };

  const handleToggleVisibility = () => {
    startTransition(async () => {
      await togglePublicStatus(item.id, !item.isPublic);
      router.refresh();
    });
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/portfolio/default`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border border-slate-200 bg-white shadow-sm rounded-xl overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-colors">
      <CardHeader className="border-b border-slate-100 py-4 flex flex-row items-start justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={handleToggleVisibility}
              disabled={isPending}
              title="Click để đổi trạng thái chia sẻ"
              className="focus:outline-none"
            >
              {item.isPublic ? (
                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 rounded text-[10px] font-bold px-1.5 py-0.5 flex items-center gap-1 cursor-pointer">
                  <Globe className="h-3 w-3" />
                  Công khai (Public)
                </Badge>
              ) : (
                <Badge className="bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 rounded text-[10px] font-bold px-1.5 py-0.5 flex items-center gap-1 cursor-pointer">
                  <Lock className="h-3 w-3" />
                  Riêng tư (Private)
                </Badge>
              )}
            </button>
          </div>
          <CardTitle className="text-sm font-bold text-slate-900 truncate mt-1">
            {item.title}
          </CardTitle>
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          <Button
            size="icon"
            variant="ghost"
            onClick={onMoveUp}
            disabled={isFirst || isPending}
            className="h-7 w-7 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded disabled:opacity-30"
            title="Di chuyển lên"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={onMoveDown}
            disabled={isLast || isPending}
            className="h-7 w-7 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded disabled:opacity-30"
            title="Di chuyển xuống"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={onEdit}
            disabled={isPending}
            className="h-7 w-7 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded"
            title="Sửa"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleDelete}
            disabled={isPending}
            className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
            title="Xóa"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-4 flex-1 flex flex-col justify-between gap-4">
        {item.description && (
          <p className="text-[11px] text-slate-600 font-medium leading-relaxed whitespace-pre-wrap line-clamp-3">
            {item.description}
          </p>
        )}

        <div className="space-y-2 border-t border-slate-100 pt-3">
          {item.resource && (
            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold bg-slate-50 border border-slate-100 rounded px-2 py-1">
              <Link2 className="h-3 w-3 text-slate-400 shrink-0" />
              <span className="truncate">Nguồn: {item.resource.title}</span>
            </div>
          )}

          {item.isPublic && (
            <Button
              onClick={handleCopyLink}
              variant="outline"
              size="sm"
              className="w-full h-7 rounded-lg border-slate-200 hover:bg-slate-50 text-[10px] font-bold flex items-center justify-center gap-1.5 text-slate-700"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-500" />
                  Đã copy URL chia sẻ!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 text-slate-400" />
                  Copy link chia sẻ
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
