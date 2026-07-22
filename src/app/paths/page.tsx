import { prisma } from "@/lib/prisma";
import { PathsPageClient } from "@/components/path/PathsPageClient";
import { Route } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PathsPage() {
  // Fetch paths including their courses and resource completion status
  const paths = await prisma.path.findMany({
    include: {
      courses: {
        include: {
          resources: {
            select: {
              status: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch active courses to be used as options in the path creator/editor
  const courses = await prisma.course.findMany({
    where: {
      status: "ACTIVE",
    },
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
          <Route className="h-8 w-8 text-[#0056D2]" />
          Lộ trình học tập (Paths)
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Thiết lập lộ trình học tập chuyên sâu bằng cách nhóm và sắp xếp các khóa học theo thứ tự tăng dần
        </p>
      </div>

      <PathsPageClient paths={paths} courses={courses} />
    </section>
  );
}
