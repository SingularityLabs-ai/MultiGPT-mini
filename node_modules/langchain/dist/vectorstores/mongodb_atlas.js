import { VectorStore } from "./base.js";
import { Document } from "../document.js";
export class MongoDBAtlasVectorSearch extends VectorStore {
    constructor(embeddings, args) {
        super(embeddings, args);
        Object.defineProperty(this, "collection", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "indexName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "textKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "embeddingKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.collection = args.collection;
        this.indexName = args.indexName || "default";
        this.textKey = args.textKey || "text";
        this.embeddingKey = args.embeddingKey || "embedding";
    }
    async addVectors(vectors, documents) {
        const docs = vectors.map((embedding, idx) => ({
            [this.textKey]: documents[idx].pageContent,
            [this.embeddingKey]: embedding,
            ...documents[idx].metadata,
        }));
        await this.collection.insertMany(docs);
    }
    async addDocuments(documents) {
        const texts = documents.map(({ pageContent }) => pageContent);
        return this.addVectors(await this.embeddings.embedDocuments(texts), documents);
    }
    async similaritySearchVectorWithScore(query, k, preFilter, postFilterPipeline) {
        const knnBeta = {
            vector: query,
            path: this.embeddingKey,
            k,
        };
        if (preFilter) {
            knnBeta.filter = preFilter;
        }
        const pipeline = [
            {
                $search: {
                    index: this.indexName,
                    knnBeta,
                },
            },
            {
                $project: {
                    [this.embeddingKey]: 0,
                    score: { $meta: "searchScore" },
                },
            },
        ];
        if (postFilterPipeline) {
            pipeline.push(...postFilterPipeline);
        }
        const results = this.collection.aggregate(pipeline);
        const ret = [];
        for await (const result of results) {
            const text = result[this.textKey];
            delete result[this.textKey];
            const { score, ...metadata } = result;
            ret.push([new Document({ pageContent: text, metadata }), score]);
        }
        return ret;
    }
    async similaritySearch(query, k, preFilter, postFilterPipeline) {
        const results = await this.similaritySearchVectorWithScore(await this.embeddings.embedQuery(query), k, preFilter, postFilterPipeline);
        return results.map((result) => result[0]);
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
        return MongoDBAtlasVectorSearch.fromDocuments(docs, embeddings, dbConfig);
    }
    static async fromDocuments(docs, embeddings, dbConfig) {
        const instance = new this(embeddings, dbConfig);
        await instance.addDocuments(docs);
        return instance;
    }
}
