"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TigrisVectorStore = void 0;
const uuid = __importStar(require("uuid"));
const base_js_1 = require("./base.cjs");
const document_js_1 = require("../document.cjs");
class TigrisVectorStore extends base_js_1.VectorStore {
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
            new document_js_1.Document({
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
            const newDoc = new document_js_1.Document({
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
exports.TigrisVectorStore = TigrisVectorStore;
