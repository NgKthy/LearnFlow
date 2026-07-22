# LearnFlow - AI-Powered Personal LMS

LearnFlow is an AI-powered **Personal Learning Management System (LMS)** designed to aggregate scattered learning resources (YouTube videos, articles, Google Drive files, and documents) into a structured, personal knowledge base.

It utilizes a **Telegram Bot** as a frictionless ingestion pipeline, **Gemini AI** for auto-tagging, summarization, flashcard/quiz generation, and the **SM-2 (Spaced Repetition)** algorithm to help you review and retain knowledge effectively.

---

## 🚀 Key Features

*   📥 **Telegram Ingestion Bot:** Instantly forward links or share resources with your Telegram Bot. The ingestion pipeline extracts URLs, fetches metadata (Title, Source, Thumbnail), and saves them directly to your Inbox.
*   🧠 **AI-Powered Processing Pipeline:** Auto-generates comprehensive summaries, difficulty levels, estimated reading times, and assigns taxonomy tags using Gemini AI.
*   📚 **Interactive Learning Zone:** 
    *   **Courses & Paths:** Group related resources together into structured courses and learning paths.
    *   **Library:** Search and filter all saved resources by source (YouTube, Medium, etc.) and tags.
*   🔄 **SM-2 Spaced Repetition Flashcards:** AI-extracted flashcards automatically scheduled for reviews using the SuperMemo-2 algorithm (1 to 5 quality rating).
*   ✍️ **Interactive Quizzes:** Challenge yourself with AI-generated multiple-choice quizzes complete with real-time checks and detailed rationales.
*   🎨 **Premium Glassmorphic UI:** Clean, responsive, and gorgeous dashboard built with Tailwind CSS and `@base-ui/react` primitives.

---

## 🛠️ Tech Stack

*   **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
*   **Database ORM:** [Prisma 7](https://www.prisma.io/)
*   **Database Provider:** [PostgreSQL](https://www.postgresql.org/) (e.g. Neon, Supabase)
*   **Deployment Platform:** [Vercel](https://vercel.com/)
*   **Styling & UI:** Tailwind CSS, Shadcn UI, and [@base-ui/react](https://base-ui.com/)
*   **AI Engine:** [Google Generative AI (Gemini SDK)](https://ai.google.dev/)
*   **Telegram Bot:** `telegraf`

---

## 📂 Architecture & Data Pipeline

```mermaid
graph TD
    A[Telegram Messenger] -->|Send / Forward URL| B[Telegram Bot Service]
    B -->|Extract URL & Fetch HTML Meta| C[Ingestion Pipeline]
    C -->|Request AI Insight| D[Gemini AI API]
    D -->|Extract Summary, Flashcards, Quizzes| C
    C -->|Save Transactional Records| E[(PostgreSQL Database)]
    E -->|Fetch Learning Data| F[Next.js Web Interface]
    F -->|Interactively Study / Review| G[User]
```

---

## ⚙️ Environment Variables

Create a `.env` (or `.env.local` for Next.js) in the project root. Refer to [.env.example](file:///c:/Users/asus/Downloads/LearnFlow/personal-lms/.env.example):

```env
# Database connection (Prisma 7 format - connection strings are configured in prisma.config.ts)
DATABASE_URL="postgresql://username:password@localhost:5432/learnflow?schema=public"
DIRECT_URL="postgresql://username:password@localhost:5432/learnflow?schema=public"

# Telegram Integration
TELEGRAM_BOT_TOKEN="your_bot_token"

# Gemini AI Integration
AI_PROVIDER="google"
AI_MODEL="gemini-1.5-flash"
GOOGLE_GENERATIVE_AI_API_KEY="your_api_key"
```

*Note: In Prisma 7, connection URLs reside inside `prisma.config.ts` and load from the environment variables.*

---

## 📦 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/<your-username>/LearnFlow.git
    cd LearnFlow/personal-lms
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Setup environment variables:**
    ```bash
    cp .env.example .env
    # Edit .env with your credentials
    ```

4.  **Synchronize database schema:**
    *   **For Development (rapid prototyping):**
        ```bash
        npx prisma db push
        ```
    *   **For Production / Staging (using migrations):**
        ```bash
        npx prisma migrate deploy
        ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Commands & Scripts

*   `npm run build` - Generates Prisma Client and creates a production-ready Next.js build.
*   `npm run lint` - Performs ESLint checks to guarantee code quality.
*   `npx prisma generate` - Explicitly rebuilds Prisma Client types.
*   `npx prisma db push` - Syncs database schema with your database directly without migrations.
*   `npx prisma migrate dev` - Creates a new migration and applies it to the database (development mode).
*   `npx prisma migrate deploy` - Applies any pending migrations to the database (production mode).
*   `npm run test:pipeline` - Test utility to validate the scraping and URL extraction pipeline.

---

## 🚀 Pre-Push & Deployment Checklist

Before committing your code and deploying, complete this checklist:

1.  **Environment Variables:** Verify `.env` is NOT tracked by Git:
    ```bash
    git status
    ```
    *(Verify no `.env` or `.env.local` appears in the untracked list).*
2.  **Code Validation:** Run ESLint and TypeScript validation locally:
    ```bash
    npm run lint
    npm run build
    ```
3.  **Commit Code:** Commit changes cleanly:
    ```bash
    git add .
    git commit -m "Initial release of LearnFlow Personal LMS"
    ```
4.  **Vercel Settings:** In your Vercel Project Settings, configure the Environment Variables:
    *   `DATABASE_URL`
    *   `TELEGRAM_BOT_TOKEN`
    *   `AI_PROVIDER`
    *   `AI_MODEL`
    *   `GOOGLE_GENERATIVE_AI_API_KEY`
5.  **Deploy Command:** Run production deployment:
    ```bash
    vercel --prod
    ```

