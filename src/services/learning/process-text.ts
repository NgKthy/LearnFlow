import { prisma } from "@/lib/prisma";
import { processContentWorkflow } from "../ai/pipeline";

/**
 * AI Processing Orchestrator for raw text.
 * Runs the AI pipeline, generates Summary, Flashcards, and Quizzes,
 * and saves everything inside a database transaction.
 */
export async function processTextAndSave(
    resourceId: string,
    text: string
): Promise<void> {
    try {
        // 1. Mark as processing
        await prisma.resource.update({
            where: {
                id: resourceId,
            },
            data: {
                status: "PROCESSING",
            },
        });

        // 2. Call AI pipeline workflow (runs summarizer, flashcards, quiz in parallel)
        const result = await processContentWorkflow(text);

        // 3. Persist everything to PostgreSQL inside an interactive transaction
        await prisma.$transaction(async (tx) => {
            // Update resource metadata & tags
            await tx.resource.update({
                where: {
                    id: resourceId,
                },
                data: {
                    summary: result.summary?.summary ?? null,
                    difficulty: result.summary?.difficulty ?? null,
                    estimatedReadingTime:
                        result.summary?.estimatedReadingTime ?? null,

                    ...(result.summary?.tags?.length
                        ? {
                            tags: {
                                connectOrCreate: result.summary.tags.map((tag) => ({
                                    where: {
                                        name: tag,
                                    },
                                    create: {
                                        name: tag,
                                    },
                                })),
                            },
                        }
                        : {}),
                },
            });

            // Create Flashcards if any
            if (result.flashcards.length) {
                await tx.flashcard.createMany({
                    data: result.flashcards.map((card) => ({
                        resourceId,
                        question: card.question,
                        answer: card.answer,
                        hint: card.hint ?? null,
                    })),
                });
            }

            // Create Quiz Questions if any
            if (result.quiz.length) {
                await tx.quizQuestion.createMany({
                    data: result.quiz.map((quiz) => ({
                        resourceId,
                        question: quiz.question,
                        options: JSON.stringify(quiz.options),
                        correctOptionIndex: quiz.correctOptionIndex,
                        explanation: quiz.explanation,
                    })),
                });
            }

            // Mark resource status as completed
            await tx.resource.update({
                where: {
                    id: resourceId,
                },
                data: {
                    status: "COMPLETED",
                },
            });
        });

        console.log(`[ProcessText] Resource ${resourceId} processed successfully.`);
    } catch (error) {
        console.error(`[ProcessText] Failed to process resource ${resourceId}:`, error);

        try {
            await prisma.resource.update({
                where: {
                    id: resourceId,
                },
                data: {
                    status: "FAILED",
                },
            });
        } catch (updateError) {
            console.error(
                "[ProcessText] Failed to update resource status to FAILED:",
                updateError
            );
        }

        throw error;
    }
}
