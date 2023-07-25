import { Redis, type RedisConfigNodejs } from "@upstash/redis";
import { BaseChatMessage, BaseListChatMessageHistory } from "../../schema/index.js";
export type UpstashRedisChatMessageHistoryInput = {
    sessionId: string;
    sessionTTL?: number;
    config?: RedisConfigNodejs;
    client?: Redis;
};
export declare class UpstashRedisChatMessageHistory extends BaseListChatMessageHistory {
    client: Redis;
    private sessionId;
    private sessionTTL?;
    constructor(fields: UpstashRedisChatMessageHistoryInput);
    getMessages(): Promise<BaseChatMessage[]>;
    addMessage(message: BaseChatMessage): Promise<void>;
    clear(): Promise<void>;
}
