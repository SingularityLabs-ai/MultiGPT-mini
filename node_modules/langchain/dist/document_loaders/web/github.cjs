"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubRepoLoader = void 0;
const ignore_1 = __importDefault(require("ignore"));
const binary_extensions_1 = __importDefault(require("binary-extensions"));
const document_js_1 = require("../../document.cjs");
const base_js_1 = require("../base.cjs");
const directory_js_1 = require("../fs/directory.cjs");
const extname_js_1 = require("../../util/extname.cjs");
const env_js_1 = require("../../util/env.cjs");
const extensions = new Set(binary_extensions_1.default);
function isBinaryPath(name) {
    return extensions.has((0, extname_js_1.extname)(name).slice(1).toLowerCase());
}
class GithubRepoLoader extends base_js_1.BaseDocumentLoader {
    constructor(githubUrl, { accessToken = (0, env_js_1.getEnvironmentVariable)("GITHUB_ACCESS_TOKEN"), branch = "main", recursive = true, unknown = directory_js_1.UnknownHandling.Warn, ignoreFiles = [], ignorePaths, } = {}) {
        super();
        Object.defineProperty(this, "owner", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "repo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "initialPath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "headers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "branch", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "recursive", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "unknown", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "accessToken", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "ignoreFiles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "ignore", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        const { owner, repo, path } = this.extractOwnerAndRepoAndPath(githubUrl);
        this.owner = owner;
        this.repo = repo;
        this.initialPath = path;
        this.branch = branch;
        this.recursive = recursive;
        this.unknown = unknown;
        this.accessToken = accessToken;
        this.ignoreFiles = ignoreFiles;
        if (ignorePaths) {
            this.ignore = ignore_1.default.default().add(ignorePaths);
        }
        if (this.accessToken) {
            this.headers = {
                Authorization: `Bearer ${this.accessToken}`,
            };
        }
    }
    extractOwnerAndRepoAndPath(url) {
        const match = url.match(/https:\/\/github.com\/([^/]+)\/([^/]+)(\/tree\/[^/]+\/(.+))?/i);
        if (!match) {
            throw new Error("Invalid GitHub URL format.");
        }
        return { owner: match[1], repo: match[2], path: match[4] || "" };
    }
    async load() {
        const documents = [];
        await this.processDirectory(this.initialPath, documents);
        return documents;
    }
    async shouldIgnore(path, fileType) {
        if (fileType !== "dir" && isBinaryPath(path)) {
            return true;
        }
        if (this.ignore !== undefined) {
            return this.ignore.ignores(path);
        }
        return (fileType !== "dir" &&
            this.ignoreFiles.some((pattern) => {
                if (typeof pattern === "string") {
                    return path === pattern;
                }
                try {
                    return pattern.test(path);
                }
                catch {
                    throw new Error(`Unknown ignore file pattern: ${pattern}`);
                }
            }));
    }
    async processDirectory(path, documents) {
        try {
            const files = await this.fetchRepoFiles(path);
            for (const file of files) {
                if (!(await this.shouldIgnore(file.path, file.type))) {
                    if (file.type !== "dir") {
                        try {
                            const fileContent = await this.fetchFileContent(file);
                            const metadata = { source: file.path };
                            documents.push(new document_js_1.Document({ pageContent: fileContent, metadata }));
                        }
                        catch (e) {
                            this.handleError(`Failed to fetch file content: ${file.path}, ${e}`);
                        }
                    }
                    else if (this.recursive) {
                        await this.processDirectory(file.path, documents);
                    }
                }
            }
        }
        catch (error) {
            this.handleError(`Failed to process directory: ${path}, ${error}`);
        }
    }
    async fetchRepoFiles(path) {
        const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}?ref=${this.branch}`;
        const response = await fetch(url, { headers: this.headers });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(`Unable to fetch repository files: ${response.status} ${JSON.stringify(data)}`);
        }
        if (!Array.isArray(data)) {
            throw new Error("Unable to fetch repository files.");
        }
        return data;
    }
    async fetchFileContent(file) {
        const response = await fetch(file.download_url, { headers: this.headers });
        return response.text();
    }
    handleError(message) {
        switch (this.unknown) {
            case directory_js_1.UnknownHandling.Ignore:
                break;
            case directory_js_1.UnknownHandling.Warn:
                console.warn(message);
                break;
            case directory_js_1.UnknownHandling.Error:
                throw new Error(message);
            default:
                throw new Error(`Unknown unknown handling: ${this.unknown}`);
        }
    }
}
exports.GithubRepoLoader = GithubRepoLoader;
