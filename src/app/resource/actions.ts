"use server";

import { prisma } from "@/lib/prisma";
import { processTextAndSave } from "@/services/learning/process-text";
import { processAndSaveResource } from "@/services/learning/process-resource";
import { revalidatePath } from "next/cache";

/**
 * Triggers the AI learning pipeline for a previously FAILED resource.
 * Runs the processing asynchronously and returns immediately.
 */
export async function retryProcessing(resourceId: string) {
    if (!resourceId) {
        throw new Error("Resource ID is required");
    }

    const resource = await prisma.resource.findUnique({
        where: { id: resourceId },
    });

    if (!resource) {
        throw new Error("Resource not found");
    }

    // 1. Update status to PROCESSING to display loading UI
    await prisma.resource.update({
        where: { id: resourceId },
        data: { status: "PROCESSING" },
    });

    // Clear Next.js cache for the resource page
    revalidatePath(`/resource/${resourceId}`);

    // 2. Run the processing asynchronously
    if (resource.content && resource.content.trim()) {
        // For documents that have text content (like uploaded PDFs)
        processTextAndSave(resourceId, resource.content).catch((err) => {
            console.error(
                `[RetryAction] Background processTextAndSave failed for resource ${resourceId}:`,
                err
            );
        });
    } else if (resource.url) {
        // For link-based resources (YouTube, articles, etc.)
        processAndSaveResource(resourceId, resource.url, resource.source).catch((err) => {
            console.error(
                `[RetryAction] Background processAndSaveResource failed for resource ${resourceId}:`,
                err
            );
        });
    } else {
        // Fail early if there is neither content nor url
        await prisma.resource.update({
            where: { id: resourceId },
            data: { status: "FAILED" },
        });
        throw new Error("Không thể thực hiện lại: Resource không có nội dung văn bản và URL nguồn.");
    }

    return { success: true };
}
