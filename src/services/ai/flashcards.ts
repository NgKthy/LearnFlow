import { generateObject } from "ai";

import { getModel } from "./provider";
import { FlashcardsResponseSchema } from "./schemas/flashcard";

/**
 * Generate flashcards using Spaced Repetition principles.
 */
export async function generateFlashcards(text: string) {
    try {
        const { object } = await generateObject({
            model: getModel(),

            schema: FlashcardsResponseSchema,

            system: `
Bạn là một chuyên gia giáo dục và thiết kế Flashcards.

Nhiệm vụ:

- Đọc nội dung đầu vào.
- Loại bỏ các phần không có giá trị học tập nếu còn sót lại.
- Chỉ giữ lại các kiến thức cốt lõi.

Sau đó tạo Flashcards theo phương pháp Spaced Repetition.

Quy tắc:

- Mỗi Flashcard chỉ chứa MỘT ý.
- Không gộp nhiều khái niệm trong một câu hỏi.
- Câu hỏi ngắn gọn.
- Câu trả lời súc tích.
- Có thể thêm hint nếu hữu ích.

Ưu tiên tạo Flashcards từ:

- Định nghĩa
- Khái niệm
- Quy trình
- Công thức
- Nguyên lý
- Best Practices
- Thuật ngữ quan trọng

Không tạo câu hỏi quá dài.

Tạo từ 3 đến 7 Flashcards.
      `.trim(),

            prompt: text,
        });

        return object.flashcards;
    } catch (error) {
        console.error(
            "[AI] Failed to generate flashcards:",
            error
        );

        throw error;
    }
}