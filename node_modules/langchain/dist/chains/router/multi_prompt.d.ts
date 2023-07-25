import { BaseLanguageModel } from "../../base_language/index.js";
import { MultiRouteChain, MultiRouteChainInput } from "./multi_route.js";
import { BaseChain } from "../../chains/base.js";
import { LLMChainInput } from "../../chains/llm_chain.js";
import { PromptTemplate } from "../../prompts/prompt.js";
export declare class MultiPromptChain extends MultiRouteChain {
    /**
     * @deprecated Use `fromLLMAndPrompts` instead
     */
    static fromPrompts(llm: BaseLanguageModel, promptNames: string[], promptDescriptions: string[], promptTemplates: string[] | PromptTemplate[], defaultChain?: BaseChain, options?: Omit<MultiRouteChainInput, "defaultChain">): MultiPromptChain;
    static fromLLMAndPrompts(llm: BaseLanguageModel, { promptNames, promptDescriptions, promptTemplates, defaultChain, llmChainOpts, conversationChainOpts, multiRouteChainOpts, }: {
        promptNames: string[];
        promptDescriptions: string[];
        promptTemplates: string[] | PromptTemplate[];
        defaultChain?: BaseChain;
        llmChainOpts?: Omit<LLMChainInput, "llm" | "prompt">;
        conversationChainOpts?: Omit<LLMChainInput, "llm" | "outputKey">;
        multiRouteChainOpts?: Omit<MultiRouteChainInput, "defaultChain">;
    }): MultiPromptChain;
    _chainType(): string;
}
