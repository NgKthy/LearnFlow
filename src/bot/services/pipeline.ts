import type { MetadataDTO } from "../types";

import { fetchMetadata } from "./metadata";

import {
    extractFirstUrl,
    normalizeUrl,
} from "../utils/url";

import { detectPlatform } from "../utils/platform";

/**
 * Run the complete ingestion pipeline.
 *
 * This function acts as the Facade of the ingestion layer.
 *
 * External modules (Telegram Bot, CLI, REST API...)
 * only need to call this single function instead of
 * knowing the internal workflow.
 *
 * Pipeline:
 *
 * Raw Message
 *      │
 *      ▼
 * extractFirstUrl()
 *      │
 *      ▼
 * normalizeUrl()
 *      │
 *      ▼
 * detectPlatform()
 *      │
 *      ▼
 * fetchMetadata()
 *      │
 *      ▼
 * MetadataDTO
 *
 * Returns:
 * - MetadataDTO when a URL is successfully processed.
 * - null when no URL exists in the message.
 */
export async function runIngestionPipeline(
    rawMessage: string
): Promise<MetadataDTO | null> {
    // ----------------------------------------
    // Step 1
    // Extract the first URL from the message.
    // ----------------------------------------

    const url = extractFirstUrl(rawMessage);

    // No URL found.
    if (!url) {
        return null;
    }

    // ----------------------------------------
    // Step 2
    // Normalize URL by removing tracking params.
    // ----------------------------------------

    const normalizedUrl = normalizeUrl(url);

    // ----------------------------------------
    // Step 3
    // Detect platform and resource type.
    // ----------------------------------------

    const detection = detectPlatform(
        normalizedUrl
    );

    // ----------------------------------------
    // Step 4
    // Fetch webpage metadata.
    //
    // This function NEVER throws because
    // metadata.ts already handles all errors
    // internally and falls back gracefully.
    // ----------------------------------------

    const metadata = await fetchMetadata(
        url,
        normalizedUrl,
        detection
    );

    // ----------------------------------------
    // Step 5
    // Return the final DTO.
    // ----------------------------------------

    return metadata;
}
