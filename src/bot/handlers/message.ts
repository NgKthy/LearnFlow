import type { Context } from "telegraf";

import { runIngestionPipeline } from "@/bot/services/pipeline";
import { saveIngestedResource } from "@/repositories/resource";
import { processAndSaveResource } from "@/services/learning/process-resource";

export async function handleTextMessage(ctx: Context): Promise<void> {
    // Ignore non-text messages
    if (!ctx.message || !("text" in ctx.message)) {
        return;
    }

    const text = ctx.message.text;

    // Send temporary processing message
    const statusMessage = await ctx.reply(
        "⏳ Đang tiếp nhận link..."
    );

    try {
        const dto = await runIngestionPipeline(text);

        if (!dto) {
            await ctx.telegram.editMessageText(
                ctx.chat!.id,
                statusMessage.message_id,
                undefined,
                "⚠️ Không tìm thấy URL hợp lệ trong tin nhắn."
            );

            return;
        }

        const saved = await saveIngestedResource(dto, text);

        await processAndSaveResource(
            saved.resource.id,
            dto.url,
            dto.platform,
            async (_step, progressMessage) => {
                await ctx.telegram.editMessageText(
                    ctx.chat!.id,
                    statusMessage.message_id,
                    undefined,
                    progressMessage
                );
            }
        );

        // Replace loading message with success message
        await ctx.telegram.editMessageText(
            ctx.chat!.id,
            statusMessage.message_id,
            undefined,
            `✅ Hoàn tất!

Đã lưu thành công:
${dto.title}

📚 Summary
🧠 Flashcards
❓ Quiz

Mở Web UI để học ngay nhé!`
        );
    } catch (error) {
        console.error(
            "[Telegram] Failed to process message:",
            error
        );

        // Best effort: ignore delete failures
        try {
            await ctx.telegram.editMessageText(
                ctx.chat!.id,
                statusMessage.message_id,
                undefined,
                "❌ Có lỗi xảy ra khi xử lý link của bạn."
            );
        } catch {
            // Ignore
        }

    }
}
