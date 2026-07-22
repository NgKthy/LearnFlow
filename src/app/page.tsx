import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ResourceCard } from "@/components/resource/ResourceCard";
import { 
  BookOpen, 
  CheckCircle2, 
  Flame, 
  Sparkles, 
  GraduationCap, 
  Brain, 
  BarChart3, 
  Plus, 
  ChevronRight, 
  Clock, 
  Award 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDashboardChartData, getCourseProgressData, getTodayTasksData } from "@/app/actions";
import { LearningBarChart } from "@/components/dashboard/LearningBarChart";
import { CourseProgressChart } from "@/components/dashboard/CourseProgressChart";
import { TodayTasks } from "@/components/dashboard/TodayTasks";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const totalResourcesQuery = prisma.resource.count();

  const dueFlashcardsQuery = prisma.flashcard.count({
    where: {
      nextReview: {
        lte: new Date(),
      },
    },
  });

  const totalFlashcardsQuery = prisma.flashcard.count();

  const recentResourcesQuery = prisma.resource.findMany({
    take: 4,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      tags: true,
    },
  });

  const activitiesQuery = prisma.activity.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const [
    totalResources,
    dueFlashcards,
    totalFlashcards,
    recentResources,
    activities,
  ] = await Promise.all([
    totalResourcesQuery,
    dueFlashcardsQuery,
    totalFlashcardsQuery,
    recentResourcesQuery,
    activitiesQuery,
  ]);

  const [resourceChartData, courseProgressData, todayTasksData] = await Promise.all([
    getDashboardChartData(),
    getCourseProgressData(),
    getTodayTasksData(),
  ]);

  // Normalize date format YYYY-MM-DD
  const dates = Array.from(
    new Set(
      activities.map((a) => {
        const d = new Date(a.createdAt);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      })
    )
  );

  const getLocalDateString = (d: Date) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const todayStr = getLocalDateString(new Date());
  const yesterdayStr = getLocalDateString(new Date(Date.now() - 86400000));

  // Streak calculation
  let streak = 0;
  if (dates.includes(todayStr) || dates.includes(yesterdayStr)) {
    const checkDate = dates.includes(todayStr) ? new Date() : new Date(Date.now() - 86400000);
    while (true) {
      const checkStr = getLocalDateString(checkDate);
      if (dates.includes(checkStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Quiz accuracy calculation
  const quizCompletions = activities.filter(a => a.action === "QUIZ_COMPLETED");
  let avgAccuracy = 0;
  if (quizCompletions.length > 0) {
    const totalPercentage = quizCompletions.reduce((sum, act) => {
      try {
        const payload = JSON.parse(act.payload ?? "{}");
        return sum + (payload.percentage ?? 0);
      } catch {
        return sum;
      }
    }, 0);
    avgAccuracy = Math.round(totalPercentage / quizCompletions.length);
  }

  return (
    <main className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 font-sans leading-relaxed text-[#1F1F1F]">
      
      {/* Coursera-Inspired Light Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-white p-6 md:p-8 shadow-sm">
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[#0056D2]">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <span className="text-[10px] font-extrabold tracking-widest text-[#0056D2] uppercase">
                Bảng điều khiển
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Tổng quan học tập
            </h1>
            <p className="text-slate-500 max-w-xl text-xs sm:text-sm leading-relaxed">
              Chào mừng bạn trở lại! Hãy theo dõi tiến độ tích lũy kiến thức, ôn luyện bộ thẻ ghi nhớ thông minh và tham gia trắc nghiệm củng cố.
            </p>
          </div>
          <div className="flex shrink-0">
            <Button asChild className="rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white shadow-sm font-semibold text-xs py-2 px-4">
              <Link href="/upload">
                <Plus className="mr-1.5 h-4 w-4" />
                Thêm tài liệu mới
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Today Tasks Panel */}
      <TodayTasks 
        todayRoutines={todayTasksData.todayRoutines} 
        inboxCount={todayTasksData.inboxCount} 
      />

      {/* Stats Dashboard Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Total Ingested Resources */}
        <Card className="border border-slate-200 bg-white shadow-sm rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-extrabold tracking-wider text-slate-500 uppercase">
              Tài liệu đã lưu
            </CardTitle>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#0056D2]">
              <BookOpen className="h-4 w-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">{totalResources}</div>
            <p className="mt-1.5 text-xs text-slate-400 font-semibold">Tài liệu trong thư viện cá nhân.</p>
          </CardContent>
        </Card>

        {/* Due Flashcards */}
        <Card className="border border-slate-200 bg-white shadow-sm rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-extrabold tracking-wider text-slate-500 uppercase">
              Cần ôn hôm nay
            </CardTitle>
            <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${dueFlashcards > 0 ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-400"}`}>
              <Brain className="h-4 w-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-extrabold ${dueFlashcards > 0 ? "text-amber-600" : "text-slate-900"}`}>
              {dueFlashcards}
            </div>
            <div className="mt-3">
              {dueFlashcards > 0 ? (
                <Button asChild size="sm" className="w-full rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white font-semibold text-xs py-1.5">
                  <Link href="/review">🔥 Ôn tập ngay</Link>
                </Button>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 py-1.5 px-3 rounded-lg border border-emerald-100">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Hoàn thành mục tiêu!</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quiz Accuracy */}
        <Card className="border border-slate-200 bg-white shadow-sm rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-extrabold tracking-wider text-slate-500 uppercase">
              Chính xác Quiz
            </CardTitle>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Award className="h-4 w-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">
              {quizCompletions.length > 0 ? `${avgAccuracy}%` : "--"}
            </div>
            <p className="mt-1.5 text-xs text-slate-400 font-semibold">
              {quizCompletions.length > 0 ? `Trung bình qua ${quizCompletions.length} lượt thi.` : "Chưa thực hiện trắc nghiệm."}
            </p>
          </CardContent>
        </Card>

        {/* Learning Streak */}
        <Card className="border border-slate-200 bg-white shadow-sm rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-extrabold tracking-wider text-slate-500 uppercase">
              Chuỗi học tập
            </CardTitle>
            <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${streak > 0 ? "bg-orange-50 text-orange-600" : "bg-slate-50 text-slate-400"}`}>
              <Flame className="h-4 w-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-extrabold ${streak > 0 ? "text-orange-600" : "text-slate-900"}`}>
              {streak} <span className="text-xs font-semibold text-slate-400">ngày</span>
            </div>
            <p className="mt-1.5 text-xs text-slate-400 font-semibold">
              {streak > 0 ? "Hãy duy trì thói quen học tập!" : "Bắt đầu học ngay hôm nay!"}
            </p>
          </CardContent>
        </Card>

      </div>

      {/* Learning Activity & Course Progress Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <LearningBarChart data={resourceChartData} />
        <CourseProgressChart data={courseProgressData} />
      </div>

      {/* Core Quick Navigation Shortcuts */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/upload" className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 hover:border-blue-300 hover:shadow-sm transition-all shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0056D2] group-hover:scale-105 transition-transform">
              <Plus className="h-5 w-5" />
            </span>
            <div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-[#0056D2] block">Ingest tài liệu</span>
              <span className="text-[10px] text-slate-400 font-semibold">Tải lên PDF / Link YouTube</span>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#0056D2] transition-colors" />
        </Link>
        <Link href="/flashcards" className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 hover:border-blue-300 hover:shadow-sm transition-all shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform">
              <Brain className="h-5 w-5" />
            </span>
            <div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-[#0056D2] block">Thẻ ghi nhớ</span>
              <span className="text-[10px] text-slate-400 font-semibold">Xem và luyện tập tất cả thẻ</span>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#0056D2] transition-colors" />
        </Link>
        <Link href="/quiz" className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 hover:border-blue-300 hover:shadow-sm transition-all shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 group-hover:scale-105 transition-transform">
              <GraduationCap className="h-5 w-5" />
            </span>
            <div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-[#0056D2] block">Bài trắc nghiệm</span>
              <span className="text-[10px] text-slate-400 font-semibold">Khảo sát kiến thức qua bài thi</span>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#0056D2] transition-colors" />
        </Link>
      </div>

      {/* Recent Resources Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-slate-600">
              <Clock className="h-3.5 w-3.5" />
            </span>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              Tài liệu mới lưu gần đây
            </h2>
          </div>

          <Button asChild variant="ghost" className="text-xs text-[#0056D2] hover:text-[#00419e] hover:bg-blue-50/50">
            <Link href="/library" className="flex items-center gap-1">
              Xem tất cả thư viện
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {recentResources.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-12 text-center bg-slate-50">
            <p className="text-slate-500 font-bold text-xs">Chưa có tài liệu học tập nào được lưu.</p>
            <p className="mt-1 text-[10px] text-slate-400 font-semibold">Hãy thêm một vài tài liệu PDF bằng cách bấm nút "Thêm tài liệu" ở trên.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recentResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </div>

    </main>
  );
}