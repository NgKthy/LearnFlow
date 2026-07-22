import { prisma } from "@/lib/prisma";
import { InboxManager } from "@/components/inbox/InboxManager";
import { Inbox } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function InboxPage() {
  // Fetch unclassified raw resources in INBOX status
  const inboxResources = await prisma.resource.findMany({
    where: {
      status: "INBOX",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch courses to assign to
  const courses = await prisma.course.findMany({
    where: {
      status: "ACTIVE",
    },
    select: {
      id: true,
      title: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <section className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Inbox className="h-8 w-8 text-[#0056D2]" />
          Hòm thư (Inbox)
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Xem và phân loại nhanh các tài nguyên học tập vừa nhận được từ Telegram Bot hoặc tải lên thô
        </p>
      </div>

      <InboxManager 
        resources={inboxResources} 
        courses={courses} 
      />
    </section>
  );
}
