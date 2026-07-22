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

        // 2. Call AI pipeline workflow inside a try-catch block with timers
        let result;
        console.time("AI Generation");
        try {
            console.log(`[AI Pipeline] Starting generation for resource ${resourceId}`);
            result = await processContentWorkflow(text);
            console.timeEnd("AI Generation");
        } catch (aiError) {
            console.timeEnd("AI Generation");
            console.error(`[AI Pipeline] Generation failed for resource ${resourceId}:`, aiError);
            throw aiError;
        }

        // 3. Persist everything to PostgreSQL inside an interactive transaction
        console.time("DB Transaction");
        try {
            await prisma.$transaction(async (tx) => {
                // Update resource content, status, metadata & tags
                await tx.resource.update({
                    where: {
                        id: resourceId,
                    },
                    data: {
                        content: text,
                        summary: result.summary?.summary ?? null,
                        difficulty: result.summary?.difficulty ?? null,
                        estimatedReadingTime:
                            result.summary?.estimatedReadingTime ?? null,
                        status: "COMPLETED",
                        ...(result.summary?.tags?.length
                            ? {
                                tags: {
                                    connectOrCreate: Array.from(
                                        new Set(
                                            result.summary.tags
                                                .filter((tag): tag is string => typeof tag === "string" && tag.trim() !== "")
                                                .map((tag) => tag.trim().toLowerCase())
                                        )
                                    ).map((tag) => ({
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

                // Delete existing Flashcards (supporting Retry mechanism)
                await tx.flashcard.deleteMany({
                    where: {
                        resourceId,
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

                // Delete existing Quiz Questions (supporting Retry mechanism)
                await tx.quizQuestion.deleteMany({
                    where: {
                        resourceId,
                    },
                });

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
            });
            console.timeEnd("DB Transaction");
        } catch (dbError) {
            console.timeEnd("DB Transaction");
            console.error(`[ProcessText] Database transaction failed for resource ${resourceId}:`, dbError);
            throw dbError;
        }

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
