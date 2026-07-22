import { generateObject } from "ai";
import { z } from "zod";

import { getModel } from "./provider";

/**
 * Single quiz question.
 */
export const QuizQuestionSchema = z.object({
    question: z
        .string()
        .describe("Câu hỏi trắc nghiệm ngắn gọn, tập trung vào việc kiểm tra khả năng hiểu."),

    options: z
        .tuple([
            z.string(),
            z.string(),
            z.string(),
            z.string(),
        ])
        .describe("Chính xác 4 đáp án theo thứ tự A, B, C, D."),

    correctOptionIndex: z
        .number()
        .int()
        .min(0)
        .max(3)
        .describe("Vị trí đáp án đúng, từ 0 đến 3."),

    explanation: z
        .string()
        .describe("Giải thích ngắn gọn tại sao đáp án đúng."),
});

/**
 * Quiz response.
 */
export const QuizResponseSchema = z.object({
    questions: z
        .array(QuizQuestionSchema)
        .min(3)
        .max(5)
        .describe("Danh sách từ 3 đến 5 câu hỏi trắc nghiệm."),
});

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

export type QuizResponse = z.infer<typeof QuizResponseSchema>;

/**
 * Generate comprehension-focused quiz questions.
 */
export async function generateQuiz(
    text: string
): Promise<QuizQuestion[]> {
    try {
        const { object } = await generateObject({
            model: getModel(),

            schema: QuizResponseSchema,

            system: `
Bạn là một chuyên gia giáo dục và thiết kế bài kiểm tra.

Nhiệm vụ của bạn là đánh giá MỨC ĐỘ HIỂU của người học,
không phải khả năng học thuộc lòng.

Hãy:

- Đọc nội dung đầu vào.
- Bỏ qua các phần không có giá trị học tập.
- Chỉ sử dụng các kiến thức cốt lõi.

Quy tắc tạo câu hỏi:

- Tạo từ 3 đến 5 câu hỏi.
- Mỗi câu có đúng 4 đáp án.
- Chỉ có duy nhất một đáp án đúng.
- Các đáp án nhiễu phải hợp lý, không quá vô lý.
- Câu hỏi nên yêu cầu người học hiểu khái niệm,
  mối quan hệ hoặc cách áp dụng kiến thức.
- Hạn chế các câu hỏi chỉ yêu cầu nhớ máy móc.

Sau mỗi câu hỏi, cung cấp một lời giải thích ngắn gọn
về đáp án đúng.
      `.trim(),

            prompt: text,
        });

        return object.questions;
    } catch (error) {
        console.error(
            "[AI] Failed to generate quiz:",
            error
        );

        return [];
    }
}