import { Metadata } from "@opensearch-project/opensearch/api/types.js";
import { DataSource, DataSourceOptions, EntitySchema } from "typeorm";
import { VectorStore } from "./base.js";
import { Embeddings } from "../embeddings/base.js";
import { Document } from "../document.js";
export interface TypeORMVectorStoreArgs {
    postgresConnectionOptions: DataSourceOptions;
    tableName?: string;
    filter?: Metadata;
    verbose?: boolean;
}
export declare class TypeORMVectorStoreDocument extends Document {
    embedding: string;
    id?: string;
}
export declare class TypeORMVectorStore extends VectorStore {
    FilterType: Metadata;
    tableName: string;
    documentEntity: EntitySchema;
    filter?: Metadata;
    appDataSource: DataSource;
    _verbose?: boolean;
    private constructor();
    static fromDataSource(embeddings: Embeddings, fields: TypeORMVectorStoreArgs): Promise<TypeORMVectorStore>;
    addDocuments(documents: Document[]): Promise<void>;
    addVectors(vectors: number[][], documents: Document[]): Promise<void>;
    similaritySearchVectorWithScore(query: number[], k: number, filter?: this["FilterType"]): Promise<[TypeORMVectorStoreDocument, number][]>;
    ensureTableInDatabase(): Promise<void>;
    static fromTexts(texts: string[], metadatas: object[] | object, embeddings: Embeddings, dbConfig: TypeORMVectorStoreArgs): Promise<TypeORMVectorStore>;
    static fromDocuments(docs: Document[], embeddings: Embeddings, dbConfig: TypeORMVectorStoreArgs): Promise<TypeORMVectorStore>;
    static fromExistingIndex(embeddings: Embeddings, dbConfig: TypeORMVectorStoreArgs): Promise<TypeORMVectorStore>;
}
