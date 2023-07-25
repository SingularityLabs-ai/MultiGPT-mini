"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpstashRedisChatMessageHistory = void 0;
const redis_1 = require("@upstash/redis");
const index_js_1 = require("../../schema/index.cjs");
const utils_js_1 = require("./utils.cjs");
class UpstashRedisChatMessageHistory extends index_js_1.BaseListChatMessageHistory {
    constructor(fields) {
        const { sessionId, sessionTTL, config, client } = fields;
        super();
        Object.defineProperty(this, "client", {
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
        Object.defineProperty(this, "sessionTTL", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        if (client) {
            this.client = client;
        }
        else if (config) {
            this.client = new redis_1.Redis(config);
        }
        else {
            throw new Error(`Upstash Redis message stores require either a config object or a pre-configured client.`);
        }
        this.sessionId = sessionId;
        this.sessionTTL = sessionTTL;
    }
    async getMessages() {
        const rawStoredMessages = await this.client.lrange(this.sessionId, 0, -1);
        const orderedMessages = rawStoredMessages.reverse();
        const previousMessages = orderedMessages
            .map((item) => ({
            type: item.type,
            data: {
                role: item.data.role,
                content: item.data.content,
            },
        }))
            .filter((x) => x.type !== undefined && x.data.content !== undefined);
        return (0, utils_js_1.mapStoredMessagesToChatMessages)(previousMessages);
    }
    async addMessage(message) {
        const messageToAdd = (0, utils_js_1.mapChatMessagesToStoredMessages)([message]);
        await this.client.lpush(this.sessionId, JSON.stringify(messageToAdd[0]));
        if (this.sessionTTL) {
            await this.client.expire(this.sessionId, this.sessionTTL);
        }
    }
    async clear() {
        await this.client.del(this.sessionId);
    }
}
exports.UpstashRedisChatMessageHistory = UpstashRedisChatMessageHistory;
