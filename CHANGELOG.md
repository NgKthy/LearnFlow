# Changelog

All notable changes to this project will be documented in this file.

---

## [1.1.0] - 2026-07-23

### Added
*   **Portfolio & Shared Links**: Created a full-featured Portfolio management system. Includes model migrations, CRUD server actions, card display, order sorting, and public user portfolio routes (`/portfolio/[userId]`) with clean non-admin layouts.
*   **Link Scanner Progress Bar**: Integrated real-time polling to showcase the link scanner's execution percentage and broken links count dynamically.
*   **Telegram Bot Auto-start**: Configured Next.js `instrumentation.ts` bootstrap integration to automatically launch the Telegraf long-polling bot alongside the Next.js server.
*   **Telegram Bot Offline Updates**: Disabled update dropping (`dropPendingUpdates: false`) so that messages sent while the bot is offline are fully preserved and processed once online.

### Changed
*   **WCAG AA Accessibility Audits**: Upgraded low-legibility typography from `text-[9px]` to `text-[10px]` and elevated light-background text contrast (from `text-slate-400` to `text-slate-500` and `text-slate-600`) across all main screens.
*   **Sidebar Scroll Container**: Replaced the static viewport layout of the sidebar with an overflow scroll wrapper (`overflow-y-auto`) to prevent item cutting on short displays.
*   **Security Review Key Masking**: Configured Settings view to query and display saved API keys masked (`••••••••••••••••`), blocking browser text exposure and accidental settings overwrites.
*   **Hydration Mismatch Fixes**: Refactored Base UI Button component overrides to pre-merge custom classes (`React.cloneElement`) and set `nativeButton={false}` when utilizing custom elements or Next.js `Link` wrappers.

## [1.0.0] - 2026-07-22

### Added
*   Core Web Application built on **Next.js 16** (App Router) and Tailwind CSS.
*   Automated **Telegram Ingestion Bot** integration via the `telegraf` package.
*   AI Processing Pipeline with **Gemini AI** integration (`@ai-sdk/google`) to extract summaries, tags, estimated reading times, flashcards, and quizzes.
*   Interactive learning modules: Flashcard Study Player and Multiple-choice Quiz Runner.
*   **SM-2 Spaced Repetition** scheduler to automate flashcard intervals.
*   Beautiful interface using headless accessibility primitives from `@base-ui/react`.

### Changed
*   Database system migrated from local SQLite (`better-sqlite3`) to serverless/cloud **PostgreSQL** (e.g. Neon, Supabase) for secure production deployment.
*   Configured database client wrapper utilizing the standard `@prisma/adapter-pg` driver adapter to optimize connection pooling in Node.js/Serverless environments.
*   Prisma schema and environment variable loading updated to meet **Prisma 7** requirements (`prisma.config.ts`).
