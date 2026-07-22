import { prisma } from "@/lib/prisma";

import Link from "next/link";

import { ResourceCard } from "@/components/resource/ResourceCard";

import {
  BookOpen,
  CheckCircle2,
  Flame,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const totalResourcesQuery =
    prisma.resource.count();

  const dueFlashcardsQuery =
    prisma.flashcard.count({
      where: {
        nextReview: {
          lte: new Date(),
        },
      },
    });

  const recentResourcesQuery =
    prisma.resource.findMany({
      take: 4,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        tags: true,
      },
    });

  const [
    totalResources,
    dueFlashcards,
    recentResources,
  ] = await Promise.all([
    totalResourcesQuery,
    dueFlashcardsQuery,
    recentResourcesQuery,
  ]);

  return (
    <main className="container mx-auto space-y-8 p-6">

      {/* Page Header */}

      <header className="space-y-2">

        <h1 className="text-3xl font-bold">
          Tổng quan học tập
        </h1>

        <p className="text-muted-foreground">
          Theo dõi tiến độ học tập và quản lý
          thư viện kiến thức của bạn.
        </p>

      </header>

      {/* ===================================== */}
      {/* Phase 9 - Part 2: Stats Cards */}
      {/* ===================================== */}

      <div className="grid gap-6 md:grid-cols-2">

        {/* Total Resources */}

        <Card>

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

            <CardTitle className="text-sm font-medium">

              Tài liệu đã lưu

            </CardTitle>

            <BookOpen className="h-5 w-5 text-muted-foreground" />

          </CardHeader>

          <CardContent>

            <div className="text-4xl font-bold">

              {totalResources}

            </div>

            <p className="mt-2 text-sm text-muted-foreground">

              Tổng số tài liệu trong thư viện học tập.

            </p>

          </CardContent>

        </Card>

        {/* Due Flashcards */}

        <Card>

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

            <CardTitle className="text-sm font-medium">

              Thẻ cần ôn hôm nay

            </CardTitle>

            <Flame
              className={
                dueFlashcards > 0
                  ? "h-5 w-5 text-orange-500"
                  : "h-5 w-5 text-muted-foreground"
              }
            />

          </CardHeader>

          <CardContent>

            <div
              className={
                dueFlashcards > 0
                  ? "text-4xl font-bold text-orange-500"
                  : "text-4xl font-bold"
              }
            >

              {dueFlashcards}

            </div>

            <p className="mt-2 text-sm text-muted-foreground">

              Flashcards đã đến lịch ôn tập.

            </p>

            {dueFlashcards > 0 ? (

              <Button
                asChild
                className="mt-6 w-full"
              >

                <Link href="/review">

                  🔥 Ôn tập ngay

                </Link>

              </Button>

            ) : (

              <div className="mt-6 flex items-center gap-2 text-sm text-green-600">

                <CheckCircle2 className="h-5 w-5" />

                <span>

                  🎉 Bạn đã hoàn thành mục tiêu hôm nay!

                </span>

              </div>

            )}

          </CardContent>

        </Card>

      </div>

      {/* ===================================== */}
      {/* Phase 10 - Part 3: Recent Resources */}
      {/* ===================================== */}

      <div className="space-y-4">

        {/* Header */}

        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-semibold tracking-tight">

            Tài liệu gần đây

          </h2>

          <Button
            asChild
            variant="outline"
          >

            <Link href="/library">

              Xem tất cả

            </Link>

          </Button>

        </div>

        {/* Resource List */}

        {recentResources.length === 0 ? (

          <div className="rounded-xl border border-dashed p-10 text-center">

            <p className="text-muted-foreground">

              Chưa có tài liệu nào.

            </p>

            <p className="mt-2 text-sm text-muted-foreground">

              Hãy thêm tài liệu mới nhé!

            </p>

          </div>

        ) : (

          <div
            className="
                mt-4
                grid
                grid-cols-1
                gap-6
                md:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
            "
          >

            {recentResources.map(
              (resource) => (

                <ResourceCard
                  key={resource.id}
                  resource={resource}
                />

              )
            )}

          </div>

        )}

      </div>

    </main>
  );
}