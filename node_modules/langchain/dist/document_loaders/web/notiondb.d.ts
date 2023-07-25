import { BaseDocumentLoader } from "../base.js";
import { Document } from "../../document.js";
export interface NotionDBLoaderParams {
    databaseId: string;
    notionIntegrationToken?: string;
    notionApiVersion?: string;
    pageSizeLimit?: number;
}
export declare class NotionDBLoader extends BaseDocumentLoader implements NotionDBLoaderParams {
    integrationToken: string;
    databaseId: string;
    notionApiVersion: string;
    pageSizeLimit: number;
    private headers;
    constructor({ databaseId, notionApiVersion, notionIntegrationToken, pageSizeLimit, }: NotionDBLoaderParams);
    load(): Promise<Document[]>;
    private retrievePageIds;
    private loadPage;
    private loadBlocks;
}
