import { BaseLLM } from "./base.js";
import { Generation, LLMResult } from "../schema/index.js";
import { GoogleVertexAIBaseLLMInput, GoogleVertexAIBasePrediction, GoogleVertexAILLMResponse } from "../types/googlevertexai-types.js";
export interface GoogleVertexAITextInput extends GoogleVertexAIBaseLLMInput {
}
interface GoogleVertexAILLMTextInstance {
    content: string;
}
/**
 * Models the data returned from the API call
 */
interface TextPrediction extends GoogleVertexAIBasePrediction {
    content: string;
}
/**
 * Enables calls to the Google Cloud's Vertex AI API to access
 * Large Language Models.
 *
 * To use, you will need to have one of the following authentication
 * methods in place:
 * - You are logged into an account permitted to the Google Cloud project
 *   using Vertex AI.
 * - You are running this on a machine using a service account permitted to
 *   the Google Cloud project using Vertex AI.
 * - The `GOOGLE_APPLICATION_CREDENTIALS` environment variable is set to the
 *   path of a credentials file for a service account permitted to the
 *   Google Cloud project using Vertex AI.
 */
export declare class GoogleVertexAI extends BaseLLM implements GoogleVertexAITextInput {
    model: string;
    temperature: number;
    maxOutputTokens: number;
    topP: number;
    topK: number;
    private connection;
    constructor(fields?: GoogleVertexAITextInput);
    _llmType(): string;
    _generate(prompts: string[], options: this["ParsedCallOptions"]): Promise<LLMResult>;
    _generatePrompt(prompt: string, options: this["ParsedCallOptions"]): Promise<Generation[]>;
    formatInstance(prompt: string): GoogleVertexAILLMTextInstance;
    extractPredictionFromResponse(result: GoogleVertexAILLMResponse<TextPrediction>): TextPrediction;
}
export {};
