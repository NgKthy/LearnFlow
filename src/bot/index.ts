console.log("⏳ [1/5] Đang nạp biến môi trường...");
import "dotenv/config";

console.log("⏳ [2/5] Đang khởi tạo các module...");
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { handleTextMessage } from "./handlers/message";
import { handleDocumentMessage } from "./handlers/document";

console.log("⏳ [3/5] Đang kết nối SQLite Database...");
import { prisma } from "@/lib/prisma";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) throw new Error("❌ Không tìm thấy TELEGRAM_BOT_TOKEN");

const bot = new Telegraf(token);
bot.on(message("text"), handleTextMessage);
bot.on(message("document"), handleDocumentMessage);

async function bootstrap() {
    try {
        console.log("⏳ [4/5] Đang kết nối đến máy chủ Telegram (Kiểm tra mạng)...");
        const me = await bot.telegram.getMe();
        console.log(`🤖 Logged in as @${me.username} (${me.first_name})`);

        console.log("⏳ [5/5] Đang khởi động tiến trình nhận tin nhắn...");

        // ĐƯA DÒNG NÀY LÊN TRƯỚC
        console.log("🚀 Telegram Bot is running and waiting for messages...");

        // THÊM DROP PENDING Ở ĐÂY
        await bot.launch({ dropPendingUpdates: true });

    } catch (error) {
        console.error("❌ Lỗi khi khởi chạy Bot:", error);
        process.exit(1);
    }
}

void bootstrap();

// Graceful Shutdown
async function shutdown(signal: "SIGINT" | "SIGTERM") {
    console.log(`\n🛑 Stopping bot (${signal})...`);
    bot.stop(signal);
    console.log("🔌 Disconnecting Prisma Client...");
    await prisma.$disconnect();
    console.log("✅ Graceful shutdown complete.");
    process.exit(0);
}
process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));