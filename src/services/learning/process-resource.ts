import { prisma } from "@/lib/prisma";

import { extractContent } from "../extractor";
import { processTextAndSave } from "./process-text";

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
    console.time("Learning Pipeline");
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
        // AI Pipeline & Persistence
        // -------------------------------------------------------------------------
        await processTextAndSave(resourceId, text);

        onProgress?.(
            "done",
            "✅ Hoàn tất!"
        );

        console.log(
            `[Learning] Resource ${resourceId} processed successfully.`
        );
        console.timeEnd("Learning Pipeline");
    } catch (error) {
        console.timeEnd("Learning Pipeline");
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