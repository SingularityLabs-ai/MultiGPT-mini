"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VespaRetriever = void 0;
const document_js_1 = require("../document.cjs");
const base_js_1 = require("./remote/base.cjs");
class VespaRetriever extends base_js_1.RemoteRetriever {
    constructor({ query_body, content_field, ...rest }) {
        super(rest);
        Object.defineProperty(this, "query_body", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "content_field", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.query_body = query_body;
        this.content_field = content_field;
        this.url = `${this.url}/search/?`;
    }
    createJsonBody(query) {
        return {
            ...this.query_body,
            query,
        };
    }
    processJsonResponse(json) {
        return json.root.children.map((doc) => new document_js_1.Document({
            pageContent: doc.fields[this.content_field],
            metadata: { id: doc.id },
        }));
    }
}
exports.VespaRetriever = VespaRetriever;
