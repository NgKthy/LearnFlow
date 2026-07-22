import { z } from "zod";

/**
 * Single flashcard.
 */
export const FlashcardSchema = z.object({
    question: z
        .string()
        .describe("Câu hỏi ngắn gọn, tập trung vào một kiến thức duy nhất."),

    answer: z
        .string()
        .describe("Câu trả lời súc tích, dễ nhớ."),

    hint: z
        .string()
        .optional()
        .describe("Gợi ý nhỏ nếu người học chưa nhớ đáp án."),
});

/**
 * Response schema.
 */
export const FlashcardsResponseSchema = z.object({
    flashcards: z
        .array(FlashcardSchema)
        .min(3)
        .max(7)
        .describe("Danh sách từ 3 đến 7 flashcards."),
});

export type Flashcard = z.infer<typeof FlashcardSchema>;

export type FlashcardsResponse = z.infer<
    typeof FlashcardsResponseSchema
>;
