"use client";

import React, { useState, useEffect, useTransition } from "react";
import { createPortfolioItem, updatePortfolioItem } from "@/app/portfolio/actions";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Sparkles, 
  X, 
  Loader2, 
  Save, 
  Globe, 
  Lock,
  Link2
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ResourceOption {
  id: string;
  title: string;
}

interface PortfolioFormProps {
  resources: ResourceOption[];
  editingItem: {
    id: string;
    title: string;
    description: string | null;
    isPublic: boolean;
    resourceId: string | null;
  } | null;
  onClearEdit: () => void;
}

export function PortfolioForm({
  resources,
  editingItem,
  onClearEdit,
}: PortfolioFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [resourceId, setResourceId] = useState("");

  // Hydrate editing data
  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      setDescription(editingItem.description || "");
      setIsPublic(editingItem.isPublic);
      setResourceId(editingItem.resourceId || "");
    } else {
      setTitle("");
      setDescription("");
      setIsPublic(false);
      setResourceId("");
    }
  }, [editingItem]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) return;

    startTransition(async () => {
      try {
        const payload = {
          title,
          description: description || undefined,
          isPublic,
          resourceId: resourceId || null,
        };

        if (editingItem) {
          const res = await updatePortfolioItem(editingItem.id, payload);
          if (res.success) {
            onClearEdit();
            router.refresh();
          }
        } else {
          const res = await createPortfolioItem(payload);
          if (res.success) {
            setTitle("");
            setDescription("");
            setIsPublic(false);
            setResourceId("");
            router.refresh();
          }
        }
      } catch (err: any) {
        setError(err.message || "Không thể lưu thành quả.");
      }
    });
  };

  return (
    <Card className="border border-slate-200 bg-white shadow-sm rounded-xl">
      <CardHeader className="border-b border-slate-100 py-4 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles className="h-4.5 w-4.5 text-[#0056D2]" />
            {editingItem ? "Sửa thành quả học tập" : "Thêm thành quả mới"}
          </CardTitle>
          <CardDescription className="text-[10px] text-slate-500">
            Giới thiệu và chia sẻ các kết quả, chứng chỉ hoặc học liệu tiêu biểu của bạn.
          </CardDescription>
        </div>

        {editingItem && (
          <Button
            size="icon"
            variant="ghost"
            onClick={onClearEdit}
            className="h-6 w-6 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded"
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
            <label htmlFor="portfolio_title" className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              Tiêu đề thành quả *
            </label>
            <input
              id="portfolio_title"
              type="text"
              placeholder="Ví dụ: Hoàn thành khóa học React Cơ Bản"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#0056D2] text-slate-800"
              disabled={isPending}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label htmlFor="portfolio_desc" className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              Mô tả chi tiết
            </label>
            <textarea
              id="portfolio_desc"
              rows={3}
              placeholder="Chia sẻ thêm thông tin về chứng nhận hoặc mục tiêu đạt được..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#0056D2] resize-none text-slate-800"
              disabled={isPending}
            />
          </div>

          {/* Linked Resource Selector */}
          <div className="space-y-1.5">
            <label htmlFor="portfolio_resource" className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Link2 className="h-3.5 w-3.5 text-slate-400" />
              Liên kết học liệu (Tùy chọn)
            </label>
            <select
              id="portfolio_resource"
              value={resourceId}
              onChange={(e) => setResourceId(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0056D2]"
              disabled={isPending}
            >
              <option value="">-- Chọn học liệu liên quan --</option>
              {resources.map((res) => (
                <option key={res.id} value={res.id}>
                  {res.title}
                </option>
              ))}
            </select>
          </div>

          {/* Public / Private toggle button option */}
          <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-lg p-2.5">
            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold text-slate-700 block">Trạng thái hiển thị</span>
              <span className="text-[9px] text-slate-500 leading-none">Công khai trên Portfolio của bạn</span>
            </div>
            <button
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              disabled={isPending}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition-all border ${
                isPublic
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                  : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
              }`}
            >
              {isPublic ? (
                <>
                  <Globe className="h-3.5 w-3.5" />
                  Công khai (Public)
                </>
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5" />
                  Riêng tư (Private)
                </>
              )}
            </button>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isPending || !title.trim()}
            className="w-full rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white text-xs font-semibold py-1.5 flex items-center justify-center gap-1"
          >
            {isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : editingItem ? (
              <>
                <Save className="h-3.5 w-3.5" />
                Lưu cập nhật
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                Thêm thành quả
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
