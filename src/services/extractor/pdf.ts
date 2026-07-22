import { PDFParse } from "pdf-parse";

export interface ExtractPdfResult {
    text: string;
    pageCount: number;
    info?: Record<string, unknown>;
}

export async function extractPdfText(
    buffer: Buffer
): Promise<ExtractPdfResult> {
    const parser = new PDFParse({ data: buffer });
    try {
        const textResult = await parser.getText();
        const infoResult = await parser.getInfo();

        return {
            text: textResult.text.trim(),
            pageCount: textResult.total,
            info: infoResult.info as Record<string, unknown>,
        };
    } finally {
        await parser.destroy();
    }
}