import { BaseChatMemory, BaseChatMemoryInput } from "./chat_memory.js";
import { InputValues, OutputValues, MemoryVariables } from "./base.js";
import { AsyncCaller, AsyncCallerParams } from "../util/async_caller.js";
export interface MotorheadMemoryMessage {
    role: string;
    content: string;
}
/**
 * @interface
 */
export type MotorheadMemoryInput = BaseChatMemoryInput & AsyncCallerParams & {
    sessionId: string;
    /** @deprecated Use "url" instead. */
    motorheadURL?: string;
    url?: string;
    memoryKey?: string;
    timeout?: number;
    apiKey?: string;
    clientId?: string;
};
export declare class MotorheadMemory extends BaseChatMemory {
    url: string;
    timeout: number;
    memoryKey: string;
    sessionId: string;
    context?: string;
    caller: AsyncCaller;
    apiKey?: string;
    clientId?: string;
    constructor(fields: MotorheadMemoryInput);
    get memoryKeys(): string[];
    _getHeaders(): HeadersInit;
    init(): Promise<void>;
    loadMemoryVariables(_values: InputValues): Promise<MemoryVariables>;
    saveContext(inputValues: InputValues, outputValues: OutputValues): Promise<void>;
}
