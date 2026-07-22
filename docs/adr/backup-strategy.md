# ADR 003: Chiến lược sao lưu dữ liệu (Database Backup Strategy)

## Bối cảnh (Context)
LearnFlow lưu trữ dữ liệu học tập cá nhân quan trọng (tài liệu, ghi chú, flashcards, lộ trình học, v.v.). Người dùng cần có phương thức sao lưu và tải xuống toàn bộ dữ liệu này dưới dạng một tệp duy nhất để lưu trữ cục bộ, phục hồi khi chuyển đổi máy chủ, hoặc xuất ra bên ngoài dưới dạng tệp tin di động.

## Quyết định (Decision)
Chúng tôi quyết định triển khai tính năng **Sao lưu dữ liệu JSON tự phục vụ (Self-Service JSON Data Export/Import)** thông qua Giao diện cài đặt (Settings UI):

1. **Định dạng Sao lưu:** Sử dụng định dạng **JSON** nén để xuất dữ liệu vì tính linh hoạt, dễ đọc đối với cả người dùng và máy tính, dễ dàng chuyển đổi sang các cơ sở dữ liệu khác (SQLite, PostgreSQL, MySQL) mà không phụ thuộc vào công cụ dump hệ thống cơ sở dữ liệu (pg_dump).
2. **Các thực thể xuất bản:** Xuất tất cả các bảng dữ liệu liên quan đến người dùng:
   - `Course`
   - `Resource`
   - `Routine`
   - `Flashcard`
   - `Quiz` / `Activity` (nếu có)
   - `Note`
   - `Tag`
   - `Setting` (loại bỏ các khóa bí mật như `GEMINI_API_KEY` để bảo mật).
3. **Cơ chế tải xuống:** Tải xuống trực tiếp thông qua API Router Handler Next.js với tiêu đề `Content-Disposition: attachment; filename=learnflow-backup-YYYY-MM-DD.json`.

## Hệ quả (Consequences)
- **Ưu điểm:**
  - Tiện lợi cho người dùng cuối: chỉ cần 1 cú click chuột để tải về toàn bộ dữ liệu.
  - Độc lập cơ sở dữ liệu: dễ dàng import lại dữ liệu vào cả bản Postgres cloud và bản SQLite local.
  - Bảo mật: không chứa API Key nhạy cảm trong bản backup.
- **Nhược điểm:**
  - Không sao lưu tệp đính kèm vật lý (PDF files) mà chỉ lưu thông tin metadata và nội dung text trích xuất.
