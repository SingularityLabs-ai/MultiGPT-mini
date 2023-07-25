import { AsyncCaller } from "../../util/async_caller.js";
import { getEnvironmentVariable, getRuntimeEnvironment, } from "../../util/env.js";
import { BaseTracer } from "./tracer.js";
export class LangChainTracer extends BaseTracer {
    constructor({ exampleId, sessionName, callerParams, timeout, } = {}) {
        super();
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "langchain_tracer"
        });
        Object.defineProperty(this, "endpoint", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: getEnvironmentVariable("LANGCHAIN_ENDPOINT") || "http://localhost:1984"
        });
        Object.defineProperty(this, "headers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                "Content-Type": "application/json",
            }
        });
        Object.defineProperty(this, "sessionName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "exampleId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
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
            value: 5000
        });
        const apiKey = getEnvironmentVariable("LANGCHAIN_API_KEY");
        if (apiKey) {
            this.headers["x-api-key"] = apiKey;
        }
        this.sessionName =
            sessionName ?? getEnvironmentVariable("LANGCHAIN_SESSION");
        this.exampleId = exampleId;
        this.timeout = timeout ?? this.timeout;
        this.caller = new AsyncCaller(callerParams ?? { maxRetries: 2 });
    }
    async _convertToCreate(run, example_id = undefined) {
        const runExtra = run.extra ?? {};
        runExtra.runtime = await getRuntimeEnvironment();
        const persistedRun = {
            id: run.id,
            name: run.name,
            start_time: run.start_time,
            end_time: run.end_time,
            run_type: run.run_type,
            // example_id is only set for the root run
            reference_example_id: run.parent_run_id ? undefined : example_id,
            extra: runExtra,
            parent_run_id: run.parent_run_id,
            execution_order: run.execution_order,
            serialized: run.serialized,
            error: run.error,
            inputs: run.inputs,
            outputs: run.outputs ?? {},
            session_name: this.sessionName,
            child_runs: [],
        };
        return persistedRun;
    }
    async persistRun(_run) { }
    async _persistRunSingle(run) {
        const persistedRun = await this._convertToCreate(run, this.exampleId);
        const endpoint = `${this.endpoint}/runs`;
        const response = await this.caller.call(fetch, endpoint, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(persistedRun),
            signal: AbortSignal.timeout(this.timeout),
        });
        // consume the response body to release the connection
        // https://undici.nodejs.org/#/?id=garbage-collection
        const body = await response.text();
        if (!response.ok) {
            throw new Error(`Failed to persist run: ${response.status} ${response.statusText} ${body}`);
        }
    }
    async _updateRunSingle(run) {
        const runUpdate = {
            end_time: run.end_time,
            error: run.error,
            outputs: run.outputs,
            parent_run_id: run.parent_run_id,
            reference_example_id: run.reference_example_id,
        };
        const endpoint = `${this.endpoint}/runs/${run.id}`;
        const response = await this.caller.call(fetch, endpoint, {
            method: "PATCH",
            headers: this.headers,
            body: JSON.stringify(runUpdate),
            signal: AbortSignal.timeout(this.timeout),
        });
        // consume the response body to release the connection
        // https://undici.nodejs.org/#/?id=garbage-collection
        const body = await response.text();
        if (!response.ok) {
            throw new Error(`Failed to update run: ${response.status} ${response.statusText} ${body}`);
        }
    }
    async onLLMStart(run) {
        await this._persistRunSingle(run);
    }
    async onLLMEnd(run) {
        await this._updateRunSingle(run);
    }
    async onLLMError(run) {
        await this._updateRunSingle(run);
    }
    async onChainStart(run) {
        await this._persistRunSingle(run);
    }
    async onChainEnd(run) {
        await this._updateRunSingle(run);
    }
    async onChainError(run) {
        await this._updateRunSingle(run);
    }
    async onToolStart(run) {
        await this._persistRunSingle(run);
    }
    async onToolEnd(run) {
        await this._updateRunSingle(run);
    }
    async onToolError(run) {
        await this._updateRunSingle(run);
    }
}
