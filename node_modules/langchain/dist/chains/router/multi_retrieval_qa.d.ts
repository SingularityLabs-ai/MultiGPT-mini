import { BaseLanguageModel } from "../../base_language/index.js";
import { MultiRouteChain, MultiRouteChainInput } from "./multi_route.js";
import { BaseChain } from "../../chains/base.js";
import { PromptTemplate } from "../../prompts/prompt.js";
import { BaseRetriever } from "../../schema/index.js";
import { RetrievalQAChainInput } from "../../chains/retrieval_qa.js";
export type MultiRetrievalDefaults = {
    defaultRetriever?: BaseRetriever;
    defaultPrompt?: PromptTemplate;
    defaultChain?: BaseChain;
};
export declare class MultiRetrievalQAChain extends MultiRouteChain {
    get outputKeys(): string[];
    /**
     * @deprecated Use `fromRetrieversAndPrompts` instead
     */
    static fromRetrievers(llm: BaseLanguageModel, retrieverNames: string[], retrieverDescriptions: string[], retrievers: BaseRetriever[], retrieverPrompts?: PromptTemplate[], defaults?: MultiRetrievalDefaults, options?: Omit<MultiRouteChainInput, "defaultChain">): MultiRetrievalQAChain;
    static fromLLMAndRetrievers(llm: BaseLanguageModel, { retrieverNames, retrieverDescriptions, retrievers, retrieverPrompts, defaults, multiRetrievalChainOpts, retrievalQAChainOpts, }: {
        retrieverNames: string[];
        retrieverDescriptions: string[];
        retrievers: BaseRetriever[];
        retrieverPrompts?: PromptTemplate[];
        defaults?: MultiRetrievalDefaults;
        multiRetrievalChainOpts?: Omit<MultiRouteChainInput, "defaultChain">;
        retrievalQAChainOpts?: Partial<Omit<RetrievalQAChainInput, "retriever" | "combineDocumentsChain">> & {
            prompt?: PromptTemplate;
        };
    }): MultiRetrievalQAChain;
    _chainType(): string;
}
