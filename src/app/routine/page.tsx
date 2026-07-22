import { prisma } from "@/lib/prisma";
import { RoutineManager } from "@/components/routine/RoutineManager";
import { CalendarCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RoutinePage() {
  // Fetch routines, courses and completed resources
  const routines = await prisma.routine.findMany({
    include: {
      course: {
        select: {
          id: true,
          title: true,
        },
      },
      resource: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      time: "asc",
    },
  });

  const courses = await prisma.course.findMany({
    where: {
      status: "ACTIVE",
    },
    select: {
      id: true,
      title: true,
    },
  });

  const resources = await prisma.resource.findMany({
    where: {
      status: "COMPLETED", // processed and ready for learning
    },
    select: {
      id: true,
      title: true,
    },
  });

  return (
    <section className="space-y-8">
      {/* Header banner */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <CalendarCheck className="h-8 w-8 text-[#0056D2]" />
          Lịch học tập (Routine)
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Thiết lập và quản lý các khoảng thời gian học tập lặp lại hàng ngày hoặc hàng tuần
        </p>
      </div>

      {/* Interactive Manager */}
      <RoutineManager 
        initialRoutines={routines} 
        courses={courses} 
        resources={resources} 
      />
    </section>
  );
}
