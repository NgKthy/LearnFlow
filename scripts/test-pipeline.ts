/**
 * ------------------------------------------------------------
 * Personal LMS - Ingestion Pipeline Test
 * ------------------------------------------------------------
 *
 * Run this script with:
 *
 *    npx tsx scripts/test-pipeline.ts
 *
 * Or (recommended) add this script into package.json:
 *
 * {
 *   "scripts": {
 *     "test:pipeline": "tsx scripts/test-pipeline.ts"
 *   }
 * }
 *
 * Then run:
 *
 *    npm run test:pipeline
 * ------------------------------------------------------------
 */

import { runIngestionPipeline } from "../src/bot/services/pipeline";

interface TestCase {
    name: string;
    message: string;
}

/**
 * Pretty separator.
 */
function printSeparator(title: string): void {
    console.log();
    console.log("=".repeat(80));
    console.log(title);
    console.log("=".repeat(80));
}

/**
 * Execute all pipeline test cases.
 */
async function runTests(): Promise<void> {
    const testCases: TestCase[] = [
        {
            name: "Case 1 - YouTube with Tracking Parameters",
            message:
                "Đây là video hay quá https://www.youtube.com/watch?v=dQw4w9WgXcQ&si=xyz123&t=45 mọi người xem nhé",
        },

        {
            name: "Case 2 - Google Drive Document",
            message:
                "https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/view?usp=sharing",
        },

        {
            name: "Case 3 - Invalid Website (Fallback Test)",
            message:
                "https://example-non-existent-site-12345.com/404",
        },

        {
            name: "Case 4 - Message Without URL",
            message:
                "Hôm nay mình muốn học React và TypeScript.",
        },
    ];

    console.log();
    console.log("🚀 Personal LMS - Ingestion Pipeline Test");
    console.log(`Running ${testCases.length} test cases...`);

    for (const [index, testCase] of testCases.entries()) {
        printSeparator(
            `${index + 1}. ${testCase.name}`
        );

        console.log("Input:");
        console.log(testCase.message);
        console.log();

        try {
            const result =
                await runIngestionPipeline(
                    testCase.message
                );

            if (result === null) {
                console.log(
                    "Result: No URL detected."
                );
                continue;
            }

            console.log("MetadataDTO:");

            console.dir(result, {
                depth: null,
                colors: true,
            });

            console.log();

            console.table({
                Platform: result.platform,
                Type: result.type,
                Title: result.title,
                Author: result.author ?? "-",
                Site: result.siteName ?? "-",
                URL: result.normalizedUrl,
            });
        } catch (error) {
            console.error(
                "Unexpected test error:"
            );

            console.error(error);
        }
    }

    console.log();
    console.log("✅ Pipeline test finished.");
}

runTests().catch((error) => {
    console.error(
        "Fatal error while executing tests:"
    );

    console.error(error);

    process.exit(1);
});
