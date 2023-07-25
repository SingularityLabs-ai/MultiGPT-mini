import { LLMChain } from "../../chains/llm_chain.js";
import { PromptTemplate } from "../../prompts/index.js";
import { BaseLLM } from "../../llms/base.js";
import { GenerativeAgentMemory } from "./generative_agent_memory.js";
export type GenerativeAgentConfig = {
    name: string;
    age?: number;
    traits: string;
    status: string;
    verbose?: boolean;
    summaryRefreshSeconds?: number;
};
export declare class GenerativeAgent {
    name: string;
    age?: number;
    traits: string;
    status: string;
    memory: GenerativeAgentMemory;
    llm: BaseLLM;
    verbose: boolean;
    private summary;
    private summaryRefreshSeconds;
    private lastRefreshed;
    constructor(llm: BaseLLM, memory: GenerativeAgentMemory, config: GenerativeAgentConfig);
    parseList(text: string): string[];
    chain(prompt: PromptTemplate): LLMChain;
    getEntityFromObservations(observation: string): Promise<string>;
    getEntityAction(observation: string, entityName: string): Promise<string>;
    summarizeRelatedMemories(observation: string): Promise<string>;
    private _generateReaction;
    private _cleanResponse;
    generateReaction(observation: string, now?: Date): Promise<[boolean, string]>;
    generateDialogueResponse(observation: string, now?: Date): Promise<[boolean, string]>;
    getSummary(config?: {
        now?: Date;
        forceRefresh?: boolean;
    }): Promise<string>;
    computeAgentSummary(): Promise<string>;
    getFullHeader(config?: {
        now?: Date;
        forceRefresh?: boolean;
    }): string;
}
