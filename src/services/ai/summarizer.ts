import { generateObject } from "ai";

import { SummarySchema } from "./schema";
import { getModel } from "./provider";

/**
 * Generate a structured learning summary from plain text.
 */
export async function generateSummary(text: string) {
    try {
        const { object } = await generateObject({
            model: getModel(),

            schema: SummarySchema,

            system: `
Bạn là một trợ lý học tập xuất sắc.

Nhiệm vụ của bạn là:

- Phân tích nội dung đầu vào.
- Loại bỏ các phần không có giá trị học tập:
  - quảng cáo
  - menu
  - footer
  - copyright
  - điều hướng
  - văn bản lặp

Sau đó tạo ra dữ liệu có cấu trúc theo schema.

Yêu cầu:

- summary:
  Viết bằng tiếng Việt.
  Khoảng 3-4 câu.

- keyPoints:
  Liệt kê từ 3 đến 5 ý quan trọng nhất.

- tags:
  Sinh tối đa 5 tag ngắn gọn.

- difficulty:
  Chỉ chọn:
  - Bắt đầu
  - Trung bình
  - Nâng cao

- estimatedReadingTime:
  Ước lượng số phút đọc.
  Chỉ trả về số nguyên.
      `.trim(),

            prompt: text,
        });

        return object;
    } catch (error) {
        console.error(
            "[AI] Failed to generate summary:",
            error
        );

        throw error;
    }
}