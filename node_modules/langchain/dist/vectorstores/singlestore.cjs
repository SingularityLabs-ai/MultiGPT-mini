"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleStoreVectorStore = void 0;
const mysql2_1 = require("mysql2");
const base_js_1 = require("./base.cjs");
const document_js_1 = require("../document.cjs");
class SingleStoreVectorStore extends base_js_1.VectorStore {
    constructor(embeddings, config) {
        super(embeddings, config);
        Object.defineProperty(this, "connectionPool", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "tableName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "contentColumnName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "vectorColumnName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "metadataColumnName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.connectionPool = config.connectionPool;
        this.tableName = config.tableName ?? "embeddings";
        this.contentColumnName = config.contentColumnName ?? "content";
        this.vectorColumnName = config.vectorColumnName ?? "vector";
        this.metadataColumnName = config.metadataColumnName ?? "metadata";
    }
    async createTableIfNotExists() {
        await this.connectionPool
            .execute(`CREATE TABLE IF NOT EXISTS ${this.tableName} (
      ${this.contentColumnName} TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
      ${this.vectorColumnName} BLOB,
      ${this.metadataColumnName} JSON);`);
    }
    async addDocuments(documents) {
        const texts = documents.map(({ pageContent }) => pageContent);
        const vectors = await this.embeddings.embedDocuments(texts);
        return this.addVectors(vectors, documents);
    }
    async addVectors(vectors, documents) {
        await this.createTableIfNotExists();
        const { tableName } = this;
        await Promise.all(vectors.map(async (vector, idx) => {
            try {
                await this.connectionPool.execute((0, mysql2_1.format)(`INSERT INTO ${tableName} VALUES (?, JSON_ARRAY_PACK('[?]'), ?);`, [
                    documents[idx].pageContent,
                    vector,
                    JSON.stringify(documents[idx].metadata),
                ]));
            }
            catch (error) {
                console.error(`Error adding vector at index ${idx}:`, error);
            }
        }));
    }
    async similaritySearchVectorWithScore(query, k, _filter) {
        // use vector DOT_PRODUCT as a distance function
        const [rows] = await this.connectionPool.query((0, mysql2_1.format)(`SELECT ${this.contentColumnName},
      ${this.metadataColumnName},
      DOT_PRODUCT(${this.vectorColumnName}, JSON_ARRAY_PACK('[?]')) as __score FROM ${this.tableName}
      ORDER BY __score DESC LIMIT ?;`, [query, k]));
        const result = [];
        for (const row of rows) {
            const rowData = row;
            result.push([
                new document_js_1.Document({
                    pageContent: rowData[this.contentColumnName],
                    metadata: rowData[this.metadataColumnName],
                }),
                Number(rowData.score),
            ]);
        }
        return result;
    }
    static async fromTexts(texts, metadatas, embeddings, dbConfig) {
        const docs = texts.map((text, idx) => {
            const metadata = Array.isArray(metadatas) ? metadatas[idx] : metadatas;
            return new document_js_1.Document({
                pageContent: text,
                metadata,
            });
        });
        return SingleStoreVectorStore.fromDocuments(docs, embeddings, dbConfig);
    }
    static async fromDocuments(docs, embeddings, dbConfig) {
        const instance = new this(embeddings, dbConfig);
        await instance.addDocuments(docs);
        return instance;
    }
}
exports.SingleStoreVectorStore = SingleStoreVectorStore;
