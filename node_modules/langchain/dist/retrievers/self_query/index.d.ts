import { LLMChain } from "../../chains/llm_chain.js";
import { QueryConstructorChainOptions } from "../../chains/query_constructor/index.js";
import { Document } from "../../document.js";
import { BaseRetriever } from "../../schema/index.js";
import { VectorStore } from "../../vectorstores/base.js";
import { FunctionalTranslator } from "./functional.js";
import { BaseTranslator, BasicTranslator } from "./base.js";
export { BaseTranslator, BasicTranslator, FunctionalTranslator };
export type SelfQueryRetrieverArgs = {
    vectorStore: VectorStore;
    structuredQueryTranslator: BaseTranslator;
    llmChain: LLMChain;
    verbose?: boolean;
    searchParams?: {
        k?: number;
        filter?: VectorStore["FilterType"];
    };
};
export declare class SelfQueryRetriever extends BaseRetriever implements SelfQueryRetrieverArgs {
    vectorStore: VectorStore;
    llmChain: LLMChain;
    verbose?: boolean;
    structuredQueryTranslator: BaseTranslator;
    searchParams?: {
        k?: number;
        filter?: VectorStore["FilterType"];
    };
    constructor(options: SelfQueryRetrieverArgs);
    getRelevantDocuments(query: string): Promise<Document<Record<string, unknown>>[]>;
    static fromLLM(options: QueryConstructorChainOptions & Omit<SelfQueryRetrieverArgs, "llmChain">): SelfQueryRetriever;
}
