import type { IndexFlatL2 } from "faiss-node";
import type { NameRegistry, Parser } from "pickleparser";
import { Embeddings } from "../embeddings/base.js";
import { SaveableVectorStore } from "./base.js";
import { Document } from "../document.js";
import { InMemoryDocstore } from "../docstore/index.js";
export interface FaissLibArgs {
    docstore?: InMemoryDocstore;
    index?: IndexFlatL2;
    mapping?: Record<number, string>;
}
export declare class FaissStore extends SaveableVectorStore {
    _index?: IndexFlatL2;
    _mapping: Record<number, string>;
    docstore: InMemoryDocstore;
    args: FaissLibArgs;
    constructor(embeddings: Embeddings, args: FaissLibArgs);
    addDocuments(documents: Document[]): Promise<void>;
    get index(): IndexFlatL2;
    private set index(value);
    addVectors(vectors: number[][], documents: Document[]): Promise<void>;
    similaritySearchVectorWithScore(query: number[], k: number): Promise<[Document<Record<string, any>>, number][]>;
    save(directory: string): Promise<void>;
    static load(directory: string, embeddings: Embeddings): Promise<FaissStore>;
    static loadFromPython(directory: string, embeddings: Embeddings): Promise<FaissStore>;
    static fromTexts(texts: string[], metadatas: object[] | object, embeddings: Embeddings, dbConfig?: {
        docstore?: InMemoryDocstore;
    }): Promise<FaissStore>;
    static fromDocuments(docs: Document[], embeddings: Embeddings, dbConfig?: {
        docstore?: InMemoryDocstore;
    }): Promise<FaissStore>;
    static importFaiss(): Promise<{
        IndexFlatL2: typeof IndexFlatL2;
    }>;
    static importPickleparser(): Promise<{
        Parser: typeof Parser;
        NameRegistry: typeof NameRegistry;
    }>;
}
