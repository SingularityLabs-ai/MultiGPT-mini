import { ZepClient } from "@getzep/zep-js";
import { InputValues, OutputValues, MemoryVariables } from "./base.js";
import { BaseChatMemory, BaseChatMemoryInput } from "./chat_memory.js";
export interface ZepMemoryInput extends BaseChatMemoryInput {
    humanPrefix?: string;
    aiPrefix?: string;
    memoryKey?: string;
    baseURL: string;
    sessionId: string;
}
export declare class ZepMemory extends BaseChatMemory implements ZepMemoryInput {
    humanPrefix: string;
    aiPrefix: string;
    memoryKey: string;
    baseURL: string;
    sessionId: string;
    zepClient: ZepClient;
    constructor(fields: ZepMemoryInput);
    get memoryKeys(): string[];
    loadMemoryVariables(values: InputValues): Promise<MemoryVariables>;
    saveContext(inputValues: InputValues, outputValues: OutputValues): Promise<void>;
    clear(): Promise<void>;
}
