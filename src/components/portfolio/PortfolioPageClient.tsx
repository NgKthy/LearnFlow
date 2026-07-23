"use client";

import React, { useState, useEffect, useTransition } from "react";
import { PortfolioCard } from "./PortfolioCard";
import { PortfolioForm } from "./PortfolioForm";
import { Sparkles, Award } from "lucide-react";
import { reorderPortfolioItems } from "@/app/portfolio/actions";
import { useRouter } from "next/navigation";

interface ResourceData {
  id: string;
  title: string;
}

interface PortfolioItemData {
  id: string;
  title: string;
  description: string | null;
  isPublic: boolean;
  order: number;
  resourceId: string | null;
  resource: ResourceData | null;
}

interface PortfolioPageClientProps {
  initialItems: PortfolioItemData[];
  resources: ResourceData[];
}

export function PortfolioPageClient({
  initialItems,
  resources,
}: PortfolioPageClientProps) {
  const router = useRouter();
  const [items, setItems] = useState<PortfolioItemData[]>(initialItems);
  const [editingItem, setEditingItem] = useState<PortfolioItemData | null>(null);
  const [isPending, startTransition] = useTransition();

  // Sync state with server items when page reloads
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleEdit = (item: PortfolioItemData) => {
    setEditingItem(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearEdit = () => {
    setEditingItem(null);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const reordered = [...items];
    // Swap items
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    // Optimistically update state
    setItems(reordered);

    // Call server action to persist
    startTransition(async () => {
      try {
        const orderedIds = reordered.map((item) => item.id);
        const res = await reorderPortfolioItems(orderedIds);
        if (res.success) {
          router.refresh();
        }
      } catch (err) {
        console.error("Reorder failed:", err);
        // Revert on error
        setItems(initialItems);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Portfolio Items List */}
      <div className="lg:col-span-2 space-y-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-slate-200 rounded-xl">
            <Award className="h-8 w-8 text-slate-300 mb-3" />
            <p className="text-slate-600 font-bold text-xs">Chưa có thành quả nào trong Portfolio</p>
            <p className="text-slate-500 text-[10px] font-semibold mt-0.5">
              Hãy dùng biểu mẫu bên cạnh để bắt đầu thêm các chứng chỉ, kết quả học tập tiêu biểu.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item, idx) => (
              <PortfolioCard
                key={item.id}
                item={item}
                onEdit={() => handleEdit(item)}
                onMoveUp={() => handleMove(idx, "up")}
                onMoveDown={() => handleMove(idx, "down")}
                isFirst={idx === 0}
                isLast={idx === items.length - 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* Form Area */}
      <div className="lg:col-span-1">
        <PortfolioForm
          resources={resources}
          editingItem={editingItem}
          onClearEdit={handleClearEdit}
        />
      </div>
    </div>
  );
}
