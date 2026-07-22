"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { calculateNextReview } from "@/services/learning/srs-algorithm";

export interface ReviewFlashcardResult {
    success: boolean;
    error?: string;
}

export async function reviewFlashcardAction(
    flashcardId: string,
    quality: number
): Promise<ReviewFlashcardResult> {
    try {
        const flashcard =
            await prisma.flashcard.findUnique({
                where: {
                    id: flashcardId,
                },
                select: {
                    id: true,
                    easeFactor: true,
                    interval: true,
                    repetition: true,
                    resourceId: true,
                },
            });

        if (!flashcard) {
            throw new Error(
                "Không tìm thấy Flashcard."
            );
        }

        const review =
            calculateNextReview(
                quality,
                flashcard.easeFactor,
                flashcard.interval,
                flashcard.repetition
            );

        await prisma.flashcard.update({
            where: {
                id: flashcard.id,
            },
            data: {
                easeFactor:
                    review.easeFactor,
                interval:
                    review.interval,
                repetition:
                    review.repetition,
                nextReview:
                    review.nextReviewDate,
            },
        });

        // Resource pages
        revalidatePath("/library");
        revalidatePath(`/resource/${flashcard.resourceId}`);

        // Dashboard
        revalidatePath("/");

        // Daily Review
        revalidatePath("/review");

        return {
            success: true,
        };
    } catch (error) {
        console.error(
            "[reviewFlashcardAction]",
            error
        );

        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Đã xảy ra lỗi khi cập nhật Flashcard.",
        };
    }
}