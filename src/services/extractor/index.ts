import type { IExtractor } from "./interface";

import { ArticleExtractor } from "./article";
import { YoutubeExtractor } from "./youtube";

/**
 * Factory function for selecting the appropriate extractor
 * based on the detected platform.
 */
export async function extractContent(
    url: string,
    platform: string
): Promise<string> {
    let extractor: IExtractor;

    switch (platform) {
        case "YOUTUBE":
            extractor = new YoutubeExtractor();
            break;

        case "ARTICLE":
        case "GITHUB":
        default:
            extractor = new ArticleExtractor();
            break;
    }

    console.log(
        `[Extractor] Platform=${platform} | Extractor=${extractor.constructor.name}`
    );
    console.log(`[Extractor] URL=${url}`);

    const content = await extractor.extract(url);

    console.log(
        `[Extractor] Extracted ${content.length.toLocaleString()} characters`
    );

    return content;
}