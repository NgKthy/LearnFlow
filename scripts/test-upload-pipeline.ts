import "dotenv/config";
import { extractPdfText } from "../src/services/extractor/pdf";
import { prisma } from "../src/lib/prisma";
import { processTextAndSave } from "../src/services/learning/process-text";

async function main() {
    try {
        const url = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
        console.log("Downloading sample PDF from:", url);
        const res = await fetch(url);
        const buffer = Buffer.from(await res.arrayBuffer());

        console.log("Extracting text...");
        const result = await extractPdfText(buffer);
        console.log("Text content:", result.text);

        console.log("Creating resource in DB...");
        const resource = await prisma.resource.create({
            data: {
                title: "dummy.pdf",
                url: "in-memory://pdf/dummy.pdf",
                source: "PDF",
                type: "DOCUMENT",
                status: "PROCESSING",
                content: result.text,
            },
        });

        console.log("Running processTextAndSave for ID:", resource.id);
        await processTextAndSave(resource.id, result.text);
        console.log("Success! Pipeline run completed successfully.");
    } catch (err) {
        console.error("Pipeline failed with error:", err);
    }
}
main();
