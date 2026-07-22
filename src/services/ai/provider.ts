import type { LanguageModel } from "ai";
import { google } from "@ai-sdk/google";

/**
 * Supported AI providers.
 *
 * Extend this type when adding new providers:
 * - openai
 * - ollama
 * - groq
 * - anthropic
 */
type AIProvider = "google";

/**
 * Environment configuration.
 */
const provider = (
    process.env.AI_PROVIDER ?? "google"
).toLowerCase() as AIProvider;

const modelName =
    process.env.AI_MODEL ?? "gemini-1.5-flash";

let model: LanguageModel;

/**
 * Initialize provider.
 */
switch (provider) {
    case "google": {
        const apiKey =
            process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        if (!apiKey) {
            throw new Error(
                "Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable."
            );
        }

        model = google(modelName);

        break;
    }

    default:
        throw new Error(
            `Unsupported AI provider: ${provider}`
        );
}

/**
 * Returns the configured language model.
 */
export function getModel(): LanguageModel {
    return model;
}

/**
 * Returns current provider name.
 */
export function getProvider(): AIProvider {
    return provider;
}

/**
 * Returns current model name.
 */
export function getModelName(): string {
    return modelName;
}