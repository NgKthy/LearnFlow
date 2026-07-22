import { PDFParse } from "pdf-parse";

export interface ExtractPdfResult {
    text: string;
    pageCount: number;
    info?: Record<string, unknown>;
}

/**
 * Extracts raw text from a PDF Buffer, normalizes spacing,
 * and validates that the extracted text is not empty.
 */
export async function extractPdfText(
    buffer: Buffer
): Promise<ExtractPdfResult> {
    if (!buffer || buffer.length === 0) {
        throw new Error("Dữ liệu file PDF trống hoặc không hợp lệ");
    }

    const parser = new PDFParse({ data: buffer });
    try {
        const textResult = await parser.getText();
        const infoResult = await parser.getInfo();
        
        let text = textResult.text || "";
        
        // Normalize whitespace: trim lines and remove empty lines
        text = text
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0)
            .join("\n");

        if (!text.trim()) {
            throw new Error("Tài liệu PDF không chứa văn bản hợp lệ hoặc không thể trích xuất văn bản");
        }

        return {
            text,
            pageCount: textResult.total,
            info: infoResult.info as Record<string, unknown>,
        };
    } catch (error: any) {
        console.error("[PDF Extractor] Error parsing PDF:", error);
        throw new Error(`Lỗi khi đọc file PDF: ${error.message || error}`);
    } finally {
        await parser.destroy();
    }
}