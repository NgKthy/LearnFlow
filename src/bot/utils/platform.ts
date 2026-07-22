import type { Platform, ResourceType } from "../types";

export interface PlatformDetectionResult {
    platform: Platform;
    type: ResourceType;
}

/**
 * Detect platform and resource type from URL.
 */
export function detectPlatform(url: string): PlatformDetectionResult {
    const hostname = new URL(url).hostname.toLowerCase();

    // -----------------------------
    // YouTube
    // -----------------------------

    if (
        hostname.includes("youtube.com") ||
        hostname.includes("youtu.be")
    ) {
        return {
            platform: "YOUTUBE",
            type: "VIDEO",
        };
    }

    // -----------------------------
    // Google Drive
    // -----------------------------

    if (hostname.includes("drive.google.com")) {
        return {
            platform: "DRIVE",
            type: "DOCUMENT",
        };
    }

    // -----------------------------
    // GitHub
    // -----------------------------

    if (hostname.includes("github.com")) {
        return {
            platform: "GITHUB",
            type: "SOURCE_CODE",
        };
    }

    // -----------------------------
    // Medium
    // -----------------------------

    if (
        hostname.includes("medium.com") ||
        hostname.endsWith(".medium.com")
    ) {
        return {
            platform: "MEDIUM",
            type: "ARTICLE",
        };
    }

    // -----------------------------
    // Substack
    // -----------------------------

    if (hostname.endsWith(".substack.com")) {
        return {
            platform: "SUBSTACK",
            type: "ARTICLE",
        };
    }

    // -----------------------------
    // Generic Website
    // -----------------------------

    if (
        hostname.includes(".com") ||
        hostname.includes(".dev") ||
        hostname.includes(".org") ||
        hostname.includes(".net")
    ) {
        return {
            platform: "ARTICLE",
            type: "WEBSITE",
        };
    }

    return {
        platform: "UNKNOWN",
        type: "UNKNOWN",
    };
}