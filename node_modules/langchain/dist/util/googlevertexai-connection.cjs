"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleVertexAIConnection = void 0;
const google_auth_library_1 = require("google-auth-library");
class GoogleVertexAIConnection {
    constructor(fields, caller) {
        Object.defineProperty(this, "caller", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "endpoint", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "us-central1-aiplatform.googleapis.com"
        });
        Object.defineProperty(this, "location", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "us-central1"
        });
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "auth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.caller = caller;
        this.endpoint = fields?.endpoint ?? this.endpoint;
        this.location = fields?.location ?? this.location;
        this.model = fields?.model ?? this.model;
        this.auth = new google_auth_library_1.GoogleAuth({
            scopes: "https://www.googleapis.com/auth/cloud-platform",
        });
    }
    async request(instances, parameters, options) {
        const client = await this.auth.getClient();
        const projectId = await this.auth.getProjectId();
        const url = `https://${this.endpoint}/v1/projects/${projectId}/locations/${this.location}/publishers/google/models/${this.model}:predict`;
        const method = "POST";
        const data = {
            instances,
            parameters,
        };
        const opts = {
            url,
            method,
            data,
        };
        async function _request() {
            return client.request(opts);
        }
        const response = await this.caller.callWithOptions({ signal: options.signal }, _request.bind(client));
        return response;
    }
}
exports.GoogleVertexAIConnection = GoogleVertexAIConnection;
