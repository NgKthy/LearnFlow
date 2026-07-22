"use server";

import { extractPdfText } from "@/services/extractor/pdf";
import { prisma } from "@/lib/prisma";
import { processTextAndSave } from "@/services/learning/process-text";
import { after } from "next/server";

export async function uploadPdf(formData: FormData) {
    // 1. Validate FormData presence
    const file = formData.get("file");
    if (!(file instanceof File)) {
        throw new Error("Không tìm thấy file.");
    }

    // 2. Validate MIME type
    if (file.type !== "application/pdf") {
        throw new Error("Chỉ hỗ trợ file PDF.");
    }

    // 3. Read PDF file entirely in-memory using buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4. Extract plain text from buffer
    const result = await extractPdfText(buffer);

    // 5. Create Resource in database with status PROCESSING
    const resource = await prisma.resource.create({
        data: {
            title: file.name,
            url: `in-memory://pdf/${file.name}`,
            source: "PDF",
            type: "DOCUMENT",
            status: "PROCESSING",
            content: result.text,
        },
    });

    // 6. Trigger AI processing in serverless-safe background context using after
    after(async () => {
        console.time("Upload Pipeline");
        try {
            await processTextAndSave(resource.id, result.text);
            console.timeEnd("Upload Pipeline");
        } catch (err) {
            console.timeEnd("Upload Pipeline");
            console.error(
                `[UploadAction] Background processing failed for resource ${resource.id}:`,
                err
            );
        }
    });

    // 7. Return response immediately to client
    return {
        success: true,
        resourceId: resource.id,
    };
}