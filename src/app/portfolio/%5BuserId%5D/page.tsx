import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Globe, Link2, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

interface PublicPortfolioPageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function PublicPortfolioPage({
  params,
}: PublicPortfolioPageProps) {
  const resolvedParams = await params;
  const { userId } = resolvedParams;

  // Fetch only public portfolio items for the specified user, sorted by order
  const portfolioItems = await prisma.portfolioItem.findMany({
    where: {
      userId,
      isPublic: true,
    },
    include: {
      resource: {
        select: {
          id: true,
          title: true,
          url: true,
          type: true,
          source: true,
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  return (
    <div className="space-y-10 max-w-4xl mx-auto py-10 px-4">
      {/* Portfolio Owner Header Info */}
      <div className="text-center space-y-3 pb-8 border-b border-slate-200">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 border border-blue-100 text-[#0056D2] shadow-sm mb-2 animate-pulse">
          <Award className="h-7 w-7" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Hồ Sơ Học Tập Cá Nhân
        </h1>
        <p className="text-sm font-semibold text-slate-500 flex items-center justify-center gap-1.5 uppercase tracking-wider">
          <Globe className="h-4 w-4 text-emerald-500" />
          Mã định danh học viên: <span className="text-[#0056D2] font-bold">{userId}</span>
        </p>
        <p className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed">
          Nơi lưu giữ, tích lũy các thành quả nghiên cứu, chứng nhận và học liệu tiêu biểu được chọn lọc từ hệ thống quản lý học tập cá nhân LearnFlow.
        </p>
      </div>

      {/* Portfolio Items List */}
      {portfolioItems.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-sm max-w-lg mx-auto">
          <Sparkles className="h-10 w-10 text-slate-300 mx-auto mb-4" />
          <h4 className="text-base font-bold text-slate-900">Không có dữ liệu hiển thị</h4>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Học viên chưa thiết lập hoặc chưa kích hoạt công khai thành quả học tập nào trên hồ sơ này.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {portfolioItems.map((item) => (
            <Card key={item.id} className="border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
              <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
                
                {/* Details Content */}
                <div className="space-y-3 flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                  
                  {item.description && (
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                      {item.description}
                    </p>
                  )}

                  {/* Linked Resource */}
                  {item.resource && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                        Tài nguyên tham chiếu:
                      </span>
                      <div className="inline-flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 w-max max-w-full">
                        <Link2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {item.resource.url ? (
                          <a 
                            href={item.resource.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-bold text-[#0056D2] hover:underline truncate"
                          >
                            {item.resource.title}
                          </a>
                        ) : (
                          <span className="font-bold text-slate-700 truncate">
                            {item.resource.title}
                          </span>
                        )}
                        <Badge variant="outline" className="text-[9px] uppercase font-bold px-1.5 py-0 bg-slate-100 text-slate-500 border-slate-200 shrink-0 ml-1">
                          {item.resource.source}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right stamp decorations */}
                <div className="hidden md:flex flex-col items-end gap-2 text-right shrink-0">
                  <span className="text-[10px] font-bold text-slate-400">
                    Đã kiểm chứng
                  </span>
                  <div className="h-10 w-10 rounded-full border-2 border-emerald-500/20 flex items-center justify-center text-emerald-500 bg-emerald-50/50">
                    <Sparkles className="h-4.5 w-4.5" />
                  </div>
                </div>

              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Simple Visitor Footer */}
      <div className="text-center pt-8 border-t border-slate-200 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
        Cung cấp bởi LearnFlow Personal LMS
      </div>
    </div>
  );
}
