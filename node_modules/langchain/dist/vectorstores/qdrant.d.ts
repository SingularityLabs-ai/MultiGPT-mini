import { QdrantClient } from "@qdrant/js-client-rest";
import type { Schemas as QdrantSchemas } from "@qdrant/js-client-rest";
import { Embeddings } from "../embeddings/base.js";
import { VectorStore } from "./base.js";
import { Document } from "../document.js";
export interface QdrantLibArgs {
    client?: QdrantClient;
    url?: string;
    collectionName?: string;
    collectionConfig?: QdrantSchemas["CreateCollection"];
}
export declare class QdrantVectorStore extends VectorStore {
    client: QdrantClient;
    collectionName: string;
    collectionConfig: QdrantSchemas["CreateCollection"];
    constructor(embeddings: Embeddings, args: QdrantLibArgs);
    addDocuments(documents: Document[]): Promise<void>;
    addVectors(vectors: number[][], documents: Document[]): Promise<void>;
    similaritySearchVectorWithScore(query: number[], k?: number, filter?: QdrantSchemas["Filter"]): Promise<[Document, number][]>;
    ensureCollection(): Promise<void>;
    static fromTexts(texts: string[], metadatas: object[] | object, embeddings: Embeddings, dbConfig: QdrantLibArgs): Promise<QdrantVectorStore>;
    static fromDocuments(docs: Document[], embeddings: Embeddings, dbConfig: QdrantLibArgs): Promise<QdrantVectorStore>;
    static fromExistingCollection(embeddings: Embeddings, dbConfig: QdrantLibArgs): Promise<QdrantVectorStore>;
}
