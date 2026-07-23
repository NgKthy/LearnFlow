# LearnFlow Checklist

## Epic 1 — UI & Accessibility Patch (WCAG AA)
- [x] Task 1.1 — Typography Audit
  - [x] Rà soát toàn bộ project để tìm class `text-[9px]` in `src/**/*.{tsx,ts}`
  - [x] Lập danh sách các component bị ảnh hưởng trong `docs/ui/accessibility-audit.md`
  - [x] Xác nhận các trường hợp có thể thay bằng `text-xs` trong `docs/ui/accessibility-audit.md`
- [x] Task 1.2 — Typography Refactor
  - [x] Thay `text-[9px]` → `text-[10px]` hoặc `text-xs` trong `PathCard.tsx`
  - [x] Thay `text-[9px]` → `text-[10px]` hoặc `text-xs` trong `TodayTasks.tsx`
  - [x] Thay các vị trí metadata khác còn sử dụng font quá nhỏ trong `src/components/`
  - [x] Kiểm tra lại khoảng cách dòng (leading) sau khi tăng cỡ chữ trong các component đã chỉnh sửa
- [x] Task 1.3 — Contrast Audit
  - [x] Rà soát toàn bộ project tìm `text-slate-400` in `src/**/*.{tsx,ts}`
  - [x] Xác định các trường hợp nằm trên nền trắng (`bg-white`) và lưu vào `docs/ui/accessibility-audit.md`
- [x] Task 1.4 — Contrast Refactor
  - [x] Thay `text-slate-400` → `text-slate-500` tại các phần mô tả
  - [x] Thay `text-slate-400` → `text-slate-600` tại các metadata cần tăng tương phản
  - [x] Kiểm tra các trạng thái Hover/Disabled vẫn đúng ngữ nghĩa
  - [x] Kiểm thử trực quan trên Light Theme
- [x] Task 1.5 — Accessibility Regression
  - [x] Kiểm tra Heading hierarchy (H1 → H2 → H3) ở các trang chính
  - [x] Kiểm tra Focus Ring của Button/Input trong `src/components/ui/*`
  - [x] Kiểm tra khả năng điều hướng bằng bàn phím ở các component tương tác
  - [x] Kiểm tra màu sắc không phải là tín hiệu duy nhất truyền đạt trạng thái

## Epic 2 — Link Scanner Progress Bar
- [x] Task 2.1 — Chuẩn hóa dữ liệu tiến độ
  - [x] Thiết kế cấu trúc trạng thái tiến độ (total, processed, failed, percentage) trong `src/services/maintenance/check-links.ts`
  - [x] Cập nhật Scanner để tính toán phần trăm sau mỗi batch trong `src/services/maintenance/check-links.ts`
  - [x] Chuẩn hóa kiểu dữ liệu trả về trong `src/services/maintenance/check-links.ts`
- [x] Task 2.2 — Đồng bộ tiến độ Backend → Client
  - [x] Chọn cơ chế đồng bộ tiến độ (polling định kỳ) và tạo ADR `docs/adr/link-scanner-progress.md`
  - [x] Tạo endpoint hoặc Server Action trả về trạng thái hiện tại trong `src/app/settings/actions.ts`
  - [x] Trả về processed, total, percentage, status từ Server Action
- [x] Task 2.3 — Progress Bar Component
  - [x] Tạo `ProgressBar` component trong `src/components/settings/ProgressBar.tsx`
  - [x] Hiển thị giá trị phần trăm trong `ProgressBar`
  - [x] Hiển thị số URL đã quét / tổng số trong `ProgressBar`
  - [x] Thêm trạng thái hoàn thành và trạng thái lỗi trong `ProgressBar`
- [x] Task 2.4 — Settings Integration
  - [x] Thay `Loader2` bằng `ProgressBar` trong `src/app/settings/page.tsx` / `LinkScanner.tsx`
  - [x] Đồng bộ UI theo tiến độ Backend (polling)
  - [x] Hiển thị thông báo khi hoàn tất và số URL lỗi sau khi quét

## Epic 3 — System Settings
- [ ] Task 3.1 — Thiết kế lưu trữ Settings
  - [ ] Xác nhận schema Settings trong `schema.prisma` và migrate (nếu cần)
- [ ] Task 3.2 — Server Actions
  - [ ] Tạo Server Action đọc Settings
  - [ ] Tạo Server Action cập nhật Settings
  - [ ] Validate dữ liệu đầu vào và revalidate cache sau khi lưu
- [ ] Task 3.3 — Settings UI
  - [ ] Tạo form cấu hình AI và trường nhập Gemini API Key
  - [ ] Thêm nút Lưu, trạng thái Loading, thông báo thành công/thất bại
- [ ] Task 3.4 — Security Review
  - [ ] Không hiển thị toàn bộ API Key sau khi lưu (mask một phần giá trị hoặc show dummy)
  - [ ] Kiểm tra không ghi API Key vào log
  - [ ] Kiểm tra quyền truy cập trang Settings theo mô hình người dùng hiện tại

## Epic 4 — Portfolio & Shared Links
- [ ] Task 4.1 — Database
  - [ ] Thiết kế model `PortfolioItem` với relation tới `Resource` và `userId`
  - [ ] Tạo migration Prisma và chạy `npx prisma migrate dev`
  - [ ] Kiểm tra Prisma Client
- [ ] Task 4.2 — Server Actions
  - [ ] Tạo Portfolio Server Actions (create, update, delete, toggle public, reorder, validate & revalidate)
- [ ] Task 4.3 — Portfolio Management UI
  - [ ] Tạo trang quản lý Portfolio tại `/portfolio`
  - [ ] Tạo `PortfolioCard` và `PortfolioForm` components
  - [ ] Thêm công tắc Public/Private và Empty State
- [ ] Task 4.4 — Public Portfolio
  - [ ] Tạo route công khai `/portfolio/[userId]`
  - [ ] Chỉ hiển thị Portfolio Item có `isPublic = true`
  - [ ] Hiển thị danh sách thành quả học tập và Empty State
  - [ ] Kiểm tra phản hồi trên desktop và mobile
