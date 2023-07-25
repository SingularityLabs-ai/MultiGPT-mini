import { ZepClient, Memory, Message, NotFoundError } from "@getzep/zep-js";
import { getBufferString, getInputValue, } from "./base.js";
import { BaseChatMemory } from "./chat_memory.js";
import { ChatMessage, AIChatMessage, HumanChatMessage, } from "../schema/index.js";
export class ZepMemory extends BaseChatMemory {
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
        this.zepClient = new ZepClient(this.baseURL);
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
            if (error instanceof NotFoundError) {
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
                    return new HumanChatMessage(content);
                }
                else if (role === this.aiPrefix) {
                    return new AIChatMessage(content);
                }
                else {
                    // default to generic ChatMessage
                    return new ChatMessage(content, role);
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
            [this.memoryKey]: getBufferString(messages, this.humanPrefix, this.aiPrefix),
        };
        return result;
    }
    async saveContext(inputValues, outputValues) {
        const input = getInputValue(inputValues, this.inputKey);
        const output = getInputValue(outputValues, this.outputKey);
        // Create new Memory and Message instances
        const memory = new Memory({
            messages: [
                new Message({
                    role: this.humanPrefix,
                    content: `${input}`,
                }),
                new Message({
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
