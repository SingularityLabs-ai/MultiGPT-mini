import type { Pool } from "mysql2/promise";
import { VectorStore } from "./base.js";
import { Embeddings } from "../embeddings/base.js";
import { Document } from "../document.js";
export interface SingleStoreVectorStoreConfig {
    connectionPool: Pool;
    tableName?: string;
    contentColumnName?: string;
    vectorColumnName?: string;
    metadataColumnName?: string;
}
export declare class SingleStoreVectorStore extends VectorStore {
    connectionPool: Pool;
    tableName: string;
    contentColumnName: string;
    vectorColumnName: string;
    metadataColumnName: string;
    constructor(embeddings: Embeddings, config: SingleStoreVectorStoreConfig);
    createTableIfNotExists(): Promise<void>;
    addDocuments(documents: Document[]): Promise<void>;
    addVectors(vectors: number[][], documents: Document[]): Promise<void>;
    similaritySearchVectorWithScore(query: number[], k: number, _filter?: undefined): Promise<[Document, number][]>;
    static fromTexts(texts: string[], metadatas: object[], embeddings: Embeddings, dbConfig: SingleStoreVectorStoreConfig): Promise<SingleStoreVectorStore>;
    static fromDocuments(docs: Document[], embeddings: Embeddings, dbConfig: SingleStoreVectorStoreConfig): Promise<SingleStoreVectorStore>;
}
