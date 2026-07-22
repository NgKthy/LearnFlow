"use server";

import { extractPdfText } from "@/services/extractor/pdf";
import { prisma } from "@/lib/prisma";
import { processTextAndSave } from "@/services/learning/process-text";

export async function uploadPdf(formData: FormData) {
    const file = formData.get("file");

    if (!(file instanceof File)) {
        throw new Error("Không tìm thấy file.");
    }

    if (file.type !== "application/pdf") {
        throw new Error("Chỉ hỗ trợ file PDF.");
    }

    // 1. Read PDF file entirely in-memory using buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 2. Extract plain text from buffer
    const result = await extractPdfText(buffer);

    // 3. Create Resource in PostgreSQL database with status PROCESSING
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

    // 4. Trigger the AI pipeline and database persistence workflow asynchronously
    // to prevent server action gateway timeout (504) on slow AI model responses.
    console.time("Learning Pipeline");
    processTextAndSave(resource.id, result.text)
        .then(() => {
            console.timeEnd("Learning Pipeline");
        })
        .catch((err) => {
            console.timeEnd("Learning Pipeline");
            console.error(
                `[UploadAction] Asynchronous background processing failed for resource ${resource.id}:`,
                err
            );
        });

    return {
        success: true,
        resourceId: resource.id,
    };
}