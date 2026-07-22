# Architecture Decision Record (ADR) — Background Processing Strategy

*   **Status:** Decided
*   **Date:** 2026-07-22
*   **Author:** Antigravity (Principal Software Engineer)

---

## Context (Bối cảnh)

Trong dự án LearnFlow, việc xử lý tài nguyên học liệu bằng AI (tóm tắt, sinh flashcards, sinh quiz) là một tác vụ nặng và tốn nhiều thời gian (thường từ 15-30 giây tùy thuộc vào độ dài tài liệu và tốc độ phản hồi của API Gemini). 

Hiện tại, Server Action `uploadPdf` và Retry Action kích hoạt tiến trình này bất đồng bộ bằng cách gọi Promise không có từ khóa `await`. Luồng này chạy tốt ở môi trường phát triển local (Node.js event loop tiếp tục xử lý). Tuy nhiên, trên môi trường Serverless (Vercel):
1.  Nếu sử dụng `await`, request Server Action sẽ bị treo và dính lỗi **504 Gateway Timeout** do giới hạn thời gian phản hồi (10 giây đối với tài khoản Vercel Hobby).
2.  Nếu không sử dụng `await`, serverless container sẽ bị đóng băng (freeze) hoặc thu hồi ngay sau khi Server Action trả về response, dẫn tới việc tiến trình chạy nền bị ngắt quãng giữa chừng, tài nguyên bị kẹt ở trạng thái `PROCESSING` vĩnh viễn.

---

## Options Evaluated (Các phương án đánh giá)

### Phương án 1: Next.js `after()` (Từ `next/server`)
*   **Cách hoạt động:** Cho phép đăng ký một callback hàm chạy sau khi response đã hoàn tất gửi về trình duyệt.
*   **Ưu điểm:**
    *   Tích hợp sẵn trong Next.js 15+ và Next.js 16 (nơi `after()` đã chính thức ổn định).
    *   Hoàn toàn miễn phí, chạy trực tiếp trên hạ tầng serverless của Vercel mà không cần cấu hình thêm dịch vụ ngoài.
    *   Giữ nguyên luồng code đơn giản, local-friendly, đúng triết lý PRD.
*   **Nhược điểm:** Vẫn bị giới hạn bởi thời gian chạy tối đa của serverless function nền.

### Phương án 2: Next.js `waitUntil` (Từ `@vercel/functions`)
*   **Cách hoạt động:** Nhận vào một Promise. Hàm này báo cho runtime serverless giữ container hoạt động cho đến khi Promise đó giải quyết xong.
*   **Nhược điểm:** Yêu cầu cài đặt thêm package phụ thuộc vào nền tảng `@vercel/functions` thay vì là native Next.js, làm giảm tính độc lập của codebase khi chạy offline local.

### Phương án 3: Hàng đợi ngoài (Inngest / Upstash QStash)
*   **Cách hoạt động:** Server Action gửi một HTTP POST (event) sang bên thứ ba. Bên thứ ba sẽ gọi ngược lại (webhook) Next.js API Route để thực hiện tiến trình AI lâu dài.
*   **Nhược điểm:** Tăng độ phức tạp cấu trúc dự án và vi phạm nguyên tắc "Local & Free" được đề cập trong PRD (Mục 6).

---

## Decision (Quyết định)

Chúng tôi quyết định chọn **Phương án 1: Next.js `after()`** để thực thi các tác vụ xử lý AI nền.

Lý do:
1.  Là tính năng native của Next.js 16 (phiên bản hiện tại của dự án là `16.2.10`), không phát sinh thêm thư viện hay cấu hình môi trường phức tạp.
2.  Không yêu cầu tài khoản hay cloud service trả phí ngoài, tuân thủ tuyệt đối nguyên tắc PRD tối giản của dự án.
3.  Client đã hỗ trợ cơ chế tự động tải lại (auto-refresh) sau 5 giây nên việc trả response tức thì khi tài liệu ở trạng thái `PROCESSING` kết hợp với `after()` để xử lý nền là giải pháp tối ưu nhất cho UI/UX.

---

## Implementation Details (Chi tiết triển khai)

Import hàm `after` từ `next/server` và bọc tiến trình xử lý nền:
```typescript
import { after } from "next/server";

// Trong Server Action
after(async () => {
    try {
        console.time("Upload Pipeline");
        await processTextAndSave(resourceId, text);
        console.timeEnd("Upload Pipeline");
    } catch (err) {
        console.timeEnd("Upload Pipeline");
        console.error("Background AI processing error:", err);
    }
});
```
