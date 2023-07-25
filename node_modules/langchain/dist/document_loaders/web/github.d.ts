import { Ignore } from "ignore";
import { Document } from "../../document.js";
import { BaseDocumentLoader } from "../base.js";
import { UnknownHandling } from "../fs/directory.js";
export interface GithubRepoLoaderParams {
    branch?: string;
    recursive?: boolean;
    unknown?: UnknownHandling;
    accessToken?: string;
    ignoreFiles?: (string | RegExp)[];
    ignorePaths?: string[];
}
export declare class GithubRepoLoader extends BaseDocumentLoader implements GithubRepoLoaderParams {
    private readonly owner;
    private readonly repo;
    private readonly initialPath;
    private headers;
    branch: string;
    recursive: boolean;
    unknown: UnknownHandling;
    accessToken?: string;
    ignoreFiles: (string | RegExp)[];
    ignore?: Ignore;
    constructor(githubUrl: string, { accessToken, branch, recursive, unknown, ignoreFiles, ignorePaths, }?: GithubRepoLoaderParams);
    private extractOwnerAndRepoAndPath;
    load(): Promise<Document[]>;
    protected shouldIgnore(path: string, fileType: string): Promise<boolean>;
    private processDirectory;
    private fetchRepoFiles;
    private fetchFileContent;
    private handleError;
}
