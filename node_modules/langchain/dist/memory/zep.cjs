"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZepMemory = void 0;
const zep_js_1 = require("@getzep/zep-js");
const base_js_1 = require("./base.cjs");
const chat_memory_js_1 = require("./chat_memory.cjs");
const index_js_1 = require("../schema/index.cjs");
class ZepMemory extends chat_memory_js_1.BaseChatMemory {
    constructor(fields) {
        super({
            returnMessages: fields?.returnMessages ?? false,
            inputKey: fields?.inputKey,
            outputKey: fields?.outputKey,
        });
        Object.defineProperty(this, "humanPrefix", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Human"
        });
        Object.defineProperty(this, "aiPrefix", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "AI"
        });
        Object.defineProperty(this, "memoryKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "history"
        });
        Object.defineProperty(this, "baseURL", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "sessionId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "zepClient", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.humanPrefix = fields.humanPrefix ?? this.humanPrefix;
        this.aiPrefix = fields.aiPrefix ?? this.aiPrefix;
        this.memoryKey = fields.memoryKey ?? this.memoryKey;
        this.baseURL = fields.baseURL;
        this.sessionId = fields.sessionId;
        this.zepClient = new zep_js_1.ZepClient(this.baseURL);
    }
    get memoryKeys() {
        return [this.memoryKey];
    }
    async loadMemoryVariables(values) {
        const lastN = values.lastN ?? 10;
        let memory = null;
        try {
            memory = await this.zepClient.getMemory(this.sessionId, lastN);
        }
        catch (error) {
            // eslint-disable-next-line no-instanceof/no-instanceof
            if (error instanceof zep_js_1.NotFoundError) {
                if (this.returnMessages)
                    return { [this.memoryKey]: [] };
                return [];
            }
            else {
                throw error;
            }
        }
        let messages = [];
        if (memory) {
            messages = memory.messages.map((message) => {
                const { content, role } = message;
                if (role === this.humanPrefix) {
                    return new index_js_1.HumanChatMessage(content);
                }
                else if (role === this.aiPrefix) {
                    return new index_js_1.AIChatMessage(content);
                }
                else {
                    // default to generic ChatMessage
                    return new index_js_1.ChatMessage(content, role);
                }
            });
        }
        if (this.returnMessages) {
            const result = {
                [this.memoryKey]: messages,
            };
            return result;
        }
        const result = {
            [this.memoryKey]: (0, base_js_1.getBufferString)(messages, this.humanPrefix, this.aiPrefix),
        };
        return result;
    }
    async saveContext(inputValues, outputValues) {
        const input = (0, base_js_1.getInputValue)(inputValues, this.inputKey);
        const output = (0, base_js_1.getInputValue)(outputValues, this.outputKey);
        // Create new Memory and Message instances
        const memory = new zep_js_1.Memory({
            messages: [
                new zep_js_1.Message({
                    role: this.humanPrefix,
                    content: `${input}`,
                }),
                new zep_js_1.Message({
                    role: this.aiPrefix,
                    content: `${output}`,
                }),
            ],
        });
        // Add the new memory to the session using the ZepClient
        if (this.sessionId) {
            try {
                await this.zepClient.addMemory(this.sessionId, memory);
            }
            catch (error) {
                console.error("Error adding memory: ", error);
            }
        }
        // Call the superclass's saveContext method
        await super.saveContext(inputValues, outputValues);
    }
    async clear() {
        try {
            await this.zepClient.deleteMemory(this.sessionId);
        }
        catch (error) {
            console.error("Error deleting session: ", error);
        }
        // Clear the superclass's chat history
        await super.clear();
    }
}
exports.ZepMemory = ZepMemory;
