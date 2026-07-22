import { prisma } from "@/lib/prisma";
import { TagManager } from "@/components/tags/TagManager";
import { Tags } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TagsPage() {
  // Fetch tags with count of resources
  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: {
          resources: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <section className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Tags className="h-8 w-8 text-[#0056D2]" />
          Quản lý nhãn (Taxonomy)
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Quản lý, gộp nhãn trùng lặp và thống kê tài nguyên học tập theo từng từ khóa
        </p>
      </div>

      <TagManager tags={tags} />
    </section>
  );
}
