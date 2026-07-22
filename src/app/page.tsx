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
    <main className="container mx-auto space-y-10 p-4 sm:p-6 lg:p-8">
      
      {/* Visual Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-8 shadow-2xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl"></div>
        <div className="absolute left-1/3 bottom-0 -mb-16 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl"></div>

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <span className="text-xs font-semibold tracking-widest text-indigo-400 uppercase">Dashboard</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
              Tổng quan học tập
            </h1>
            <p className="text-slate-400 max-w-xl text-sm leading-relaxed">
              Chào mừng bạn trở lại! Hãy theo dõi tiến độ tích lũy kiến thức, ôn luyện bộ thẻ ghi nhớ thông minh và tham gia trắc nghiệm củng cố.
            </p>
          </div>
          <div className="flex shrink-0 gap-3">
            <Button asChild className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">
              <Link href="/upload">
                <Plus className="mr-1.5 h-4 w-4" />
                Thêm tài liệu
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Dashboard Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Total Ingested Resources */}
        <Card className="relative overflow-hidden border-white/5 bg-slate-900/40 shadow-lg hover:bg-slate-900/60 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold tracking-wider text-slate-400 uppercase">Tài liệu đã lưu</CardTitle>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <BookOpen className="h-4 w-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-white">{totalResources}</div>
            <p className="mt-2 text-xs text-slate-500">Tài liệu trong thư viện cá nhân.</p>
          </CardContent>
        </Card>

        {/* Due Flashcards */}
        <Card className="relative overflow-hidden border-white/5 bg-slate-900/40 shadow-lg hover:bg-slate-900/60 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold tracking-wider text-slate-400 uppercase">Cần ôn hôm nay</CardTitle>
            <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${dueFlashcards > 0 ? "bg-amber-500/10 text-amber-400" : "bg-slate-500/10 text-slate-400"}`}>
              <Brain className="h-4 w-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className={`text-4xl font-extrabold ${dueFlashcards > 0 ? "text-amber-400" : "text-white"}`}>
              {dueFlashcards}
            </div>
            <div className="mt-4">
              {dueFlashcards > 0 ? (
                <Button asChild size="sm" className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium text-xs">
                  <Link href="/review">🔥 Ôn tập ngay</Link>
                </Button>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 py-1.5 px-3 rounded-lg border border-emerald-500/20">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Hoàn thành mục tiêu!</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quiz Accuracy */}
        <Card className="relative overflow-hidden border-white/5 bg-slate-900/40 shadow-lg hover:bg-slate-900/60 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold tracking-wider text-slate-400 uppercase">Chính xác Quiz</CardTitle>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
              <Award className="h-4 w-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-white">
              {quizCompletions.length > 0 ? `${avgAccuracy}%` : "--"}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {quizCompletions.length > 0 ? `Trung bình qua ${quizCompletions.length} lượt thi.` : "Chưa thực hiện trắc nghiệm."}
            </p>
          </CardContent>
        </Card>

        {/* Learning Streak */}
        <Card className="relative overflow-hidden border-white/5 bg-slate-900/40 shadow-lg hover:bg-slate-900/60 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold tracking-wider text-slate-400 uppercase">Chuỗi học tập</CardTitle>
            <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${streak > 0 ? "bg-orange-500/10 text-orange-400" : "bg-slate-500/10 text-slate-400"}`}>
              <Flame className="h-4 w-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className={`text-4xl font-extrabold ${streak > 0 ? "text-orange-400" : "text-white"}`}>
              {streak} <span className="text-lg font-medium text-slate-500">ngày</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {streak > 0 ? "Hãy tiếp tục duy trì ngọn lửa!" : "Bắt đầu học ngay hôm nay!"}
            </p>
          </CardContent>
        </Card>

      </div>

      {/* Core Quick Navigation Shortcuts */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/upload" className="group flex items-center justify-between rounded-2xl border border-white/5 bg-slate-900/30 p-4 hover:bg-slate-900/60 transition-all">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
              <Plus className="h-5 w-5" />
            </span>
            <div>
              <span className="text-sm font-bold text-white block">Ingest tài liệu</span>
              <span className="text-xs text-slate-500">Tải lên PDF/Link YouTube</span>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-white transition-colors" />
        </Link>
        <Link href="/flashcards" className="group flex items-center justify-between rounded-2xl border border-white/5 bg-slate-900/30 p-4 hover:bg-slate-900/60 transition-all">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <Brain className="h-5 w-5" />
            </span>
            <div>
              <span className="text-sm font-bold text-white block">Thẻ ghi nhớ</span>
              <span className="text-xs text-slate-500">Xem và luyện tập tất cả thẻ</span>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-white transition-colors" />
        </Link>
        <Link href="/quiz" className="group flex items-center justify-between rounded-2xl border border-white/5 bg-slate-900/30 p-4 hover:bg-slate-900/60 transition-all">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 group-hover:scale-110 transition-transform">
              <GraduationCap className="h-5 w-5" />
            </span>
            <div>
              <span className="text-sm font-bold text-white block">Bài trắc nghiệm</span>
              <span className="text-xs text-slate-500">Khảo sát kiến thức qua bài thi</span>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-white transition-colors" />
        </Link>
      </div>

      {/* Recent Resources Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-800 text-slate-400">
              <Clock className="h-3.5 w-3.5" />
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-white">Tài liệu mới lưu gần đây</h2>
          </div>

          <Button asChild variant="ghost" className="text-xs text-indigo-400 hover:text-indigo-300">
            <Link href="/library" className="flex items-center gap-1">
              Xem tất cả thư viện
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {recentResources.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center bg-slate-900/10">
            <p className="text-slate-400 font-medium">Chưa có tài liệu học tập nào được lưu.</p>
            <p className="mt-1 text-xs text-slate-600">Hãy thêm một vài tài liệu PDF bằng cách bấm nút "Thêm tài liệu" ở trên.</p>
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