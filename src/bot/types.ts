/**
 * Supported platforms detected from a URL.
 *
 * Extend this union as the project grows.
 */
export type Platform =
    | "YOUTUBE"
    | "DRIVE"
    | "GITHUB"
    | "MEDIUM"
    | "SUBSTACK"
    | "ARTICLE"
    | "UNKNOWN";

/**
 * High-level resource type.
 * This value will later map to Resource.type in the database.
 */
export type ResourceType =
    | "VIDEO"
    | "DOCUMENT"
    | "ARTICLE"
    | "SOURCE_CODE"
    | "WEBSITE"
    | "UNKNOWN";

/**
 * Standard metadata returned by the ingestion pipeline.
 *
 * This DTO intentionally does NOT depend on Prisma or Database models.
 */
export interface MetadataDTO {
    url: string;

    normalizedUrl: string;

    platform: Platform;

    type: ResourceType;

    title: string;

    description?: string;

    thumbnail?: string;

    author?: string;

    siteName?: string;
}

/**
 * Result returned by platform detection.
 */
export interface PlatformDetectionResult {
    platform: Platform;
    type: ResourceType;
}

/**
 * Raw metadata parsed directly from HTML.
 *
 * This interface is intentionally separated from MetadataDTO.
 * Parser only extracts information.
 * Mapping to MetadataDTO is handled by the service layer.
 */
export interface ParsedMetadata {
    title?: string;

    description?: string;

    thumbnail?: string;

    author?: string;

    siteName?: string;
}