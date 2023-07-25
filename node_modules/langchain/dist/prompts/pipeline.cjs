"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelinePromptTemplate = void 0;
const base_js_1 = require("./base.cjs");
const chat_js_1 = require("./chat.cjs");
class PipelinePromptTemplate extends base_js_1.BasePromptTemplate {
    constructor(input) {
        super({ ...input, inputVariables: [] });
        Object.defineProperty(this, "pipelinePrompts", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "finalPrompt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.pipelinePrompts = input.pipelinePrompts;
        this.finalPrompt = input.finalPrompt;
        this.inputVariables = this.computeInputValues();
    }
    computeInputValues() {
        const intermediateValues = this.pipelinePrompts.map((pipelinePrompt) => pipelinePrompt.name);
        const inputValues = this.pipelinePrompts
            .map((pipelinePrompt) => pipelinePrompt.prompt.inputVariables.filter((inputValue) => !intermediateValues.includes(inputValue)))
            .flat();
        return [...new Set(inputValues)];
    }
    static extractRequiredInputValues(allValues, requiredValueNames) {
        return requiredValueNames.reduce((requiredValues, valueName) => {
            // eslint-disable-next-line no-param-reassign
            requiredValues[valueName] = allValues[valueName];
            return requiredValues;
        }, {});
    }
    async formatPipelinePrompts(values) {
        const allValues = await this.mergePartialAndUserVariables(values);
        for (const { name: pipelinePromptName, prompt: pipelinePrompt } of this
            .pipelinePrompts) {
            const pipelinePromptInputValues = PipelinePromptTemplate.extractRequiredInputValues(allValues, pipelinePrompt.inputVariables);
            // eslint-disable-next-line no-instanceof/no-instanceof
            if (pipelinePrompt instanceof chat_js_1.ChatPromptTemplate) {
                allValues[pipelinePromptName] = await pipelinePrompt.formatMessages(pipelinePromptInputValues);
            }
            else {
                allValues[pipelinePromptName] = await pipelinePrompt.format(pipelinePromptInputValues);
            }
        }
        return PipelinePromptTemplate.extractRequiredInputValues(allValues, this.finalPrompt.inputVariables);
    }
    async formatPromptValue(values) {
        return this.finalPrompt.formatPromptValue(await this.formatPipelinePrompts(values));
    }
    async format(values) {
        return this.finalPrompt.format(await this.formatPipelinePrompts(values));
    }
    async partial(values) {
        const promptDict = { ...this };
        promptDict.inputVariables = this.inputVariables.filter((iv) => !(iv in values));
        promptDict.partialVariables = {
            ...(this.partialVariables ?? {}),
            ...values,
        };
        return new PipelinePromptTemplate(promptDict);
    }
    serialize() {
        throw new Error("Not implemented.");
    }
    _getPromptType() {
        return "pipeline";
    }
}
exports.PipelinePromptTemplate = PipelinePromptTemplate;
