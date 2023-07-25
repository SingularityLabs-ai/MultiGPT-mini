import { BaseRetriever } from "../schema/index.js";
import { Document } from "../document.js";
export type ZepRetrieverConfig = {
    sessionId: string;
    url: string;
    topK?: number;
};
export declare class ZepRetriever extends BaseRetriever {
    private zepClient;
    private sessionId;
    private topK?;
    constructor(config: ZepRetrieverConfig);
    /**
     *  Converts an array of search results to an array of Document objects.
     *  @param {SearchResult[]} results - The array of search results.
     *  @returns {Document[]} An array of Document objects representing the search results.
     */
    private searchResultToDoc;
    /**
     *  Retrieves the relevant documents based on the given query.
     *  @param {string} query - The query string.
     *  @returns {Promise<Document[]>} A promise that resolves to an array of relevant Document objects.
     */
    getRelevantDocuments(query: string): Promise<Document[]>;
}
