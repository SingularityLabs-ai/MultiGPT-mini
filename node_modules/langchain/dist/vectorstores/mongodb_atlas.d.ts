import type { Collection, Document as MongoDBDocument } from "mongodb";
import { VectorStore } from "./base.js";
import { Embeddings } from "../embeddings/base.js";
import { Document } from "../document.js";
export type MongoDBAtlasVectorSearchLibArgs = {
    collection: Collection<MongoDBDocument>;
    indexName?: string;
    textKey?: string;
    embeddingKey?: string;
};
export declare class MongoDBAtlasVectorSearch extends VectorStore {
    FilterType: MongoDBDocument;
    collection: Collection<MongoDBDocument>;
    indexName: string;
    textKey: string;
    embeddingKey: string;
    constructor(embeddings: Embeddings, args: MongoDBAtlasVectorSearchLibArgs);
    addVectors(vectors: number[][], documents: Document[]): Promise<void>;
    addDocuments(documents: Document[]): Promise<void>;
    similaritySearchVectorWithScore(query: number[], k: number, preFilter?: MongoDBDocument, postFilterPipeline?: MongoDBDocument[]): Promise<[Document, number][]>;
    similaritySearch(query: string, k: number, preFilter?: MongoDBDocument, postFilterPipeline?: MongoDBDocument[]): Promise<Document[]>;
    static fromTexts(texts: string[], metadatas: object[] | object, embeddings: Embeddings, dbConfig: MongoDBAtlasVectorSearchLibArgs): Promise<MongoDBAtlasVectorSearch>;
    static fromDocuments(docs: Document[], embeddings: Embeddings, dbConfig: MongoDBAtlasVectorSearchLibArgs): Promise<MongoDBAtlasVectorSearch>;
}
