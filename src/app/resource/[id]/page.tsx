import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock3, ExternalLink, Loader2, RefreshCw } from "lucide-react";

import { prisma } from "@/lib/prisma";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import { FlashcardViewer } from "@/components/learning/FlashcardViewer";
import { QuizViewer } from "@/components/learning/QuizViewer";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ResourceDetailPage({
    params,
}: PageProps) {
    const { id } = await params;

    const resource = await prisma.resource.findUnique({
        where: {
            id,
        },
        include: {
            tags: true,
            flashcards: true,
            quizQuestions: true,
        },
    });

    if (!resource) {
        notFound();
    }

    if (resource.status === "PROCESSING") {
        return (
            <div className="mx-auto max-w-lg py-16 px-4">
                <meta httpEquiv="refresh" content="5" />
                <Card className="backdrop-blur-md bg-white/40 dark:bg-black/30 border border-white/20 shadow-2xl rounded-3xl p-8 text-center flex flex-col items-center justify-center space-y-6">
                    <div className="relative flex items-center justify-center">
                        <Loader2 className="h-14 w-14 text-primary animate-spin" />
                        <div className="absolute text-xs font-bold text-primary">AI</div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-bold text-xl text-foreground">
                            Đang phân tích học liệu bằng AI...
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Hệ thống đang tóm tắt tài liệu, gắn tag và tự động tạo các câu hỏi ôn tập (Flashcards & Quiz).
                        </p>
                        <p className="text-xs text-muted-foreground/80 italic flex items-center justify-center gap-1.5 pt-2">
                            <RefreshCw className="h-3 w-3 animate-spin text-primary" />
                            Trang sẽ tự động cập nhật sau mỗi 5 giây...
                        </p>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl space-y-8">

            {/* ---------- Header ---------- */}

            <section className="space-y-4">

                <div className="flex flex-wrap items-start justify-between gap-4">

                    <div className="space-y-3">

                        <h1 className="text-3xl font-bold">
                            {resource.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-2">

                            <Badge>
                                {resource.source}
                            </Badge>

                            {resource.difficulty && (
                                <Badge variant="secondary">
                                    {resource.difficulty}
                                </Badge>
                            )}

                            {resource.estimatedReadingTime && (
                                <Badge
                                    variant="outline"
                                    className="flex items-center gap-1"
                                >
                                    <Clock3 className="h-3.5 w-3.5" />

                                    {resource.estimatedReadingTime}
                                    phút
                                </Badge>
                            )}

                        </div>

                    </div>

                    <Button asChild>

                        <Link
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <ExternalLink className="mr-2 h-4 w-4" />

                            Mở tài liệu gốc

                        </Link>

                    </Button>

                </div>

                {/* ---------- Tags ---------- */}

                <div className="flex flex-wrap gap-2">

                    {resource.tags.map(tag => (
                        <Badge
                            key={tag.id}
                            variant="secondary"
                        >
                            {tag.name}
                        </Badge>
                    ))}

                </div>

            </section>

            {/* ---------- Summary ---------- */}

            <Card>

                <CardHeader>

                    <CardTitle>
                        📄 Tóm tắt
                    </CardTitle>

                </CardHeader>

                <CardContent>

                    <blockquote
                        className="
                            border-l-4
                            border-primary
                            bg-muted/40
                            p-4
                            rounded-r-lg
                            leading-7
                            whitespace-pre-wrap
                        "
                    >
                        {resource.summary ??
                            "Chưa có tóm tắt."}
                    </blockquote>

                </CardContent>

            </Card>

            {/* ---------- Learning ---------- */}

            <Tabs
                defaultValue="flashcards"
                className="space-y-6"
            >

                <TabsList>

                    <TabsTrigger value="flashcards">
                        Flashcards
                    </TabsTrigger>

                    <TabsTrigger value="quiz">
                        Quiz
                    </TabsTrigger>

                </TabsList>

                <TabsContent value="flashcards">

                    <FlashcardViewer
                        flashcards={resource.flashcards}
                    />

                </TabsContent>

                <TabsContent value="quiz">

                    <QuizViewer
                        quizQuestions={
                            resource.quizQuestions
                        }
                    />

                </TabsContent>

            </Tabs>

        </div>
    );
}