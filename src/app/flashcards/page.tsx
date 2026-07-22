import { prisma } from "@/lib/prisma";
import FlashcardsClient from "./flashcards-client";

export const dynamic = "force-dynamic";

export default async function FlashcardsPage() {
    // Fetch all resources containing at least one flashcard
    const resources = await prisma.resource.findMany({
        where: {
            flashcards: {
                some: {},
            },
        },
        include: {
            flashcards: {
                select: {
                    id: true,
                    question: true,
                    answer: true,
                    hint: true,
                    nextReview: true,
                },
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    // Formatting fields to be safely serialized
    const formattedResources = resources.map(res => ({
        id: res.id,
        title: res.title,
        flashcards: res.flashcards.map(card => ({
            id: card.id,
            question: card.question,
            answer: card.answer,
            hint: card.hint,
            nextReview: card.nextReview.toISOString(),
        })),
    }));

    return (
        <main className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            <FlashcardsClient resources={formattedResources} />
        </main>
    );
}
