import { YoutubeTranscript } from "youtube-transcript";

import type { IExtractor } from "./interface";

/**
 * Extractor for YouTube videos.
 *
 * Uses youtube-transcript to retrieve captions
 * and convert them into plain text.
 */
export class YoutubeExtractor implements IExtractor {
    async extract(url: string): Promise<string> {
        try {
            const transcript = await YoutubeTranscript.fetchTranscript(url);

            if (!transcript || transcript.length === 0) {
                return "";
            }

            return transcript
                .map((item) => item.text.trim())
                .filter(Boolean)
                .join(" ");
        } catch (error) {
            console.error(
                "[YoutubeExtractor] Failed to extract transcript:",
                error
            );

            return "";
        }
    }
}
