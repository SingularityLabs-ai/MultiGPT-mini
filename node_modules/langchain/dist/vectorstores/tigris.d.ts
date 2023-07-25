import type { VectorDocumentStore as VectorDocumentStoreT } from "@tigrisdata/vector";
import { Embeddings } from "../embeddings/base.js";
import { VectorStore } from "./base.js";
import { Document } from "../document.js";
export type TigrisLibArgs = {
    index: VectorDocumentStoreT;
};
export declare class TigrisVectorStore extends VectorStore {
    index?: VectorDocumentStoreT;
    constructor(embeddings: Embeddings, args: TigrisLibArgs);
    addDocuments(documents: Document[], ids?: string[]): Promise<void>;
    addVectors(vectors: number[][], documents: Document[], ids?: string[]): Promise<void>;
    similaritySearchVectorWithScore(query: number[], k: number, filter?: object): Promise<[Document<Record<string, any>>, number][]>;
    static fromTexts(texts: string[], metadatas: object[] | object, embeddings: Embeddings, dbConfig: TigrisLibArgs): Promise<TigrisVectorStore>;
    static fromDocuments(docs: Document[], embeddings: Embeddings, dbConfig: TigrisLibArgs): Promise<TigrisVectorStore>;
    static fromExistingIndex(embeddings: Embeddings, dbConfig: TigrisLibArgs): Promise<TigrisVectorStore>;
}
