# YÊU CẦU DỰ ÁN (PRD): HỆ THỐNG QUẢN LÝ HỌC TẬP CÁ NHÂN (LOCAL LMS) TÍCH HỢP BOT THU THẬP DỮ LIỆU

## 1. TỔNG QUAN DỰ ÁN (PROJECT OVERVIEW)
- **Tên dự án tạm gọi:** Local Personal LMS (Learning Management System).
- **Mô tả cốt lõi:** Một Web Application chạy hoàn toàn **local** và **miễn phí**, lấy cảm hứng thiết kế từ Coursera. Mục đích là gom các tài nguyên học tập phân tán (Link YouTube, Google Drive, Bài viết, File PDF,...) thành một hệ thống có cấu trúc rõ ràng.
- **Cơ chế thu thập dữ liệu (Core Mechanism):** Thông qua một Chatbot (ví dụ: Telegram Bot). Người dùng chỉ cần "Share / Forward" link hoặc file vào con bot này, hệ thống sẽ tự động bắt lấy, phân tích metadata, phân loại và lưu trữ vào database để hiển thị lên Web App.

## 2. TECH STACK BẮT BUỘC
- **Frontend & Backend:** Next.js (App Router) để tạo full-stack app (UI và API nằm chung).
- **Styling:** TailwindCSS, Shadcn UI (đảm bảo UI sạch sẽ, hiện đại, giống các platform học tập lớn).
- **Database:** PostgreSQL (Cloud Neon) + Prisma ORM.
- **Bot Engine:** Telegram Bot API (dùng `telegraf` hoặc `node-telegram-bot-api` chạy chung trên nền server Node.js/Next.js).

## 3. KIẾN TRÚC & WORKFLOW (CORE LOGIC)
1. **Data Ingestion (Đầu vào):** Người dùng dùng điện thoại/máy tính share 1 link (ví dụ: video Youtube) vào Telegram Bot.
2. **Processing (Xử lý):**
   - Bot nhận tin nhắn, trích xuất URL.
   - Fetch metadata cơ bản (Title, Description, Thumbnail).
   - *Optional/Logic:* Dựa trên từ khóa trong Title hoặc thông qua API AI (ví dụ: Gemini free tier) để tự động tag và categorize.
3. **Storage (Lưu trữ):** Lưu vào bảng `Resource` trong SQLite. Mặc định rơi vào trạng thái `Inbox` (nếu không phân loại được) hoặc rơi thẳng vào một `Course/Path` (nếu phân loại thành công).
4. **Presentation (Hiển thị):** Web App (Next.js) đọc database SQLite và render ra UI.

## 4. CẤU TRÚC GIAO DIỆN & TÍNH NĂNG (FEATURES)

Giao diện chia làm 2 phần chính: **Sidebar (Menu điều hướng)** và **Main Content (Nội dung chính)**.

### 4.1. Dashboard & Tracking
- **Today:** Trang chủ hiển thị ngay khi mở app. Liệt kê các task/tài liệu cần xử lý hoặc học trong ngày (tổng hợp từ `Routine` và `Inbox`).
- **Routine:** Quản lý lịch trình lặp lại (VD: Mỗi sáng 8h học Tiếng Anh).
- **Keep Track & Thống kê:** Dashboard biểu đồ (dùng Recharts hoặc Chart.js). Hiển thị: streak (chuỗi ngày học liên tục), số giờ học, số lượng tài nguyên đã xử lý, tiến độ hoàn thành các Courses.

### 4.2. Learning Zone (Vùng học tập cốt lõi)
- **Courses:**
  - Định nghĩa: Tập hợp các "Resource" (link/file) có chung một chủ đề.
  - UI yêu cầu: Phải có nút Toggle để chuyển đổi 3 chế độ xem (Views):
    1. **Grid View:** Hiển thị dạng thẻ (card) giống Coursera (Thumbnail lớn, Title, Progress bar).
    2. **Table View:** Hiển thị dạng danh sách chi tiết (Cột: Name, Status, Tags, Date added).
    3. **Board View (Kanban):** Các cột `To Do`, `In Progress`, `Done`. Kéo thả (Drag & drop) resource qua lại.
