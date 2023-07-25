"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LangChainPlusClient = exports.isChain = exports.isChatModel = exports.isLLM = void 0;
const tracer_langchain_js_1 = require("../callbacks/handlers/tracer_langchain.cjs");
const utils_js_1 = require("../stores/message/utils.cjs");
const async_caller_js_1 = require("../util/async_caller.cjs");
const env_js_1 = require("../util/env.cjs");
// utility functions
const isLocalhost = (url) => {
    const strippedUrl = url.replace("http://", "").replace("https://", "");
    const hostname = strippedUrl.split("/")[0].split(":")[0];
    return (hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname === "::1" ||
        hostname === "0.0.0.0");
};
const stringifyError = (err) => {
    let result;
    if (err == null) {
        result = "Error null or undefined";
    }
    else {
        const error = err;
        result = `Error: ${error?.name}: ${error?.message}`;
    }
    return result;
};
function isLLM(llm) {
    const blm = llm;
    return (typeof blm?._modelType === "function" && blm?._modelType() === "base_llm");
}
exports.isLLM = isLLM;
function isChatModel(llm) {
    const blm = llm;
    return (typeof blm?._modelType === "function" &&
        blm?._modelType() === "base_chat_model");
}
exports.isChatModel = isChatModel;
async function isChain(llm) {
    if (isLLM(llm)) {
        return false;
    }
    const bchFactory = llm;
    const bch = await bchFactory();
    return (typeof bch?._chainType === "function" && bch?._chainType() !== undefined);
}
exports.isChain = isChain;
async function getModelOrFactoryType(llm) {
    if (isLLM(llm)) {
        return "llm";
    }
    if (isChatModel(llm)) {
        return "chatModel";
    }
    const bchFactory = llm;
    const bch = await bchFactory();
    if (typeof bch?._chainType === "function") {
        return "chainFactory";
    }
    throw new Error("Unknown model or factory type");
}
class LangChainPlusClient {
    constructor(config) {
        Object.defineProperty(this, "apiKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, env_js_1.getEnvironmentVariable)("LANGCHAIN_API_KEY")
        });
        Object.defineProperty(this, "apiUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, env_js_1.getEnvironmentVariable)("LANGCHAIN_ENDPOINT") || "http://localhost:1984"
        });
        Object.defineProperty(this, "caller", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "timeout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 10000
        });
        this.apiUrl = config.apiUrl ?? this.apiUrl;
        this.apiKey = config.apiKey;
        this.validateApiKeyIfHosted();
        this.timeout = config.timeout ?? this.timeout;
        this.caller = new async_caller_js_1.AsyncCaller(config.callerOptions ?? {});
    }
    static async create(config = {}) {
        const apiUrl_ = config.apiUrl ??
            ((0, env_js_1.getEnvironmentVariable)("LANGCHAIN_ENDPOINT") || "http://localhost:1984");
        const apiKey_ = config.apiKey ?? (0, env_js_1.getEnvironmentVariable)("LANGCHAIN_API_KEY");
        return new LangChainPlusClient({
            apiKey: apiKey_,
            apiUrl: apiUrl_,
        });
    }
    validateApiKeyIfHosted() {
        const isLocal = isLocalhost(this.apiUrl);
        if (!isLocal && !this.apiKey) {
            throw new Error("API key must be provided when using hosted LangChain+ API");
        }
    }
    get headers() {
        const headers = {};
        if (this.apiKey) {
            headers["x-api-key"] = `${this.apiKey}`;
        }
        return headers;
    }
    async _get(path, queryParams) {
        const params = new URLSearchParams();
        if (queryParams) {
            queryParams.forEach((value, key) => {
                params.append(key, value);
            });
        }
        const url = params.toString()
            ? `${this.apiUrl}${path}?${params.toString()}`
            : `${this.apiUrl}${path}`;
        const response = await this.caller.call(fetch, url, {
            method: "GET",
            headers: this.headers,
            signal: AbortSignal.timeout(this.timeout),
        });
        // consume the response body to release the connection
        // https://undici.nodejs.org/#/?id=garbage-collection
        const json = await response.json();
        if (!response.ok) {
            throw new Error(`Failed to fetch ${path}: ${response.status} ${response.statusText}`);
        }
        return json;
    }
    async readRun(runId) {
        return await this._get(`/runs/${runId}`);
    }
    async listRuns({ sessionId, sessionName, executionOrder = 1, runType, error, }) {
        const queryParams = new URLSearchParams();
        let sessionId_ = sessionId;
        if (sessionName) {
            if (sessionId) {
                throw new Error("Only one of session_id or session_name may be given");
            }
            sessionId_ = (await this.readSession({ sessionName })).id;
        }
        if (sessionId_) {
            queryParams.append("session", sessionId_);
        }
        if (executionOrder) {
            queryParams.append("execution_order", executionOrder.toString());
        }
        if (runType) {
            queryParams.append("run_type", runType);
        }
        if (error !== undefined) {
            queryParams.append("error", error.toString());
        }
        return this._get("/runs", queryParams);
    }
    async readSession({ sessionId, sessionName, }) {
        let path = "/sessions";
        const params = new URLSearchParams();
        if (sessionId !== undefined && sessionName !== undefined) {
            throw new Error("Must provide either sessionName or sessionId, not both");
        }
        else if (sessionId !== undefined) {
            path += `/${sessionId}`;
        }
        else if (sessionName !== undefined) {
            params.append("name", sessionName);
        }
        else {
            throw new Error("Must provide sessionName or sessionId");
        }
        const response = await this._get(path, params);
        let result;
        if (Array.isArray(response)) {
            if (response.length === 0) {
                throw new Error(`Session[id=${sessionId}, name=${sessionName}] not found`);
            }
            result = response[0];
        }
        else {
            result = response;
        }
        return result;
    }
    async listSessions() {
        return this._get("/sessions");
    }
    async uploadCsv({ csvFile, fileName, inputKeys, outputKeys, description, }) {
        const url = `${this.apiUrl}/datasets/upload`;
        const formData = new FormData();
        formData.append("file", csvFile, fileName);
        formData.append("input_keys", inputKeys.join(","));
        formData.append("output_keys", outputKeys.join(","));
        if (description) {
            formData.append("description", description);
        }
        const response = await this.caller.call(fetch, url, {
            method: "POST",
            headers: this.headers,
            body: formData,
            signal: AbortSignal.timeout(this.timeout),
        });
        // consume the response body to release the connection
        // https://undici.nodejs.org/#/?id=garbage-collection
        const result = await response.json();
        if (!response.ok) {
            if (result.detail && result.detail.includes("already exists")) {
                throw new Error(`Dataset ${fileName} already exists`);
            }
            throw new Error(`Failed to upload CSV: ${response.status} ${response.statusText}`);
        }
        return result;
    }
    async createDataset(name, { description }) {
        const response = await this.caller.call(fetch, `${this.apiUrl}/datasets`, {
            method: "POST",
            headers: { ...this.headers, "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                description,
            }),
            signal: AbortSignal.timeout(this.timeout),
        });
        // consume the response body to release the connection
        // https://undici.nodejs.org/#/?id=garbage-collection
        const result = await response.json();
        if (!response.ok) {
            if (result.detail && result.detail.includes("already exists")) {
                throw new Error(`Dataset ${name} already exists`);
            }
            throw new Error(`Failed to create dataset ${response.status} ${response.statusText}`);
        }
        return result;
    }
    async readDataset({ datasetId, datasetName, }) {
        let path = "/datasets";
        // limit to 1 result
        const params = new URLSearchParams({ limit: "1" });
        if (datasetId !== undefined && datasetName !== undefined) {
            throw new Error("Must provide either datasetName or datasetId, not both");
        }
        else if (datasetId !== undefined) {
            path += `/${datasetId}`;
        }
        else if (datasetName !== undefined) {
            params.append("name", datasetName);
        }
        else {
            throw new Error("Must provide datasetName or datasetId");
        }
        const response = await this._get(path, params);
        let result;
        if (Array.isArray(response)) {
            if (response.length === 0) {
                throw new Error(`Dataset[id=${datasetId}, name=${datasetName}] not found`);
            }
            result = response[0];
        }
        else {
            result = response;
        }
        return result;
    }
    async listDatasets({ limit = 100, } = {}) {
        const path = "/datasets";
        const params = new URLSearchParams({ limit: limit.toString() });
        const response = await this._get(path, params);
        if (!Array.isArray(response)) {
            throw new Error(`Expected ${path} to return an array, but got ${response}`);
        }
        return response;
    }
    async deleteDataset({ datasetId, datasetName, }) {
        let path = "/datasets";
        let datasetId_ = datasetId;
        if (datasetId !== undefined && datasetName !== undefined) {
            throw new Error("Must provide either datasetName or datasetId, not both");
        }
        else if (datasetName !== undefined) {
            const dataset = await this.readDataset({ datasetName });
            datasetId_ = dataset.id;
        }
        if (datasetId_ !== undefined) {
            path += `/${datasetId_}`;
        }
        else {
            throw new Error("Must provide datasetName or datasetId");
        }
        const response = await this.caller.call(fetch, this.apiUrl + path, {
            method: "DELETE",
            headers: this.headers,
            signal: AbortSignal.timeout(this.timeout),
        });
        // consume the response body to release the connection
        // https://undici.nodejs.org/#/?id=garbage-collection
        const results = await response.json();
        if (!response.ok) {
            throw new Error(`Failed to delete ${path}: ${response.status} ${response.statusText}`);
        }
        return results;
    }
    async createExample(inputs, outputs, { datasetId, datasetName, createdAt, }) {
        let datasetId_ = datasetId;
        if (datasetId_ === undefined && datasetName === undefined) {
            throw new Error("Must provide either datasetName or datasetId");
        }
        else if (datasetId_ !== undefined && datasetName !== undefined) {
            throw new Error("Must provide either datasetName or datasetId, not both");
        }
        else if (datasetId_ === undefined) {
            const dataset = await this.readDataset({ datasetName });
            datasetId_ = dataset.id;
        }
        const createdAt_ = createdAt || new Date();
        const data = {
            dataset_id: datasetId_,
            inputs,
            outputs,
            created_at: createdAt_.toISOString(),
        };
        const response = await this.caller.call(fetch, `${this.apiUrl}/examples`, {
            method: "POST",
            headers: { ...this.headers, "Content-Type": "application/json" },
            body: JSON.stringify(data),
            signal: AbortSignal.timeout(this.timeout),
        });
        // consume the response body to release the connection
        // https://undici.nodejs.org/#/?id=garbage-collection
        const result = await response.json();
        if (!response.ok) {
            throw new Error(`Failed to create example: ${response.status} ${response.statusText}`);
        }
        return result;
    }
    async readExample(exampleId) {
        const path = `/examples/${exampleId}`;
        return await this._get(path);
    }
    async listExamples({ datasetId, datasetName, } = {}) {
        let datasetId_;
        if (datasetId !== undefined && datasetName !== undefined) {
            throw new Error("Must provide either datasetName or datasetId, not both");
        }
        else if (datasetId !== undefined) {
            datasetId_ = datasetId;
        }
        else if (datasetName !== undefined) {
            const dataset = await this.readDataset({ datasetName });
            datasetId_ = dataset.id;
        }
        else {
            throw new Error("Must provide a datasetName or datasetId");
        }
        const response = await this._get("/examples", new URLSearchParams({ dataset: datasetId_ }));
        if (!Array.isArray(response)) {
            throw new Error(`Expected /examples to return an array, but got ${response}`);
        }
        return response;
    }
    async deleteExample(exampleId) {
        const path = `/examples/${exampleId}`;
        const response = await this.caller.call(fetch, this.apiUrl + path, {
            method: "DELETE",
            headers: this.headers,
            signal: AbortSignal.timeout(this.timeout),
        });
        // consume the response body to release the connection
        // https://undici.nodejs.org/#/?id=garbage-collection
        const result = await response.json();
        if (!response.ok) {
            throw new Error(`Failed to delete ${path}: ${response.status} ${response.statusText}`);
        }
        return result;
    }
    async runLLM(example, tracer, llm, { numRepetitions = 1 }) {
        const results = await Promise.all(Array.from({ length: numRepetitions }).map(async () => {
            try {
                const prompt = example.inputs.prompt;
                return llm.generate([prompt], undefined, [tracer]);
            }
            catch (e) {
                console.error(e);
                return stringifyError(e);
            }
        }));
        return results;
    }
    async runChain(example, tracer, chainFactory, { numRepetitions = 1, }) {
        const results = await Promise.all(Array.from({ length: numRepetitions }).map(async () => {
            try {
                const chain = await chainFactory();
                return chain.call(example.inputs, [tracer]);
            }
            catch (e) {
                console.error(e);
                return stringifyError(e);
            }
        }));
        return results;
    }
    async runChatModel(example, tracer, chatModel, { numRepetitions = 1, }) {
        const results = await Promise.all(Array.from({ length: numRepetitions }).map(async () => {
            try {
                const messages = example.inputs.messages;
                return chatModel.generate([(0, utils_js_1.mapStoredMessagesToChatMessages)(messages)], undefined, [tracer]);
            }
            catch (e) {
                console.error(e);
                return stringifyError(e);
            }
        }));
        return results;
    }
    async runOnDataset(datasetName, llmOrChainFactory, { numRepetitions = 1, sessionName, } = {}) {
        const examples = await this.listExamples({ datasetName });
        let sessionName_;
        if (sessionName === undefined) {
            const currentTime = new Date().toISOString();
            sessionName_ = `${datasetName}-${llmOrChainFactory.constructor.name}-${currentTime}`;
        }
        else {
            sessionName_ = sessionName;
        }
        const results = {};
        const modelOrFactoryType = await getModelOrFactoryType(llmOrChainFactory);
        await Promise.all(examples.map(async (example) => {
            const tracer = new tracer_langchain_js_1.LangChainTracer({
                exampleId: example.id,
                sessionName: sessionName_,
            });
            if (modelOrFactoryType === "llm") {
                const llm = llmOrChainFactory;
                const llmResult = await this.runLLM(example, tracer, llm, {
                    numRepetitions,
                });
                results[example.id] = llmResult;
            }
            else if (modelOrFactoryType === "chainFactory") {
                const chainFactory = llmOrChainFactory;
                const chainResult = await this.runChain(example, tracer, chainFactory, { numRepetitions });
                results[example.id] = chainResult;
            }
            else if (modelOrFactoryType === "chatModel") {
                const chatModel = llmOrChainFactory;
                const chatModelResult = await this.runChatModel(example, tracer, chatModel, { numRepetitions });
                results[example.id] = chatModelResult;
            }
            else {
                throw new Error(` llm or chain type: ${llmOrChainFactory}`);
            }
        }));
        return results;
    }
}
exports.LangChainPlusClient = LangChainPlusClient;
