import type { Summary } from "./schema";
import type { Flashcard } from "./schemas/flashcard";
import type { QuizQuestion } from "./quiz";

import { generateSummary } from "./summarizer";
import { generateFlashcards } from "./flashcards";
import { generateQuiz } from "./quiz";

/**
 * Result returned by the AI processing workflow.
 */
export interface AIProcessedResult {
    summary: Summary | null;

    flashcards: Flashcard[];

    quiz: QuizQuestion[];
}

/**
 * AI Facade / Orchestrator.
 *
 * Executes all AI generators in parallel and
 * aggregates the results into a single DTO.
 */
export async function processContentWorkflow(
    text: string
): Promise<AIProcessedResult> {
    const results = await Promise.allSettled([
        generateSummary(text),
        generateFlashcards(text),
        generateQuiz(text),
    ]);

    const summaryResult = results[0];
    const flashcardsResult = results[1];
    const quizResult = results[2];

    const summary =
        summaryResult.status === "fulfilled"
            ? summaryResult.value
            : (() => {
                console.error(
                    "[AI Pipeline] Summary generation failed:",
                    summaryResult.reason
                );

                return null;
            })();

    const flashcards =
        flashcardsResult.status === "fulfilled"
            ? flashcardsResult.value
            : (() => {
                console.error(
                    "[AI Pipeline] Flashcards generation failed:",
                    flashcardsResult.reason
                );

                return [];
            })();

    const quiz =
        quizResult.status === "fulfilled"
            ? quizResult.value
            : (() => {
                console.error(
                    "[AI Pipeline] Quiz generation failed:",
                    quizResult.reason
                );

                return [];
            })();

    return {
        summary,
        flashcards,
        quiz,
    };
}