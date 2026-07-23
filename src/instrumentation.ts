export async function register() {
  // Only execute in the server runtime environment
  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.log("🚀 Next.js server bootstrap detected. Initializing subsystems...");
    try {
      // Import the bot index which executes the bootstrap immediately
      await import("./bot/index");
    } catch (err) {
      console.error("❌ Failed to auto-start Telegram Bot:", err);
    }
  }
}
