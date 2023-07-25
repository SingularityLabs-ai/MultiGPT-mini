import { VectorStore } from "./base.js";
import { Document } from "../document.js";
const IdColumnSymbol = Symbol("id");
const ContentColumnSymbol = Symbol("content");
const OpMap = {
    equals: "=",
    lt: "<",
    lte: "<=",
    gt: ">",
    gte: ">=",
    not: "<>",
};
class PrismaVectorStore extends VectorStore {
    constructor(embeddings, config) {
        super(embeddings, {});
        Object.defineProperty(this, "tableName", {
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
        Object.defineProperty(this, "selectColumns", {
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
        Object.defineProperty(this, "idColumn", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "contentColumn", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "db", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "Prisma", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.Prisma = config.prisma;
        this.db = config.db;
        const entries = Object.entries(config.columns);
        const idColumn = entries.find((i) => i[1] === IdColumnSymbol)?.[0];
        const contentColumn = entries.find((i) => i[1] === ContentColumnSymbol)?.[0];
        if (idColumn == null)
            throw new Error("Missing ID column");
        if (contentColumn == null)
            throw new Error("Missing content column");
        this.idColumn = idColumn;
        this.contentColumn = contentColumn;
        this.tableName = config.tableName;
        this.vectorColumnName = config.vectorColumnName;
        this.selectColumns = entries
            .map(([key, alias]) => (alias && key) || null)
            .filter((x) => !!x);
        if (config.filter) {
            this.filter = config.filter;
        }
    }
    static withModel(db) {
        function create(embeddings, config) {
            return new PrismaVectorStore(embeddings, { ...config, db });
        }
        async function fromTexts(texts, metadatas, embeddings, dbConfig) {
            const docs = [];
            for (let i = 0; i < texts.length; i += 1) {
                const metadata = Array.isArray(metadatas) ? metadatas[i] : metadatas;
                const newDoc = new Document({
                    pageContent: texts[i],
                    metadata,
                });
                docs.push(newDoc);
            }
            return PrismaVectorStore.fromDocuments(docs, embeddings, {
                ...dbConfig,
                db,
            });
        }
        async function fromDocuments(docs, embeddings, dbConfig) {
            const instance = new PrismaVectorStore(embeddings, { ...dbConfig, db });
            await instance.addDocuments(docs);
            return instance;
        }
        return { create, fromTexts, fromDocuments };
    }
    async addModels(models) {
        return this.addDocuments(models.map((metadata) => {
            const pageContent = metadata[this.contentColumn];
            if (typeof pageContent !== "string")
                throw new Error("Content column must be a string");
            return new Document({ pageContent, metadata });
        }));
    }
    async addDocuments(documents) {
        const texts = documents.map(({ pageContent }) => pageContent);
        return this.addVectors(await this.embeddings.embedDocuments(texts), documents);
    }
    async addVectors(vectors, documents) {
        // table name, column name cannot be parametrised
        // these fields are thus not escaped by Prisma and can be dangerous if user input is used
        const idColumnRaw = this.Prisma.raw(`"${this.idColumn}"`);
        const tableNameRaw = this.Prisma.raw(`"${this.tableName}"`);
        const vectorColumnRaw = this.Prisma.raw(`"${this.vectorColumnName}"`);
        await this.db.$transaction(vectors.map((vector, idx) => this.db.$executeRaw `
          UPDATE ${tableNameRaw}
          SET ${vectorColumnRaw} = ${`[${vector.join(",")}]`}::vector
          WHERE ${idColumnRaw} = ${documents[idx].metadata[this.idColumn]}
        `));
    }
    async similaritySearch(query, k = 4) {
        const results = await this.similaritySearchVectorWithScore(await this.embeddings.embedQuery(query), k);
        return results.map((result) => result[0]);
    }
    async similaritySearchWithScore(query, k, filter) {
        return super.similaritySearchWithScore(query, k, filter);
    }
    async similaritySearchVectorWithScore(query, k, filter) {
        // table name, column names cannot be parametrised
        // these fields are thus not escaped by Prisma and can be dangerous if user input is used
        const vectorColumnRaw = this.Prisma.raw(`"${this.vectorColumnName}"`);
        const tableNameRaw = this.Prisma.raw(`"${this.tableName}"`);
        const selectRaw = this.Prisma.raw(this.selectColumns.map((x) => `"${x}"`).join(", "));
        const vector = `[${query.join(",")}]`;
        const articles = await this.db.$queryRaw(this.Prisma.join([
            this.Prisma.sql `
            SELECT ${selectRaw}, ${vectorColumnRaw} <=> ${vector}::vector as "_distance"
            FROM ${tableNameRaw}
          `,
            this.buildSqlFilterStr(filter ?? this.filter),
            this.Prisma.sql `
            ORDER BY "_distance" ASC
            LIMIT ${k};
          `,
        ].filter((x) => x != null), ""));
        const results = [];
        for (const article of articles) {
            if (article._distance != null && article[this.contentColumn] != null) {
                results.push([
                    new Document({
                        pageContent: article[this.contentColumn],
                        metadata: article,
                    }),
                    article._distance,
                ]);
            }
        }
        return results;
    }
    buildSqlFilterStr(filter) {
        if (filter == null)
            return null;
        return this.Prisma.join(Object.entries(filter).flatMap(([key, ops]) => Object.entries(ops).map(([opName, value]) => {
            // column name, operators cannot be parametrised
            // these fields are thus not escaped by Prisma and can be dangerous if user input is used
            const colRaw = this.Prisma.raw(`"${key}"`);
            const opRaw = this.Prisma.raw(OpMap[opName]);
            return this.Prisma.sql `${colRaw} ${opRaw} ${value}`;
        })), " AND ", " WHERE ");
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
        return PrismaVectorStore.fromDocuments(docs, embeddings, dbConfig);
    }
    static async fromDocuments(docs, embeddings, dbConfig) {
        const instance = new PrismaVectorStore(embeddings, dbConfig);
        await instance.addDocuments(docs);
        return instance;
    }
}
Object.defineProperty(PrismaVectorStore, "IdColumn", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: IdColumnSymbol
});
Object.defineProperty(PrismaVectorStore, "ContentColumn", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: ContentColumnSymbol
});
export { PrismaVectorStore };
