# MVP Personal LMS - Roadmap Checklist

This file tracks the implementation progress of Stage 2 (MVP) for the Personal LMS project.

---

## 📅 Roadmap Overview & Sprints

### 🟢 Sprint 1 – Upload tài liệu (Priority #1)
- [x] **Task 1.1:** Run schema migration `npx prisma migrate dev --name add_content_to_resource` to add the `content` field.
- [x] **Task 1.2:** Create the `processTextAndSave(resourceId, text)` service in `src/services/learning/process-text.ts`.
- [x] **Task 1.3:** Implement in-memory PDF parsing inside the Server Action (`src/app/upload/actions.ts`), creating a `Resource` with state `PROCESSING`.
- [x] **Task 1.4:** Integrate the `processTextAndSave` call in `src/app/upload/actions.ts` to trigger AI and DB persistence.
- [x] **Task 1.5:** Design the Upload Page UI (`/upload`) with premium glassmorphic visual style.
- [x] **Task 1.6:** Wire client-side upload to Server Action, showing step-by-step progress and redirecting to the resource details page.
- [x] **Task 1.7:** Add a "Thêm tài liệu" (Add Resource) button in the Library page linking to `/upload`.

### 🟢 Sprint 2 – Trang Flashcards (Priority #2)
- [x] **Task 2.1:** Create `app/flashcards/page.tsx` displaying due flashcards, study grid, and searchable list.
- [x] **Task 2.2:** Tidy up, resolve unused warnings, and add chevron/arrow key navigation to the `FlashcardViewer.tsx` component.
- [x] **Task 2.3:** Wire review logic (SM-2 updates) to submit results to database actions, and integrate the session study overlay.

### 🟢 Sprint 3 – Trang Quiz (Priority #3)
- [x] **Task 3.1:** Fix the final question "Hoàn thành" button bug and style options for dark mode in `QuizViewer.tsx`.
- [x] **Task 3.2:** Create `app/quiz/quiz-client.tsx` with a visual dashboard of quizzes and study session overlays.
- [x] **Task 3.3:** Create `app/quiz/page.tsx` as a server component to fetch quiz questions using Prisma.

### 🟢 Sprint 4 – Dashboard (Priority #4)
- [x] **Task 4.1:** Log quiz activity completions (`QUIZ_COMPLETED`) and flashcard reviews (`FLASHCARD_REVIEWED`) inside database activities.
- [x] **Task 4.2:** Implement daily learning streak calculation (handling calendar days offset) and average quiz accuracy computations.
- [x] **Task 4.3:** Redesign the landing page `app/page.tsx` with a premium stats dashboard and shortcut cards.

### 🟢 Sprint 5 – Navigation (Priority #5)
- [x] **Task 5.1:** Convert Sidebar component to Client mode, implement usePathname active state highlights, and map all links (Dashboard, Library, Upload, Flashcards, Quiz, Review, Settings) with Lucide icons.

### 🟢 Sprint 6 – Telegram Bot (Priority #6)
- [x] **Task 6.1:** Handle document uploads in `src/bot/handlers/document.ts`, download PDFs, extract text in-memory, log database entries, and run `processTextAndSave`.

### 🟢 Sprint 7 – Accessibility Upgrades (Priority #7)
- [x] **Task 7.1:** Typography size upgrade audit (replacing low-legibility `text-[9px]` with `text-[10px]` in cards/metadata).
- [x] **Task 7.2:** Color contrast enhancement to satisfy WCAG AA recommendations (changing `text-slate-400` to `text-slate-500` or `text-slate-600` on light background).
- [x] **Task 7.3:** Sidebar menu items refactored to support overflow scroll container (`overflow-y-auto`) to avoid viewport cutoff.

### 🟢 Sprint 8 – Link Scanner & Progress Bar (Priority #8)
- [x] **Task 8.1:** Asynchronous background link scanner database status polling setup (writing percentages and states to database).
- [x] **Task 8.2:** Progress bar visualization component UI with animated loading status.

### 🟢 Sprint 9 – System Settings (Priority #9)
- [x] **Task 9.1:** Gemini API key configuration form with save success notifications.
- [x] **Task 9.2:** Secure API key masking (`••••••••••••••••`) preventing plain text exposure to the client.

### 🟢 Sprint 10 – Portfolio & Shared Links (Priority #10)
- [x] **Task 10.1:** PortfolioItem Prisma database schema model setup and Neon migration deployment.
- [x] **Task 10.2:** CRUD operations, visibility toggling, and array ordering Server Actions.
- [x] **Task 10.3:** Admin portfolio management page (`/portfolio`) with drag-and-drop/swapping cards.
- [x] **Task 10.4:** Public page `/portfolio/[userId]` only displaying isPublic=true items with a simplified, standalone viewport layout.
