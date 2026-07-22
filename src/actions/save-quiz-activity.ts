"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface SaveQuizActivityResult {
    success: boolean;
    error?: string;
}

export async function saveQuizActivityAction(
    resourceId: string,
    score: number,
    total: number
): Promise<SaveQuizActivityResult> {
    try {
        const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

        await prisma.activity.create({
            data: {
                action: "QUIZ_COMPLETED",
                payload: JSON.stringify({
                    resourceId,
                    score,
                    total,
                    percentage,
                }),
            },
        });

        // Revalidate landing page
        revalidatePath("/");

        return {
            success: true,
        };
    } catch (error) {
        console.error("[saveQuizActivityAction]", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to save quiz activity.",
        };
    }
}