- **Paths (Lộ trình):** Nhóm các Courses lại với nhau theo thứ tự (VD: Path "Trở thành Frontend Dev" gồm Course HTML, Course CSS, Course React).
- **Library (Thư viện):** Bảng tổng hợp hiển thị TẤT CẢ các tài nguyên (links, files) đang có trong hệ thống, kèm bộ lọc (filter) mạnh mẽ theo Tags, Nguồn gốc (Youtube/Drive).

### 4.3. Knowledge Base (Vùng lưu trữ kiến thức)
- **Notes & Review:** Nơi viết ghi chú (Rich text editor) cho từng khóa học/tài nguyên. Có tính năng đánh dấu ngày cần ôn tập lại (Spaced Repetition đơn giản).
- **Flashcard:** Module tạo card hỏi/đáp (Front/Back). Có thể tạo thủ công hoặc AI tự tạo từ Notes.
- **Taxonomy & Tags:** Trang quản lý hệ thống phân loại. Gom nhóm các thẻ tag (VD: Tag `React`, `Vue` thuộc nhóm `Frontend`).

### 4.4. Mở rộng (Extensions)
- **Inbox:** Nơi chứa các link bot gửi vào nhưng chưa có tag hoặc course. Cần giao diện để user thao tác nhanh (gắn tag -> chuyển vào Course).
- **Opportunities:** Bảng lưu trữ riêng cho các link dạng cơ hội (Job JD, học bổng, sự kiện).

### 4.5. Settings (Cài đặt hệ thống)
- **AI:** Nhập API Key (OpenAI/Gemini) với cơ chế bảo mật Masking đầu vào để bật tính năng auto-tagging hoặc auto-summary.
- **Thiết bị và tiện ích (Device & Utils):** Hỗ trợ sao lưu và quản trị cấu hình hệ thống.
- **Portfolio & Shared Links (Hồ sơ năng lực):** Cho phép người dùng gom các link thành quả/dự án cá nhân, sắp xếp thứ tự hiển thị và xuất ra 1 trang public tại `/portfolio/[userId]` với giao diện thu gọn.
- **Maintenance (Bảo trì):** Chức năng quét liên kết hỏng (Broken link scanner) với thanh tiến trình tải động (progress bar) và cơ chế bất đồng bộ nền.

## 5. DATABASE SCHEMA YÊU CẦU (Gợi ý Prisma)
AI cần thiết kế schema gồm tối thiểu các bảng sau (và tự nghĩ thêm các trường cần thiết):
- `Resource` (Link/File bot thu về: url, type, title, status, thumbnail...)
- `Course` (Khóa học chứa nhiều resources)
- `Path` (Lộ trình chứa nhiều courses)
- `Tag` (Nhãn dán, quan hệ nhiều-nhiều với Resource/Course)
- `Note` (Ghi chú, liên kết với Resource)
- `Flashcard`
- `Routine` (Lịch trình)
- `Settings` (Lưu key AI, config)
- `PortfolioItem` (Gom nhóm thành quả và liên kết với học liệu)

## 6. HƯỚNG DẪN DÀNH CHO AI (SYSTEM INSTRUCTION)
- **Luôn tập trung vào Local & Free:** Không đề xuất các dịch vụ cloud tốn phí (như AWS S3, Vercel Postgres, Supabase) trừ khi bắt buộc. Dùng SQLite là ưu tiên tối thượng.
- **Code Modularity:** Tách các component UI riêng biệt (đặc biệt là 3 cái View Grid/Table/Board).
- **Phản hồi theo từng Phase (Giai đoạn):** Khi nhận được prompt này, hãy xác nhận bạn đã hiểu toàn bộ yêu cầu, sau đó bắt đầu bằng việc thiết kế cấu trúc thư mục (Folder structure) và tạo file `schema.prisma`. Chờ user duyệt rồi mới code tiếp các phần khác.
