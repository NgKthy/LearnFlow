import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

import type { IExtractor } from "./interface";

/**
 * Extracts clean plain text from an article/web page.
 *
 * Uses:
 *  - Native fetch()
 *  - Mozilla Readability
 *  - JSDOM
 */
export class ArticleExtractor implements IExtractor {
    async extract(url: string): Promise<string> {
        try {
            const response = await fetch(url, {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
                    Accept:
                        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.9",
                },
            });

            if (!response.ok) {
                console.error(
                    `[ArticleExtractor] Failed to fetch article (${response.status})`
                );
                return "";
            }

            const html = await response.text();

            const dom = new JSDOM(html, {
                url,
            });

            const reader = new Readability(dom.window.document);

            const article = reader.parse();

            if (!article?.textContent) {
                return "";
            }

            const cleanedText = article.textContent
                .replace(/\r/g, " ")
                .replace(/\n+/g, " ")
                .replace(/\s+/g, " ")
                .trim();

            return cleanedText;
        } catch (error) {
            console.error(
                "[ArticleExtractor] Failed to extract article:",
                error
            );

            return "";
        }
    }
}