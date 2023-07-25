import { BaseChain, ChainInputs } from "../base.js";
import { SerializedAPIChain } from "../serde.js";
import { LLMChain } from "../llm_chain.js";
import { BaseLanguageModel } from "../../base_language/index.js";
import { CallbackManagerForChainRun } from "../../callbacks/manager.js";
import { ChainValues } from "../../schema/index.js";
import { BasePromptTemplate } from "../../index.js";
export interface APIChainInput extends Omit<ChainInputs, "memory"> {
    apiAnswerChain: LLMChain;
    apiRequestChain: LLMChain;
    apiDocs: string;
    inputKey?: string;
    headers?: Record<string, string>;
    /** Key to use for output, defaults to `output` */
    outputKey?: string;
}
export type APIChainOptions = {
    headers?: Record<string, string>;
    apiUrlPrompt?: BasePromptTemplate;
    apiResponsePrompt?: BasePromptTemplate;
};
export declare class APIChain extends BaseChain implements APIChainInput {
    apiAnswerChain: LLMChain;
    apiRequestChain: LLMChain;
    apiDocs: string;
    headers: {};
    inputKey: string;
    outputKey: string;
    get inputKeys(): string[];
    get outputKeys(): string[];
    constructor(fields: APIChainInput);
    /** @ignore */
    _call(values: ChainValues, runManager?: CallbackManagerForChainRun): Promise<ChainValues>;
    _chainType(): "api_chain";
    static deserialize(data: SerializedAPIChain): Promise<APIChain>;
    serialize(): SerializedAPIChain;
    static fromLLMAndAPIDocs(llm: BaseLanguageModel, apiDocs: string, options?: APIChainOptions & Omit<APIChainInput, "apiAnswerChain" | "apiRequestChain" | "apiDocs">): APIChain;
}
