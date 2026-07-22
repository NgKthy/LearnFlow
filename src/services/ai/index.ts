import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { SummarySchema } from "./schema";

/**
 * Generate structured learning summary from plain text.
 */
export async function generateSummary(text: string) {
    try {
        const { object } = await generateObject({
            model: google("gemini-1.5-flash"),
            schema: SummarySchema,

            system: `
Bạn là một trợ lý học tập xuất sắc.

Nhiệm vụ của bạn:

- Phân tích nội dung được cung cấp.
- Loại bỏ các phần không có giá trị học tập như:
  - menu website
  - footer
  - quảng cáo
  - copyright
  - nội dung điều hướng
  - văn bản lặp lại
- Chỉ giữ lại kiến thức chính.

Sau đó hãy trả về đúng schema được yêu cầu.

Yêu cầu:

- summary:
  Viết bằng tiếng Việt.
  Khoảng 3-4 câu.
  Dễ hiểu.

- keyPoints:
  Liệt kê 3-5 ý quan trọng nhất.

- tags:
  Sinh tối đa 5 tag ngắn gọn.
  Ví dụ:
  React
  TypeScript
  AI
  Productivity

- difficulty:
  Chỉ chọn một trong:
  - Bắt đầu
  - Trung bình
  - Nâng cao

- estimatedReadingTime:
  Ước lượng số phút cần để đọc toàn bộ nội dung.
  Chỉ trả về số nguyên.
      `.trim(),

            prompt: text,
        });

        return object;
    } catch (error) {
        console.error(
            "[AI] Failed to generate structured summary:",
            error
        );

        throw error;
    }
}