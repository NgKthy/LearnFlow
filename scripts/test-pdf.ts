import fs from "fs/promises";
import { extractPdfText } from "../src/services/extractor/pdf";

async function main() {
    const buffer = await fs.readFile("C:/Users/asus/Downloads/LearnFlow/personal-lms/uploads/0ea218db-2144-48cb-a8fe-3ea23ef41872.pdf");

    const result = await extractPdfText(buffer);

    console.log("Page count:", result.pageCount);
    console.log("Text preview:", result.text.slice(0, 1000));
}

main();