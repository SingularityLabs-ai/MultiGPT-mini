import { BaseChatModel } from "./base.js";
import { BaseChatMessage, ChatGeneration, ChatResult, LLMResult, MessageType } from "../schema/index.js";
import { GoogleVertexAIConnection } from "../util/googlevertexai-connection.js";
import { GoogleVertexAIBaseLLMInput, GoogleVertexAIBasePrediction } from "../types/googlevertexai-types.js";
/**
 * Represents a single "example" exchange that can be provided to
 * help illustrate what a model response should look like.
 */
export interface ChatExample {
    input: BaseChatMessage;
    output: BaseChatMessage;
}
interface GoogleVertexAIChatExample {
    input: GoogleVertexAIChatMessage;
    output: GoogleVertexAIChatMessage;
}
export type GoogleVertexAIChatAuthor = "user" | "bot" | "context";
export type GoogleVertexAIChatMessageFields = {
    author?: GoogleVertexAIChatAuthor;
    content: string;
    name?: string;
};
export declare class GoogleVertexAIChatMessage {
    author?: GoogleVertexAIChatAuthor;
    content: string;
    name?: string;
    constructor(fields: GoogleVertexAIChatMessageFields);
    static mapMessageTypeToVertexChatAuthor(baseMessageType: MessageType): GoogleVertexAIChatAuthor;
    static fromChatMessage(message: BaseChatMessage): GoogleVertexAIChatMessage;
}
export interface GoogleVertexAIChatInstance {
    context?: string;
    examples?: GoogleVertexAIChatExample[];
    messages: GoogleVertexAIChatMessage[];
}
export interface GoogleVertexAIChatPrediction extends GoogleVertexAIBasePrediction {
    candidates: GoogleVertexAIChatMessage[];
}
export interface GoogleVertexAIChatInput extends GoogleVertexAIBaseLLMInput {
    /** Instructions how the model should respond */
    context?: string;
    /** Help the model understand what an appropriate response is */
    examples?: ChatExample[];
}
/**
 * Enables calls to the Google Cloud's Vertex AI API to access
 * Large Language Models in a chat-like fashion.
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
export declare class ChatGoogleVertexAI extends BaseChatModel implements GoogleVertexAIChatInput {
    model: string;
    temperature: number;
    maxOutputTokens: number;
    topP: number;
    topK: number;
    examples: ChatExample[];
    connection: GoogleVertexAIConnection<this["CallOptions"], GoogleVertexAIChatInstance, GoogleVertexAIChatPrediction>;
    constructor(fields?: GoogleVertexAIChatInput);
    _combineLLMOutput(): LLMResult["llmOutput"];
    _generate(messages: BaseChatMessage[], options: this["ParsedCallOptions"]): Promise<ChatResult>;
    _llmType(): string;
    createInstance(messages: BaseChatMessage[]): GoogleVertexAIChatInstance;
    static convertPrediction(prediction: GoogleVertexAIChatPrediction): ChatGeneration;
}
export {};
