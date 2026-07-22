import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock3, ExternalLink } from "lucide-react";

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