import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

import { FlashcardViewer } from "@/components/learning/FlashcardViewer";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
    const dueFlashcards = await prisma.flashcard.findMany({
        where: {
            nextReview: {
                lte: new Date(),
            },
        },
        orderBy: {
            nextReview: "asc",
        },
    });

    if (dueFlashcards.length === 0) {
        return (
            <main className="container mx-auto flex min-h-[80vh] max-w-3xl flex-col items-center justify-center p-6">
                <div className="flex flex-col items-center text-center">
                    <div className="text-6xl">🎉</div>

                    <h2 className="mt-4 text-2xl font-bold">
                        Tuyệt vời!
                    </h2>

                    <p className="mt-2 text-muted-foreground">
                        Bạn đã hoàn thành tất cả mục tiêu ôn tập hôm nay.
                    </p>

                    <Button asChild className="mt-6">
                        <Link href="/">
                            Quay lại Dashboard
                        </Link>
                    </Button>
                </div>
            </main>
        );
    }

    return (
        <main className="container mx-auto flex min-h-[80vh] max-w-3xl flex-col items-center justify-center p-6">
            <div id="flashcard-viewer-placeholder">
                <h1 className="mb-8 text-xl font-bold text-muted-foreground">
                    Phiên ôn tập: {dueFlashcards.length} thẻ
                </h1>

                <FlashcardViewer flashcards={dueFlashcards} />
            </div>
        </main>
    );
}