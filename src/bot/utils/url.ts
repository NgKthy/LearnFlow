/**
 * Parameters that should be removed from URLs.
 * These parameters usually contain tracking information only.
 */
const TRACKING_PARAMS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "fbclid",
    "gclid",
    "si",
    "feature",
    "pp",
];

/**
 * Extract the first HTTP/HTTPS URL from a raw text.
 */
export function extractFirstUrl(text: string): string | null {
    const regex = /(https?:\/\/[^\s]+)/i;

    const match = text.match(regex);

    if (!match) {
        return null;
    }

    return match[0];
}

/**
 * Validate URL.
 */
export function isValidUrl(value: string): boolean {
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
}

/**
 * Normalize URL.
 *
 * - remove tracking parameters
 * - remove trailing slash
 * - normalize hostname to lowercase
 */
export function normalizeUrl(rawUrl: string): string {
    const url = new URL(rawUrl);

    url.hostname = url.hostname.toLowerCase();

    for (const param of TRACKING_PARAMS) {
        url.searchParams.delete(param);
    }

    if (!url.search) {
        url.search = "";
    }

    let normalized = url.toString();

    if (normalized.endsWith("/")) {
        normalized = normalized.slice(0, -1);
    }

    return normalized;
}