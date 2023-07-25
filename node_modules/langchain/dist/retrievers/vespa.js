import { Document } from "../document.js";
import { RemoteRetriever, } from "./remote/base.js";
export class VespaRetriever extends RemoteRetriever {
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
        return json.root.children.map((doc) => new Document({
            pageContent: doc.fields[this.content_field],
            metadata: { id: doc.id },
        }));
    }
}
