import { loadQueryConstructorChain, } from "../../chains/query_constructor/index.js";
import { BaseRetriever } from "../../schema/index.js";
import { FunctionalTranslator } from "./functional.js";
import { BaseTranslator, BasicTranslator } from "./base.js";
export { BaseTranslator, BasicTranslator, FunctionalTranslator };
export class SelfQueryRetriever extends BaseRetriever {
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
        const llmChain = loadQueryConstructorChain({
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
