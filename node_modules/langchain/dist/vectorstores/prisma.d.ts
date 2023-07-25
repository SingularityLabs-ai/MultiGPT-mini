import { VectorStore } from "./base.js";
import { Document } from "../document.js";
import { type Embeddings } from "../embeddings/base.js";
declare const IdColumnSymbol: unique symbol;
declare const ContentColumnSymbol: unique symbol;
type ColumnSymbol = typeof IdColumnSymbol | typeof ContentColumnSymbol;
declare type Value = unknown;
declare type RawValue = Value | Sql;
declare class Sql {
    strings: string[];
    constructor(rawStrings: ReadonlyArray<string>, rawValues: ReadonlyArray<RawValue>);
}
type PrismaNamespace = {
    ModelName: Record<string, string>;
    Sql: typeof Sql;
    raw: (sql: string) => Sql;
    join: (values: RawValue[], separator?: string, prefix?: string, suffix?: string) => Sql;
    sql: (strings: ReadonlyArray<string>, ...values: RawValue[]) => Sql;
};
type PrismaClient = {
    $queryRaw<T = unknown>(query: TemplateStringsArray | Sql, ...values: any[]): Promise<T>;
    $executeRaw(query: TemplateStringsArray | Sql, ...values: any[]): Promise<any>;
    $transaction<P extends Promise<any>[]>(arg: [...P]): Promise<any>;
};
type ObjectIntersect<A, B> = {
    [P in keyof A & keyof B]: A[P] | B[P];
};
type ModelColumns<TModel extends Record<string, unknown>> = {
    [K in keyof TModel]?: true | ColumnSymbol;
};
type PrismaSqlFilter<TModel extends Record<string, unknown>> = {
    [K in keyof TModel]?: {
        equals?: TModel[K];
        lt?: TModel[K];
        lte?: TModel[K];
        gt?: TModel[K];
        gte?: TModel[K];
        not?: TModel[K];
    };
};
type SimilarityModel<TModel extends Record<string, unknown> = Record<string, unknown>, TColumns extends ModelColumns<TModel> = ModelColumns<TModel>> = Pick<TModel, keyof ObjectIntersect<TModel, TColumns>> & {
    _distance: number | null;
};
type DefaultPrismaVectorStore = PrismaVectorStore<Record<string, unknown>, string, ModelColumns<Record<string, unknown>>, PrismaSqlFilter<Record<string, unknown>>>;
export declare class PrismaVectorStore<TModel extends Record<string, unknown>, TModelName extends string, TSelectModel extends ModelColumns<TModel>, TFilterModel extends PrismaSqlFilter<TModel>> extends VectorStore {
    protected tableName: string;
    protected vectorColumnName: string;
    protected selectColumns: string[];
    filter?: TFilterModel;
    idColumn: keyof TModel & string;
    contentColumn: keyof TModel & string;
    static IdColumn: typeof IdColumnSymbol;
    static ContentColumn: typeof ContentColumnSymbol;
    protected db: PrismaClient;
    protected Prisma: PrismaNamespace;
    constructor(embeddings: Embeddings, config: {
        db: PrismaClient;
        prisma: PrismaNamespace;
        tableName: TModelName;
        vectorColumnName: string;
        columns: TSelectModel;
        filter?: TFilterModel;
    });
    static withModel<TModel extends Record<string, unknown>>(db: PrismaClient): {
        create: <TPrisma extends PrismaNamespace, TColumns extends ModelColumns<TModel>, TFilters extends PrismaSqlFilter<TModel>>(embeddings: Embeddings, config: {
            prisma: TPrisma;
            tableName: keyof TPrisma["ModelName"] & string;
            vectorColumnName: string;
            columns: TColumns;
            filter?: TFilters | undefined;
        }) => PrismaVectorStore<TModel, keyof TPrisma["ModelName"] & string, TColumns, TFilters>;
        fromTexts: <TPrisma_1 extends PrismaNamespace, TColumns_1 extends ModelColumns<TModel>>(texts: string[], metadatas: TModel[], embeddings: Embeddings, dbConfig: {
            prisma: TPrisma_1;
            tableName: keyof TPrisma_1["ModelName"] & string;
            vectorColumnName: string;
            columns: TColumns_1;
        }) => Promise<DefaultPrismaVectorStore>;
        fromDocuments: <TPrisma_2 extends PrismaNamespace, TColumns_2 extends ModelColumns<TModel>, TFilters_1 extends PrismaSqlFilter<TModel>>(docs: Document<TModel>[], embeddings: Embeddings, dbConfig: {
            prisma: TPrisma_2;
            tableName: keyof TPrisma_2["ModelName"] & string;
            vectorColumnName: string;
            columns: TColumns_2;
        }) => Promise<PrismaVectorStore<TModel, keyof TPrisma_2["ModelName"] & string, TColumns_2, TFilters_1>>;
    };
    addModels(models: TModel[]): Promise<void>;
    addDocuments(documents: Document<TModel>[]): Promise<void>;
    addVectors(vectors: number[][], documents: Document<TModel>[]): Promise<void>;
    similaritySearch(query: string, k?: number): Promise<Document<SimilarityModel<TModel, TSelectModel>>[]>;
    similaritySearchWithScore(query: string, k?: number, filter?: TFilterModel): Promise<[Document<Record<string, any>>, number][]>;
    similaritySearchVectorWithScore(query: number[], k: number, filter?: TFilterModel): Promise<[Document<SimilarityModel<TModel, TSelectModel>>, number][]>;
    buildSqlFilterStr(filter?: TFilterModel): Sql | null;
    static fromTexts(texts: string[], metadatas: object[], embeddings: Embeddings, dbConfig: {
        db: PrismaClient;
        prisma: PrismaNamespace;
        tableName: string;
        vectorColumnName: string;
        columns: ModelColumns<Record<string, unknown>>;
    }): Promise<DefaultPrismaVectorStore>;
    static fromDocuments(docs: Document[], embeddings: Embeddings, dbConfig: {
        db: PrismaClient;
        prisma: PrismaNamespace;
        tableName: string;
        vectorColumnName: string;
        columns: ModelColumns<Record<string, unknown>>;
    }): Promise<DefaultPrismaVectorStore>;
}
export {};
