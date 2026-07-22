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

### ⚪ Sprint 4 – Dashboard
- [ ] **Task 4.1:** Retrieve summary metrics from database: Streak count, resource counts, total due flashcards, average quiz accuracy.
- [ ] **Task 4.2:** Design a clean, visual statistics dashboard.

### ⚪ Sprint 5 – Navigation
- [ ] **Task 5.1:** Update global Layout sidebar/header with links: Dashboard, Library, Upload, Flashcards, Quiz, Review, Settings.

### ⚪ Sprint 6 – Telegram Bot
- [ ] **Task 6.1:** Connect Telegram PDF uploads to the ingestion pipeline and save to PostgreSQL (using the shared in-memory text service).
