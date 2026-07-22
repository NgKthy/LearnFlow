import { prisma } from "@/lib/prisma";

import { extractContent } from "../extractor";
import { processContentWorkflow } from "../ai/pipeline";

/**
 * Extract content, run AI workflow,
 * then persist all generated learning materials.
 */
export async function processAndSaveResource(
    resourceId: string,
    url: string,
    platform: string,
    onProgress?: (step: string, message: string) => void
): Promise<void> {
    try {
        // -------------------------------------------------------------------------
        // Mark as processing
        // -------------------------------------------------------------------------
        await prisma.resource.update({
            where: {
                id: resourceId,
            },
            data: {
                status: "PROCESSING",
            },
        });

        onProgress?.(
            "extract",
            "⬇️ Đang trích xuất nội dung HTML/Transcript..."
        );

        // -------------------------------------------------------------------------
        // Extract raw content
        // -------------------------------------------------------------------------
        const text = await extractContent(url, platform);

        if (!text.trim()) {
            throw new Error("Không trích xuất được nội dung");
        }

        onProgress?.(
            "ai",
            "🧠 AI đang tạo Tóm tắt, Flashcards & Quiz..."
        );

        // -------------------------------------------------------------------------
        // AI Pipeline
        // -------------------------------------------------------------------------
        const result = await processContentWorkflow(text);

        onProgress?.(
            "save",
            "💾 Đang lưu vào cơ sở dữ liệu..."
        );

        // -------------------------------------------------------------------------
        // Save everything atomically
        // -------------------------------------------------------------------------
        await prisma.$transaction(async (tx) => {
            // -----------------------------------------------------------------------
            // Update AI summary
            // -----------------------------------------------------------------------
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


            // -----------------------------------------------------------------------
            // Flashcards
            // -----------------------------------------------------------------------
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

            // -----------------------------------------------------------------------
            // Quiz
            // -----------------------------------------------------------------------
            if (result.quiz.length) {
                await tx.quizQuestion.createMany({
                    data: result.quiz.map((quiz) => ({
                        resourceId,

                        question: quiz.question,

                        options: JSON.stringify(quiz.options),

                        correctOptionIndex:
                            quiz.correctOptionIndex,

                        explanation: quiz.explanation,
                    })),
                });
            }

            // -----------------------------------------------------------------------
            // Completed
            // -----------------------------------------------------------------------
            await tx.resource.update({
                where: {
                    id: resourceId,
                },
                data: {
                    status: "COMPLETED",
                },
            });
        });

        onProgress?.(
            "done",
            "✅ Hoàn tất!"
        );

        console.log(
            `[Learning] Resource ${resourceId} processed successfully.`
        );
    } catch (error) {
        onProgress?.(
            "error",
            "❌ Có lỗi xảy ra trong quá trình xử lý."
        );
        console.error(
            `[Learning] Failed to process resource ${resourceId}:`,
            error
        );

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
                "[Learning] Failed to update resource status:",
                updateError
            );
        }
    }
}