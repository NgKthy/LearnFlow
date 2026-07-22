import { prisma } from "@/lib/prisma";
import { OpportunitiesPageClient } from "@/components/opportunity/OpportunitiesPageClient";
import { Briefcase } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OpportunitiesPage() {
  const opportunities = await prisma.opportunity.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <section className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Briefcase className="h-8 w-8 text-[#0056D2]" />
          Cơ hội học tập & Việc làm
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Lưu trữ, quản lý và theo dõi trạng thái ứng tuyển học bổng, vị trí thực tập hoặc việc làm của bạn
        </p>
      </div>

      <OpportunitiesPageClient opportunities={opportunities} />
    </section>
  );
}
