"use server";

import { prisma } from "@/lib/prisma";
import { processTextAndSave } from "@/services/learning/process-text";
import { processAndSaveResource } from "@/services/learning/process-resource";
import { revalidatePath } from "next/cache";
import { after } from "next/server";

/**
 * Triggers the AI learning pipeline for a previously FAILED resource.
 * Runs the processing asynchronously and returns immediately.
 */
export async function retryProcessing(resourceId: string) {
    // 1. Validate input presence
    if (!resourceId) {
        throw new Error("Resource ID is required");
    }

    // 2. Validate Resource exists in DB
    const resource = await prisma.resource.findUnique({
        where: { id: resourceId },
    });

    if (!resource) {
        throw new Error("Resource not found");
    }

    // 3. Validate Resource has retryable content or source url
    const hasContent = resource.content && resource.content.trim();
    const hasUrl = !!resource.url;

    if (!hasContent && !hasUrl) {
        await prisma.resource.update({
            where: { id: resourceId },
            data: { status: "FAILED" },
        });
        throw new Error("Không thể thực hiện lại: Tài nguyên không có nội dung văn bản hoặc URL nguồn.");
    }

    // 4. Update status to PROCESSING to show loading spinner on client
    await prisma.resource.update({
        where: { id: resourceId },
        data: { status: "PROCESSING" },
    });

    // Clear route cache immediately
    revalidatePath(`/resource/${resourceId}`);

    // 5. Trigger processing in serverless-safe background context using after
    if (hasContent) {
        // For documents that have text content (like uploaded PDFs)
        after(async () => {
            console.time("Learning Pipeline");
            try {
                await processTextAndSave(resourceId, resource.content!);
                console.timeEnd("Learning Pipeline");
            } catch (err) {
                console.timeEnd("Learning Pipeline");
                console.error(
                    `[RetryAction] Background processTextAndSave failed for resource ${resourceId}:`,
                    err
                );
            }
        });
    } else {
        // For link-based resources (YouTube, articles, etc.)
        after(async () => {
            console.time("Learning Pipeline");
            try {
                await processAndSaveResource(resourceId, resource.url, resource.source);
                console.timeEnd("Learning Pipeline");
            } catch (err) {
                console.timeEnd("Learning Pipeline");
                console.error(
                    `[RetryAction] Background processAndSaveResource failed for resource ${resourceId}:`,
                    err
                );
            }
        });
    }

    return { success: true };
}

/**
 * Action: Create or update a learning note for a resource (Autosave)
 */
export async function saveNote(resourceId: string, content: string) {
    if (!resourceId) {
        throw new Error("Resource ID is required");
    }

    const resource = await prisma.resource.findUnique({
        where: { id: resourceId },
    });

    if (!resource) {
        throw new Error("Resource not found");
    }

    const note = await prisma.note.upsert({
        where: { resourceId },
        update: {
            content,
        },
        create: {
            resourceId,
            content,
        },
    });

    revalidatePath(`/resource/${resourceId}`);
    return { success: true, note };
}
