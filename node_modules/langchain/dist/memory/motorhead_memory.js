import { BaseChatMemory } from "./chat_memory.js";
import { getBufferString, getInputValue, } from "./base.js";
import { AsyncCaller } from "../util/async_caller.js";
const MANAGED_URL = "https://api.getmetal.io/v1/motorhead";
export class MotorheadMemory extends BaseChatMemory {
    constructor(fields) {
        const { sessionId, url, motorheadURL, memoryKey, timeout, returnMessages, inputKey, outputKey, chatHistory, apiKey, clientId, ...rest } = fields;
        super({ returnMessages, inputKey, outputKey, chatHistory });
        Object.defineProperty(this, "url", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: MANAGED_URL
        });
        Object.defineProperty(this, "timeout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 3000
        });
        Object.defineProperty(this, "memoryKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "history"
        });
        Object.defineProperty(this, "sessionId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "context", {
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
        // Managed Params
        Object.defineProperty(this, "apiKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "clientId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.caller = new AsyncCaller(rest);
        this.sessionId = sessionId;
        this.url = url ?? motorheadURL ?? this.url;
        this.memoryKey = memoryKey ?? this.memoryKey;
        this.timeout = timeout ?? this.timeout;
        this.apiKey = apiKey;
        this.clientId = clientId;
    }
    get memoryKeys() {
        return [this.memoryKey];
    }
    _getHeaders() {
        const isManaged = this.url === MANAGED_URL;
        const headers = {
            "Content-Type": "application/json",
        };
        if (isManaged && !(this.apiKey && this.clientId)) {
            throw new Error("apiKey and clientId are required for managed motorhead. Visit https://getmetal.io to get your keys.");
        }
        if (isManaged && this.apiKey && this.clientId) {
            headers["x-metal-api-key"] = this.apiKey;
            headers["x-metal-client-id"] = this.clientId;
        }
        return headers;
    }
    async init() {
        const res = await this.caller.call(fetch, `${this.url}/sessions/${this.sessionId}/memory`, {
            signal: this.timeout ? AbortSignal.timeout(this.timeout) : undefined,
            headers: this._getHeaders(),
        });
        const { messages = [], context = "NONE" } = await res.json();
        await Promise.all(messages.reverse().map(async (message) => {
            if (message.role === "AI") {
                await this.chatHistory.addAIChatMessage(message.content);
            }
            else {
                await this.chatHistory.addUserMessage(message.content);
            }
        }));
        if (context && context !== "NONE") {
            this.context = context;
        }
    }
    async loadMemoryVariables(_values) {
        const messages = await this.chatHistory.getMessages();
        if (this.returnMessages) {
            const result = {
                [this.memoryKey]: messages,
            };
            return result;
        }
        const result = {
            [this.memoryKey]: getBufferString(messages),
        };
        return result;
    }
    async saveContext(inputValues, outputValues) {
        const input = getInputValue(inputValues, this.inputKey);
        const output = getInputValue(outputValues, this.outputKey);
        await Promise.all([
            this.caller.call(fetch, `${this.url}/sessions/${this.sessionId}/memory`, {
                signal: this.timeout ? AbortSignal.timeout(this.timeout) : undefined,
                method: "POST",
                body: JSON.stringify({
                    messages: [
                        { role: "Human", content: `${input}` },
                        { role: "AI", content: `${output}` },
                    ],
                }),
                headers: this._getHeaders(),
            }),
            super.saveContext(inputValues, outputValues),
        ]);
    }
}
