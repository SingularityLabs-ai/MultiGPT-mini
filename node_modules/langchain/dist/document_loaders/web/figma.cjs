"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FigmaFileLoader = void 0;
const base_js_1 = require("../base.cjs");
const document_js_1 = require("../../document.cjs");
const env_js_1 = require("../../util/env.cjs");
class FigmaFileLoader extends base_js_1.BaseDocumentLoader {
    constructor({ accessToken = (0, env_js_1.getEnvironmentVariable)("FIGMA_ACCESS_TOKEN"), nodeIds, fileKey, }) {
        super();
        Object.defineProperty(this, "accessToken", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "nodeIds", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fileKey", {
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
        this.accessToken = accessToken;
        this.nodeIds = nodeIds;
        this.fileKey = fileKey;
        if (this.accessToken) {
            this.headers = {
                "x-figma-token": this.accessToken,
            };
        }
    }
    constructFigmaApiURL() {
        return `https://api.figma.com/v1/files/${this.fileKey}/nodes?ids=${this.nodeIds.join(",")}`;
    }
    async getFigmaFile() {
        const url = this.constructFigmaApiURL();
        const response = await fetch(url, { headers: this.headers });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(`Unable to get figma file: ${response.status} ${JSON.stringify(data)}`);
        }
        if (!data) {
            throw new Error("Unable to get file");
        }
        return data;
    }
    async load() {
        const data = await this.getFigmaFile();
        const text = JSON.stringify(data);
        const metadata = { source: this.constructFigmaApiURL() };
        return [new document_js_1.Document({ pageContent: text, metadata })];
    }
}
exports.FigmaFileLoader = FigmaFileLoader;
