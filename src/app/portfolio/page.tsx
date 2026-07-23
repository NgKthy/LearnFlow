import { prisma } from "@/lib/prisma";
import { PortfolioPageClient } from "@/components/portfolio/PortfolioPageClient";
import { Award } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  // Fetch portfolio items ordered by order asc
  const portfolioItems = await prisma.portfolioItem.findMany({
    include: {
      resource: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  // Fetch all resources to allow linking them
  const resources = await prisma.resource.findMany({
    select: {
      id: true,
      title: true,
    },
    orderBy: {
      title: "asc",
    },
  });

  return (
    <section className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Award className="h-8 w-8 text-[#0056D2]" />
          Hồ sơ năng lực (Portfolio)
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Trình bày các kết quả, chứng chỉ học tập nổi bật và chia sẻ đường dẫn công khai cho mọi người.
        </p>
      </div>

      <PortfolioPageClient initialItems={portfolioItems} resources={resources} />
    </section>
  );
}
