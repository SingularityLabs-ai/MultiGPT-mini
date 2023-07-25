import { InputValues, PartialValues } from "../schema/index.js";
import { BasePromptTemplate, BasePromptTemplateInput } from "./base.js";
import { SerializedBasePromptTemplate } from "./serde.js";
export type PipelinePromptParams<PromptTemplateType extends BasePromptTemplate> = {
    name: string;
    prompt: PromptTemplateType;
};
export type PipelinePromptTemplateInput<PromptTemplateType extends BasePromptTemplate> = Omit<BasePromptTemplateInput, "inputVariables"> & {
    pipelinePrompts: PipelinePromptParams<PromptTemplateType>[];
    finalPrompt: PromptTemplateType;
};
export declare class PipelinePromptTemplate<PromptTemplateType extends BasePromptTemplate> extends BasePromptTemplate {
    pipelinePrompts: PipelinePromptParams<PromptTemplateType>[];
    finalPrompt: PromptTemplateType;
    constructor(input: PipelinePromptTemplateInput<PromptTemplateType>);
    protected computeInputValues(): string[];
    protected static extractRequiredInputValues(allValues: InputValues, requiredValueNames: string[]): InputValues;
    protected formatPipelinePrompts(values: InputValues): Promise<InputValues>;
    formatPromptValue(values: InputValues): Promise<PromptTemplateType["PromptValueReturnType"]>;
    format(values: InputValues): Promise<string>;
    partial(values: PartialValues): Promise<PipelinePromptTemplate<PromptTemplateType>>;
    serialize(): SerializedBasePromptTemplate;
    _getPromptType(): string;
}
