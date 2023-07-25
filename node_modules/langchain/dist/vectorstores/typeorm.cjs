"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeORMVectorStore = exports.TypeORMVectorStoreDocument = void 0;
const typeorm_1 = require("typeorm");
const base_js_1 = require("./base.cjs");
const document_js_1 = require("../document.cjs");
const env_js_1 = require("../util/env.cjs");
class TypeORMVectorStoreDocument extends document_js_1.Document {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "embedding", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
}
exports.TypeORMVectorStoreDocument = TypeORMVectorStoreDocument;
const defaultDocumentTableName = "documents";
class TypeORMVectorStore extends base_js_1.VectorStore {
    constructor(embeddings, fields) {
        super(embeddings, fields);
        Object.defineProperty(this, "tableName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "documentEntity", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "filter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "appDataSource", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_verbose", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.tableName = fields.tableName || defaultDocumentTableName;
        this.filter = fields.filter;
        const TypeORMDocumentEntity = new typeorm_1.EntitySchema({
            name: fields.tableName ?? defaultDocumentTableName,
            columns: {
                id: {
                    generated: "uuid",
                    type: "uuid",
                    primary: true,
                },
                pageContent: {
                    type: String,
                },
                metadata: {
                    type: "jsonb",
                },
                embedding: {
                    type: String,
                },
            },
        });
        const appDataSource = new typeorm_1.DataSource({
            entities: [TypeORMDocumentEntity],
            ...fields.postgresConnectionOptions,
        });
        this.appDataSource = appDataSource;
        this.documentEntity = TypeORMDocumentEntity;
        this._verbose =
            (0, env_js_1.getEnvironmentVariable)("LANGCHAIN_VERBOSE") === "true" ??
                fields.verbose ??
                false;
    }
    static async fromDataSource(embeddings, fields) {
        const postgresqlVectorStore = new TypeORMVectorStore(embeddings, fields);
        if (!postgresqlVectorStore.appDataSource.isInitialized) {
            await postgresqlVectorStore.appDataSource.initialize();
        }
        return postgresqlVectorStore;
    }
    async addDocuments(documents) {
        const texts = documents.map(({ pageContent }) => pageContent);
        // This will create the table if it does not exist. We can call it every time as it doesn't
        // do anything if the table already exists, and it is not expensive in terms of performance
        await this.ensureTableInDatabase();
        return this.addVectors(await this.embeddings.embedDocuments(texts), documents);
    }
    async addVectors(vectors, documents) {
        const rows = vectors.map((embedding, idx) => {
            const embeddingString = `[${embedding.join(",")}]`;
            const documentRow = {
                pageContent: documents[idx].pageContent,
                embedding: embeddingString,
                metadata: documents[idx].metadata,
            };
            return documentRow;
        });
        const documentRepository = this.appDataSource.getRepository(this.documentEntity);
        const chunkSize = 500;
        for (let i = 0; i < rows.length; i += chunkSize) {
            const chunk = rows.slice(i, i + chunkSize);
            try {
                await documentRepository.save(chunk);
            }
            catch (e) {
                console.error(e);
                throw new Error(`Error inserting: ${chunk[0].pageContent}`);
            }
        }
    }
    async similaritySearchVectorWithScore(query, k, filter) {
        const embeddingString = `[${query.join(",")}]`;
        const _filter = filter ?? "{}";
        const queryString = `
      SELECT *, embedding <=> $1 as "_distance"
      FROM ${this.tableName}
      WHERE metadata @> $2
      ORDER BY "_distance" ASC
      LIMIT $3;`;
        const documents = await this.appDataSource.query(queryString, [
            embeddingString,
            _filter,
            k,
        ]);
        const results = [];
        for (const doc of documents) {
            if (doc._distance != null && doc.pageContent != null) {
                const document = new document_js_1.Document(doc);
                document.id = doc.id;
                results.push([document, doc._distance]);
            }
        }
        return results;
    }
    async ensureTableInDatabase() {
        await this.appDataSource.query("CREATE EXTENSION IF NOT EXISTS vector;");
        await this.appDataSource.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
        await this.appDataSource.query(`
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
        "pageContent" text,
        metadata jsonb,
        embedding vector
      );
    `);
    }
    static async fromTexts(texts, metadatas, embeddings, dbConfig) {
        const docs = [];
        for (let i = 0; i < texts.length; i += 1) {
            const metadata = Array.isArray(metadatas) ? metadatas[i] : metadatas;
            const newDoc = new document_js_1.Document({
                pageContent: texts[i],
                metadata,
            });
            docs.push(newDoc);
        }
        return TypeORMVectorStore.fromDocuments(docs, embeddings, dbConfig);
    }
    static async fromDocuments(docs, embeddings, dbConfig) {
        const instance = await TypeORMVectorStore.fromDataSource(embeddings, dbConfig);
        await instance.addDocuments(docs);
        return instance;
    }
    static async fromExistingIndex(embeddings, dbConfig) {
        const instance = await TypeORMVectorStore.fromDataSource(embeddings, dbConfig);
        return instance;
    }
}
exports.TypeORMVectorStore = TypeORMVectorStore;
