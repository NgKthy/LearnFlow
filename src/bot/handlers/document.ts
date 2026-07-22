import type { Context } from "telegraf";
import { extractPdfText } from "@/services/extractor/pdf";
import { prisma } from "@/lib/prisma";
import { processTextAndSave } from "@/services/learning/process-text";

export async function handleDocumentMessage(ctx: Context): Promise<void> {
    // Ignore non-document messages
    if (!ctx.message || !("document" in ctx.message)) {
        return;
    }

    const doc = ctx.message.document;
    const fileName = doc.file_name || "document.pdf";
    const mimeType = doc.mime_type;

    // Check if the uploaded document is a PDF
    if (mimeType !== "application/pdf" && !fileName.toLowerCase().endsWith(".pdf")) {
        await ctx.reply("⚠️ Chỉ hỗ trợ tải tài liệu định dạng PDF.");
        return;
    }

    // Send temporary progress status message
    const statusMessage = await ctx.reply("⏳ Đang nhận tệp tin PDF từ Telegram...");

    try {
        // 1. Get download URL from Telegram
        const fileId = doc.file_id;
        const fileLink = await ctx.telegram.getFileLink(fileId);
        const downloadUrl = typeof fileLink === "string" ? fileLink : fileLink.href;

        // 2. Fetch the file data in-memory
        await ctx.telegram.editMessageText(
            ctx.chat!.id,
            statusMessage.message_id,
            undefined,
            "📥 Đang tải tệp về bộ nhớ tạm..."
        );
        const fileResponse = await fetch(downloadUrl);
        if (!fileResponse.ok) {
            throw new Error(`Failed to download PDF from Telegram: ${fileResponse.statusText}`);
        }
        const fileBuffer = Buffer.from(await fileResponse.arrayBuffer());

        // 3. Extract text from the PDF
        await ctx.telegram.editMessageText(
            ctx.chat!.id,
            statusMessage.message_id,
            undefined,
            "📄 Đang trích xuất văn bản PDF..."
        );
        const extractionResult = await extractPdfText(fileBuffer);

        if (!extractionResult.text || extractionResult.text.trim().length === 0) {
            throw new Error("Không thể trích xuất văn bản có giá trị từ PDF.");
        }

        // 4. Create Resource record in PostgreSQL
        await ctx.telegram.editMessageText(
            ctx.chat!.id,
            statusMessage.message_id,
            undefined,
            "🗄️ Đang lưu tài liệu vào cơ sở dữ liệu..."
        );

        const resource = await prisma.resource.create({
            data: {
                title: fileName,
                url: `tg://file/${fileId}`,
                source: "TELEGRAM",
                type: "DOCUMENT",
                status: "PROCESSING",
                content: extractionResult.text,
            },
        });

        // 5. Create Ingestion Log and Activity Log
        await prisma.ingestionLog.create({
            data: {
                platform: "TELEGRAM",
                rawMessage: `Document: ${fileName} (${doc.file_size || 0} bytes)`,
                extractedUrl: `tg://file/${fileId}`,
                metadataFetched: true,
                success: true,
                resourceId: resource.id,
            },
        });

        await prisma.activity.create({
            data: {
                action: "RESOURCE_INGESTED",
                payload: JSON.stringify({
                    url: `tg://file/${fileId}`,
                    title: fileName,
                }),
            },
        });

        // 6. Run the AI processing pipeline and save generated quiz/flashcard
        await ctx.telegram.editMessageText(
            ctx.chat!.id,
            statusMessage.message_id,
            undefined,
            "🤖 AI đang phân tích và tạo Flashcards/Quizzes..."
        );
        await processTextAndSave(resource.id, extractionResult.text);

        // 7. Update status to Success
        await ctx.telegram.editMessageText(
            ctx.chat!.id,
            statusMessage.message_id,
            undefined,
            `✅ Thành công!
            
Đã nạp tài liệu:
👉 ${fileName}

📚 Đã tạo Summary
🧠 Đã tạo Flashcards
❓ Đã tạo Quizzes

Mở Web UI để học ngay nhé!`
        );

    } catch (error) {
        console.error("[Telegram Bot Document Ingestion Error]:", error);

        try {
            await ctx.telegram.editMessageText(
                ctx.chat!.id,
                statusMessage.message_id,
                undefined,
                `❌ Lỗi xử lý tài liệu: ${error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định."}`
            );
        } catch {
            // Ignore failure to edit error status message
        }
    }
}
