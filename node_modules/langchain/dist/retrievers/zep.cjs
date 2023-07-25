"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZepRetriever = void 0;
const zep_js_1 = require("@getzep/zep-js");
const index_js_1 = require("../schema/index.cjs");
const document_js_1 = require("../document.cjs");
class ZepRetriever extends index_js_1.BaseRetriever {
    constructor(config) {
        super();
        Object.defineProperty(this, "zepClient", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "sessionId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "topK", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.zepClient = new zep_js_1.ZepClient(config.url);
        this.sessionId = config.sessionId;
        this.topK = config.topK;
    }
    /**
     *  Converts an array of search results to an array of Document objects.
     *  @param {SearchResult[]} results - The array of search results.
     *  @returns {Document[]} An array of Document objects representing the search results.
     */
    searchResultToDoc(results) {
        return results
            .filter((r) => r.message)
            .map(({ message: { content } = {}, ...metadata }, dist) => new document_js_1.Document({
            pageContent: content ?? "",
            metadata: { score: dist, ...metadata },
        }));
    }
    /**
     *  Retrieves the relevant documents based on the given query.
     *  @param {string} query - The query string.
     *  @returns {Promise<Document[]>} A promise that resolves to an array of relevant Document objects.
     */
    async getRelevantDocuments(query) {
        const payload = { text: query, meta: {} };
        const results = await this.zepClient.searchMemory(this.sessionId, payload, this.topK);
        return this.searchResultToDoc(results);
    }
}
exports.ZepRetriever = ZepRetriever;
