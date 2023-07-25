import { BaseChatModel } from "../../chat_models/base.js";
import { BasePromptTemplate } from "../base.js";
import { BaseLanguageModel } from "../../base_language/index.js";
import { BaseLLM } from "../../llms/base.js";
import { PartialValues } from "../../schema/index.js";
export type BaseGetPromptAsyncOptions = {
    partialVariables?: PartialValues;
};
export declare abstract class BasePromptSelector {
    abstract getPrompt(llm: BaseLanguageModel): BasePromptTemplate;
    getPromptAsync(llm: BaseLanguageModel, options?: BaseGetPromptAsyncOptions): Promise<BasePromptTemplate>;
}
export declare class ConditionalPromptSelector extends BasePromptSelector {
    defaultPrompt: BasePromptTemplate;
    conditionals: Array<[
        condition: (llm: BaseLanguageModel) => boolean,
        prompt: BasePromptTemplate
    ]>;
    constructor(default_prompt: BasePromptTemplate, conditionals?: Array<[
        condition: (llm: BaseLanguageModel) => boolean,
        prompt: BasePromptTemplate
    ]>);
    getPrompt(llm: BaseLanguageModel): BasePromptTemplate;
}
export declare function isLLM(llm: BaseLanguageModel): llm is BaseLLM;
export declare function isChatModel(llm: BaseLanguageModel): llm is BaseChatModel;
