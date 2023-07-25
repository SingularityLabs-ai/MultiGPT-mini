import { BaseDocumentLoader } from "../base.js";
import { Document } from "../../document.js";
export interface FigmaFile {
    name: string;
    role: string;
    lastModified: string;
    editorType: string;
    thumbnailUrl: string;
    version: string;
    document: Node;
    schemaVersion: number;
    mainFileKey: string;
    branches: Array<{
        key: string;
        name: string;
        thumbnail_url: string;
        last_modified: string;
        link_access: string;
    }>;
}
export interface FigmaLoaderParams {
    accessToken?: string;
    nodeIds: string[];
    fileKey: string;
}
export declare class FigmaFileLoader extends BaseDocumentLoader implements FigmaLoaderParams {
    accessToken?: string;
    nodeIds: string[];
    fileKey: string;
    private headers;
    constructor({ accessToken, nodeIds, fileKey, }: FigmaLoaderParams);
    private constructFigmaApiURL;
    private getFigmaFile;
    load(): Promise<Document[]>;
}
