import * as uuid from "uuid";
import { VectorStore } from "./base.js";
import { Document } from "../document.js";
export class TigrisVectorStore extends VectorStore {
    constructor(embeddings, args) {
        super(embeddings, args);
        Object.defineProperty(this, "index", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.embeddings = embeddings;
        this.index = args.index;
    }
    async addDocuments(documents, ids) {
        const texts = documents.map(({ pageContent }) => pageContent);
        await this.addVectors(await this.embeddings.embedDocuments(texts), documents, ids);
    }
    async addVectors(vectors, documents, ids) {
        if (vectors.length === 0) {
            return;
        }
        if (vectors.length !== documents.length) {
            throw new Error(`Vectors and metadatas must have the same length`);
        }
        const documentIds = ids == null ? documents.map(() => uuid.v4()) : ids;
        await this.index?.addDocumentsWithVectors({
            ids: documentIds,
            embeddings: vectors,
            documents: documents.map(({ metadata, pageContent }) => ({
                content: pageContent,
                metadata,
            })),
        });
    }
    async similaritySearchVectorWithScore(query, k, filter) {
        const result = await this.index?.similaritySearchVectorWithScore({
            query,
            k,
            filter,
        });
        if (!result) {
            return [];
        }
        return result.map(([document, score]) => [
            new Document({
                pageContent: document.content,
                metadata: document.metadata,
            }),
            score,
        ]);
    }
    static async fromTexts(texts, metadatas, embeddings, dbConfig) {
        const docs = [];
        for (let i = 0; i < texts.length; i += 1) {
            const metadata = Array.isArray(metadatas) ? metadatas[i] : metadatas;
            const newDoc = new Document({
                pageContent: texts[i],
                metadata,
            });
            docs.push(newDoc);
        }
        return TigrisVectorStore.fromDocuments(docs, embeddings, dbConfig);
    }
    static async fromDocuments(docs, embeddings, dbConfig) {
        const instance = new this(embeddings, dbConfig);
        await instance.addDocuments(docs);
        return instance;
    }
    static async fromExistingIndex(embeddings, dbConfig) {
        const instance = new this(embeddings, dbConfig);
        return instance;
    }
}
