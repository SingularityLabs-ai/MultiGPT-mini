import { ZepClient } from "@getzep/zep-js";
import { BaseRetriever } from "../schema/index.js";
import { Document } from "../document.js";
export class ZepRetriever extends BaseRetriever {
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
        this.zepClient = new ZepClient(config.url);
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
            .map(({ message: { content } = {}, ...metadata }, dist) => new Document({
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
