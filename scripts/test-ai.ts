import "dotenv/config";
process.env.AI_MODEL = "gemini-flash-latest"; // Test gemini-flash-latest

import { processContentWorkflow } from "../src/services/ai/pipeline";

async function main() {
    try {
        console.log("Using model:", process.env.AI_MODEL);

        const sampleText = `
LearnFlow: A Personal Learning Management System (LMS)
Project Requirements
1. Overview
The Personal LMS (code-named LearnFlow) is a web application designed to help individuals ingest, organize, and study from various learning resources.
It acts as a personal knowledge base and study companion, leveraging Artificial Intelligence (AI) to generate summaries, flashcards, and interactive quizzes.
The system encourages daily revision through a Spaced Repetition System (SRS).
        `.trim();

        console.log("Running AI workflow with sample text...");
        const aiResult = await processContentWorkflow(sampleText);
        console.log("AI workflow result summary:", aiResult.summary);
        console.log("AI workflow result flashcards count:", aiResult.flashcards.length);
        console.log("AI workflow result quiz questions count:", aiResult.quiz.length);
    } catch (err) {
        console.error("AI workflow failed with error:", err);
    }
}

main();
