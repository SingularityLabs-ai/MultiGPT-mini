import { BaseDocumentLoader } from "../base.js";
import { Document } from "../../document.js";
import { getEnvironmentVariable } from "../../util/env.js";
export class FigmaFileLoader extends BaseDocumentLoader {
    constructor({ accessToken = getEnvironmentVariable("FIGMA_ACCESS_TOKEN"), nodeIds, fileKey, }) {
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
        return [new Document({ pageContent: text, metadata })];
    }
}
