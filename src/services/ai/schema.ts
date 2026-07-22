import { z } from "zod";

export const SummarySchema = z.object({
    summary: z
        .string()
        .describe("Tóm tắt ngắn gọn nội dung trong khoảng 3-4 câu."),

    keyPoints: z
        .array(z.string())
        .min(3)
        .max(5)
        .describe("3-5 ý chính quan trọng nhất."),

    tags: z
        .array(z.string())
        .max(5)
        .describe("Tối đa 5 thẻ tag để phân loại nội dung."),

    difficulty: z
        .enum(["Bắt đầu", "Trung bình", "Nâng cao"])
        .describe("Mức độ khó của tài liệu."),

    estimatedReadingTime: z
        .number()
        .describe("Thời gian đọc ước tính (đơn vị: phút)."),
});

export type Summary = z.infer<typeof SummarySchema>;