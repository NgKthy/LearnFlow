import "dotenv/config";
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { handleTextMessage } from "./handlers/message";
import { handleDocumentMessage } from "./handlers/document";
import { prisma } from "@/lib/prisma";

// Global type declaration for dev hot-reloads
declare global {
  var telegramBotInstance: Telegraf | undefined;
}

const token = process.env.TELEGRAM_BOT_TOKEN;

async function bootstrap() {
  if (!token) {
    console.warn("⚠️ Warning: TELEGRAM_BOT_TOKEN not found in environment variables. Bot will not start.");
    return;
  }

  if (globalThis.telegramBotInstance) {
    console.log("🤖 Telegram Bot instance already running. Skipping initialization.");
    return;
  }

  try {
    console.log("⏳ Connecting to Telegram servers...");
    const bot = new Telegraf(token);

    bot.on(message("text"), handleTextMessage);
    bot.on(message("document"), handleDocumentMessage);

    globalThis.telegramBotInstance = bot;

    const me = await bot.telegram.getMe();
    console.log(`🤖 Logged in as @${me.username} (${me.first_name})`);
    console.log("🚀 Telegram Bot is running and waiting for messages...");

    await bot.launch({ dropPendingUpdates: true });

  } catch (error) {
    console.error("❌ Error launching Telegram Bot:", error);
    // Do not crash the entire Next.js process in dev mode
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
}

void bootstrap();

// Graceful Shutdown
async function shutdown(signal: "SIGINT" | "SIGTERM") {
  if (globalThis.telegramBotInstance) {
    console.log(`\n🛑 Stopping bot (${signal})...`);
    globalThis.telegramBotInstance.stop(signal);
  }
  console.log("🔌 Disconnecting Prisma Client...");
  await prisma.$disconnect();
  console.log("✅ Graceful shutdown complete.");
  if (process.env.NODE_ENV === "production") {
    process.exit(0);
  }
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));