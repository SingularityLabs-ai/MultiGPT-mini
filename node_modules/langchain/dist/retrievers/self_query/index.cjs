"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelfQueryRetriever = exports.FunctionalTranslator = exports.BasicTranslator = exports.BaseTranslator = void 0;
const index_js_1 = require("../../chains/query_constructor/index.cjs");
const index_js_2 = require("../../schema/index.cjs");
const functional_js_1 = require("./functional.cjs");
Object.defineProperty(exports, "FunctionalTranslator", { enumerable: true, get: function () { return functional_js_1.FunctionalTranslator; } });
const base_js_1 = require("./base.cjs");
Object.defineProperty(exports, "BaseTranslator", { enumerable: true, get: function () { return base_js_1.BaseTranslator; } });
Object.defineProperty(exports, "BasicTranslator", { enumerable: true, get: function () { return base_js_1.BasicTranslator; } });
class SelfQueryRetriever extends index_js_2.BaseRetriever {
    constructor(options) {
        super();
        Object.defineProperty(this, "vectorStore", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "llmChain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "verbose", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "structuredQueryTranslator", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "searchParams", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: { k: 4 }
        });
        this.vectorStore = options.vectorStore;
        this.llmChain = options.llmChain;
        this.verbose = options.verbose ?? false;
        this.searchParams = options.searchParams ?? this.searchParams;
        this.structuredQueryTranslator = options.structuredQueryTranslator;
    }
    async getRelevantDocuments(query) {
        const { [this.llmChain.outputKey]: output } = await this.llmChain.call({
            [this.llmChain.inputKeys[0]]: query,
        });
        const nextArg = this.structuredQueryTranslator.visitStructuredQuery(output);
        if (nextArg.filter) {
            return this.vectorStore.similaritySearch(query, this.searchParams?.k, nextArg.filter);
        }
        else {
            return this.vectorStore.similaritySearch(query, this.searchParams?.k, this.searchParams?.filter);
        }
    }
    static fromLLM(options) {
        const { structuredQueryTranslator, allowedComparators, allowedOperators, llm, documentContents, attributeInfo, examples, vectorStore, ...rest } = options;
        const llmChain = (0, index_js_1.loadQueryConstructorChain)({
            llm,
            documentContents,
            attributeInfo,
            examples,
            allowedComparators: allowedComparators ?? structuredQueryTranslator.allowedComparators,
            allowedOperators: allowedOperators ?? structuredQueryTranslator.allowedOperators,
        });
        return new SelfQueryRetriever({
            ...rest,
            llmChain,
            vectorStore,
            structuredQueryTranslator,
        });
    }
}
exports.SelfQueryRetriever = SelfQueryRetriever;
