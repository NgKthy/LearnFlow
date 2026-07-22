"use client";

import React, { useState, useTransition } from "react";
import { createTag, updateTag, deleteTag, mergeTags } from "@/app/tags/actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Tag, 
  Trash2, 
  Edit2, 
  Plus, 
  Combine, 
  Loader2, 
  X, 
  Check,
  Search,
  BookOpen
} from "lucide-react";
import { useRouter } from "next/navigation";

interface TagWithCount {
  id: string;
  name: string;
  _count: {
    resources: number;
  };
}

interface TagManagerProps {
  tags: TagWithCount[];
}

export function TagManager({ tags }: TagManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [newTagName, setNewTagName] = useState("");
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editingTagName, setEditingTagName] = useState("");
  
  // Merge states
  const [sourceTagId, setSourceTagId] = useState("");
  const [targetTagId, setTargetTagId] = useState("");
  
  // Search
  const [searchTerm, setSearchTerm] = useState("");

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!newTagName.trim()) return;

    startTransition(async () => {
      try {
        const res = await createTag(newTagName);
        if (res.success) {
          setNewTagName("");
          router.refresh();
        }
      } catch (err: any) {
        setError(err.message || "Tạo tag thất bại.");
      }
    });
  };

  const handleUpdate = (tagId: string) => {
    setError(null);
    if (!editingTagName.trim()) return;

    startTransition(async () => {
      try {
        const res = await updateTag(tagId, editingTagName);
        if (res.success) {
          setEditingTagId(null);
          setEditingTagName("");
          router.refresh();
        }
      } catch (err: any) {
        setError(err.message || "Cập nhật tag thất bại.");
      }
    });
  };

  const handleDelete = (tagId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tag này không? Học liệu liên quan sẽ không bị xóa.")) return;
    setError(null);

    startTransition(async () => {
      try {
        const res = await deleteTag(tagId);
        if (res.success) {
          router.refresh();
        }
      } catch (err: any) {
        setError(err.message || "Xóa tag thất bại.");
      }
    });
  };

  const handleMerge = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!sourceTagId || !targetTagId) return;

    if (sourceTagId === targetTagId) {
      setError("Vui lòng chọn hai tag khác nhau để gộp.");
      return;
    }

    if (!confirm("Hành động này sẽ chuyển toàn bộ học liệu và XÓA tag nguồn. Bạn có chắc muốn tiếp tục?")) return;

    startTransition(async () => {
      try {
        const res = await mergeTags(sourceTagId, targetTagId);
        if (res.success) {
          setSourceTagId("");
          setTargetTagId("");
          router.refresh();
        }
      } catch (err: any) {
        setError(err.message || "Gộp tag thất bại.");
      }
    });
  };

  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-semibold max-w-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Tag lists */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between py-4">
              <CardTitle className="text-sm font-bold text-slate-800">
                Tất cả nhãn gắn (Tags)
              </CardTitle>
              {/* Search bar */}
              <div className="relative w-48 sm:w-64">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm nhãn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1 text-xs focus:outline-none focus:bg-white focus:border-[#0056D2]"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredTags.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-400">
                  Không tìm thấy nhãn nào.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredTags.map((tag) => (
                    <div key={tag.id} className="p-4 flex items-center justify-between gap-4">
                      {editingTagId === tag.id ? (
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="text"
                            value={editingTagName}
                            onChange={(e) => setEditingTagName(e.target.value)}
                            className="flex-1 max-w-xs bg-white border border-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-[#0056D2]"
                            disabled={isPending}
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleUpdate(tag.id)}
                            disabled={isPending}
                            className="h-7 w-7 text-emerald-600 hover:bg-emerald-50 rounded"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setEditingTagId(null);
                              setEditingTagName("");
                            }}
                            disabled={isPending}
                            className="h-7 w-7 text-slate-400 hover:bg-slate-50 rounded"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex-1 min-w-0 flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0056D2] bg-blue-50 border border-blue-100 px-2.5 py-1 rounded">
                            <Tag className="h-3.5 w-3.5" />
                            {tag.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-0.5">
                            <BookOpen className="h-3 w-3" />
                            {tag._count.resources} tài liệu
                          </span>
                        </div>
                      )}

                      {editingTagId !== tag.id && (
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setEditingTagId(tag.id);
                              setEditingTagName(tag.name);
                            }}
                            disabled={isPending}
                            className="h-7 w-7 text-slate-400 hover:text-slate-700"
                            title="Đổi tên"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(tag.id)}
                            disabled={isPending}
                            className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                            title="Xóa nhãn"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Actions card (Create & Merge) */}
        <div className="space-y-6 lg:col-span-1">
          {/* Create tag */}
          <Card>
            <CardHeader className="border-b border-slate-100 py-4">
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Plus className="h-4.5 w-4.5 text-[#0056D2]" />
                Tạo nhãn mới
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleCreate} className="space-y-3.5">
                <div className="space-y-1">
                  <input
                    type="text"
                    placeholder="Tên nhãn (Ví dụ: ReactJS)"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#0056D2]"
                    disabled={isPending}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isPending || !newTagName.trim()}
                  className="w-full rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white text-xs font-semibold py-1.5"
                >
                  {isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin mx-auto" />
                  ) : (
                    "Tạo nhãn"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Merge tags */}
          <Card>
            <CardHeader className="border-b border-slate-100 py-4">
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Combine className="h-4.5 w-4.5 text-[#0056D2]" />
                Gộp nhãn trùng lặp
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleMerge} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                    Nhãn nguồn (Sẽ bị xóa)
                  </label>
                  <select
                    value={sourceTagId}
                    onChange={(e) => setSourceTagId(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#0056D2]"
                    disabled={isPending}
                    required
                  >
                    <option value="">-- Chọn nhãn nguồn --</option>
                    {tags.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t._count.resources})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                    Nhãn đích (Sẽ được giữ lại)
                  </label>
                  <select
                    value={targetTagId}
                    onChange={(e) => setTargetTagId(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#0056D2]"
                    disabled={isPending}
                    required
                  >
                    <option value="">-- Chọn nhãn đích --</option>
                    {tags.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t._count.resources})</option>
                    ))}
                  </select>
                </div>

                <Button
                  type="submit"
                  disabled={isPending || !sourceTagId || !targetTagId || sourceTagId === targetTagId}
                  className="w-full rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-1.5"
                >
                  {isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin mx-auto" />
                  ) : (
                    "Tiến hành gộp nhãn"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
