# LUẬT DỰ ÁN VÀ NGỮ CẢNH CHO AI (PROJECT CONTEXT & RULES)

Bạn là một Senior System Architect và Full-stack Developer. Bất cứ khi nào tạo ra code hoặc đề xuất giải pháp cho dự án này, bạn BẮT BUỘC phải tuân thủ các quy tắc trong tệp ngữ cảnh này.

## 1. TỔNG QUAN DỰ ÁN (PROJECT IDENTITY)
- **Tên dự án:** Local Personal LMS (Learning Management System).
- **Mục tiêu:** Xây dựng một Web App quản lý học tập cá nhân, lấy cảm hứng từ Coursera. Tích hợp Telegram Bot để tự động thu thập tài nguyên (link, file) từ bên ngoài.
- **Ràng buộc cốt lõi:** 100% chạy LOCAL và MIỄN PHÍ. Không sử dụng các dịch vụ Cloud trả phí (như AWS, Vercel Postgres, Supabase).

## 2. TECH STACK (CÔNG NGHỆ SỬ DỤNG)
- **Frontend & Backend:** Next.js (App Router), React, TypeScript.
- **Styling:** TailwindCSS, Shadcn UI.
- **Database:** SQLite (chạy local) + Prisma ORM.
- **Bot Engine:** Telegram Bot API (dùng thư viện `telegraf`), chạy cơ chế Long Polling tích hợp trong Node.js/Next.js.

## 3. KIẾN TRÚC HỆ THỐNG (CLEAN ARCHITECTURE)
Hệ thống được thiết kế theo hướng module hóa. Telegram/Discord Bot chỉ đóng vai trò là "Adapter", không chứa Business Logic.
- `src/app/`: Chứa UI, Layouts, và API Routes của Next.js.
- `src/components/`: Chứa React Components có thể tái sử dụng.
- `src/services/`: Chứa **Business Logic** cốt lõi của LMS (xử lý Course, AI, Taxonomy...).
- `src/repositories/`: Tầng giao tiếp với database qua Prisma.
- `src/bot/`: Tầng Transport cho Telegram Bot. Phải gọi vào `src/services/` để xử lý dữ liệu.
  - `src/bot/index.ts`: Khởi tạo Telegraf (Long Polling).
  - `src/bot/handlers/`: Lắng nghe sự kiện (message, command).
  - `src/bot/services/`: Các dịch vụ đặc thù của Bot (Parse URL, Fetch Metadata).

## 4. QUY TẮC DATABASE (PRISMA + SQLITE)
- **Cấm sử dụng Native Enum:** Do SQLite KHÔNG hỗ trợ `enum`, mọi trường phân loại (như `status`, `type`, `source`) BẮT BUỘC phải khai báo là kiểu `String` trong `schema.prisma`. Việc validate (ép kiểu) sẽ được thực hiện bằng TypeScript (Interface/Types) ở tầng Application.
- **Bảng IngestionLog:** Mọi dữ liệu đi qua Bot đều phải được log lại vào bảng `IngestionLog` trước khi tạo `Resource` để phục vụ debug và retry.
- **Taxonomy Phân cấp:** Sử dụng `Category` đệ quy (self-referencing) kết hợp với `Tag` phẳng (many-to-many) để phân loại dữ liệu.

## 5. QUY TẮC VIẾT CODE CHO AI
- **TypeScript Strict Mode:** Luôn khai báo type/interface rõ ràng cho tham số hàm và giá trị trả về. Tránh sử dụng `any`.
- **Modularity:** Viết các hàm nhỏ, tập trung vào một nhiệm vụ (Single Responsibility). 
- **Error Handling:** Phải có try/catch. Đối với các tác vụ gọi API bên ngoài (như cào metadata, gọi AI), phải xử lý graceful fallback để không làm sập ứng dụng.
- **Step-by-step:** Đừng tự động code trước các Phase chưa được yêu cầu. Chỉ tập trung giải quyết chính xác module đang được thảo luận.

## 6. LỘ TRÌNH PHÁT TRIỂN (ROADMAP)
- **Phase 1:** Khởi tạo Next.js, cấu hình Prisma + SQLite, tạo cấu trúc thư mục.
- **Phase 2:** Data Ingestion Pipeline & Telegram Bot.
- **Phase 3:** UI Dashboard (Today, Routine, Inbox) & Tracking.
- **Phase 4:** UI Learning Zone (Courses: Grid/Table/Board View, Paths, Library).
- **Phase 5:** UI Knowledge Base (Notes, Flashcards, Spaced Repetition) & Settings (AI Auto-tagging).