import * as cheerio from "cheerio";

import type {
    MetadataDTO,
    ParsedMetadata,
    PlatformDetectionResult,
} from "../types";

/**
 * Browser-like User-Agent.
 *
 * Some websites reject requests with the default Node.js user agent.
 */
const DEFAULT_USER_AGENT =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
    "AppleWebKit/537.36 (KHTML, like Gecko) " +
    "Chrome/138.0.0.0 Safari/537.36";

/**
 * Create the minimum valid MetadataDTO.
 *
 * This function is used whenever metadata extraction fails.
 *
 * The ingestion pipeline must NEVER crash because
 * a website blocks scraping or times out.
 */
export function createFallbackMetadata(
    url: string,
    normalizedUrl: string,
    detection: PlatformDetectionResult
): MetadataDTO {
    return {
        url,

        normalizedUrl,

        platform: detection.platform,

        type: detection.type,

        // Always have something readable.
        title: normalizedUrl,

        description: undefined,

        thumbnail: undefined,

        author: undefined,

        siteName: undefined,
    };
}

/**
 * Download HTML using native fetch().
 *
 * Features:
 * - AbortController timeout
 * - Browser User-Agent
 * - Automatic cleanup (clearTimeout)
 * - Throws on non-2xx response
 */
export async function fetchHTML(
    url: string,
    timeoutMs: number = 8000
): Promise<string> {
    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
        controller.abort();
    }, timeoutMs);

    try {
        const response = await fetch(url, {
            method: "GET",

            signal: controller.signal,

            redirect: "follow",

            headers: {
                "User-Agent": DEFAULT_USER_AGENT,

                Accept:
                    "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",

                "Accept-Language": "en-US,en;q=0.9",

                "Cache-Control": "no-cache",
            },
        });

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status} ${response.statusText}`
            );
        }

        return await response.text();
    } finally {
        // Prevent memory leak.
        clearTimeout(timeoutId);
    }
}

/**
 * Return the first non-empty meta content matching the given selectors.
 */
function getMetaContent(
    $: cheerio.CheerioAPI,
    selectors: string[]
): string | undefined {
    for (const selector of selectors) {
        const content = $(selector).attr("content")?.trim();

        if (content) {
            return content;
        }
    }

    return undefined;
}

/**
 * Extract page title.
 *
 * Priority:
 * 1. og:title
 * 2. twitter:title
 * 3. <title>
 */
function getTitle(
    $: cheerio.CheerioAPI
): string | undefined {
    const metaTitle = getMetaContent($, [
        'meta[property="og:title"]',
        'meta[name="twitter:title"]',
    ]);

    if (metaTitle) {
        return metaTitle;
    }

    const title = $("title").text().trim();

    return title || undefined;
}

/**
 * Extract page description.
 *
 * Priority:
 * 1. og:description
 * 2. twitter:description
 * 3. meta[name="description"]
 */
function getDescription(
    $: cheerio.CheerioAPI
): string | undefined {
    return getMetaContent($, [
        'meta[property="og:description"]',
        'meta[name="twitter:description"]',
        'meta[name="description"]',
    ]);
}

/**
 * Extract thumbnail image.
 *
 * Priority:
 * 1. og:image
 * 2. twitter:image
 */
function getThumbnail(
    $: cheerio.CheerioAPI
): string | undefined {
    return getMetaContent($, [
        'meta[property="og:image"]',
        'meta[name="twitter:image"]',
    ]);
}

/**
 * Extract author and site information.
 */
function getAuthorAndSite(
    $: cheerio.CheerioAPI
): {
    author?: string;
    siteName?: string;
} {
    const author = getMetaContent($, [
        'meta[name="author"]',
    ]);

    const siteName = getMetaContent($, [
        'meta[property="og:site_name"]',
        'meta[name="twitter:site"]',
    ]);

    return {
        author,
        siteName,
    };
}

/**
 * Parse HTML into ParsedMetadata.
 */
export function parseMetadata(
    html: string,
    url: string
): ParsedMetadata {
    const $ = cheerio.load(html);

    const { author, siteName } =
        getAuthorAndSite($);

    return {
        title: getTitle($),

        description: getDescription($),

        thumbnail: getThumbnail($),

        author,

        siteName,
    };
}

/**
 * Fetch and parse metadata from a URL.
 *
 * This function NEVER throws.
 * It always returns a valid MetadataDTO.
 */
export async function fetchMetadata(
    url: string,
    normalizedUrl: string,
    detection: PlatformDetectionResult
): Promise<MetadataDTO> {
    try {
        const html = await fetchHTML(url);

        const metadata = parseMetadata(html, url);

        return {
            url,

            normalizedUrl,

            platform: detection.platform,

            type: detection.type,

            title:
                metadata.title?.trim() ||
                normalizedUrl,

            description:
                metadata.description?.trim(),

            thumbnail:
                metadata.thumbnail?.trim(),

            author:
                metadata.author?.trim(),

            siteName:
                metadata.siteName?.trim(),
        };
    } catch (error) {
        console.warn(
            "[Metadata] Failed to fetch metadata:",
            url,
            error
        );

        return createFallbackMetadata(
            url,
            normalizedUrl,
            detection
        );
    }
}