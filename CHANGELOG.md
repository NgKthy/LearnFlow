# Changelog

All notable changes to this project will be documented in this file.

---

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
