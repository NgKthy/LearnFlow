/**
 * Strategy interface for extracting plain text content
 * from different resource platforms.
 */
export interface IExtractor {
    /**
     * Extract clean plain text from a resource URL.
     *
     * Never throw an exception.
     * Return an empty string when extraction fails.
     */
    extract(url: string): Promise<string>;
}
