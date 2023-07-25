import Metal from "@getmetal/metal-sdk";
import { BaseRetriever } from "../schema/index.js";
import { Document } from "../document.js";
export interface MetalRetrieverFields {
    client: Metal;
}
export declare class MetalRetriever extends BaseRetriever {
    private client;
    constructor(fields: MetalRetrieverFields);
    getRelevantDocuments(query: string): Promise<Document[]>;
}
