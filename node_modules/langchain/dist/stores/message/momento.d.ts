import { ICacheClient } from "@gomomento/sdk";
import { BaseChatMessage, BaseListChatMessageHistory } from "../../schema/index.js";
/**
 * The settings to instantiate the Momento chat message history.
 */
export interface MomentoChatMessageHistoryProps {
    /**
     * The session ID to use to store the data.
     */
    sessionId: string;
    /**
     * The Momento cache client.
     */
    client: ICacheClient;
    /**
     * The name of the cache to use to store the data.
     */
    cacheName: string;
    /**
     * The time to live for the cache items in seconds.
     * If not specified, the cache client default is used.
     */
    sessionTtl?: number;
    /**
     * If true, ensure that the cache exists before returning.
     * If false, the cache is not checked for existence.
     * Defaults to true.
     */
    ensureCacheExists?: true;
}
export declare class MomentoChatMessageHistory extends BaseListChatMessageHistory {
    private readonly sessionId;
    private readonly client;
    private readonly cacheName;
    private readonly sessionTtl;
    private constructor();
    /**
     * Create a new chat message history backed by Momento.
     *
     * @param {MomentoCacheProps} props The settings to instantiate the Momento chat message history.
     * @param {string} props.sessionId The session ID to use to store the data.
     * @param {ICacheClient} props.client The Momento cache client.
     * @param {string} props.cacheName The name of the cache to use to store the data.
     * @param {number} props.sessionTtl The time to live for the cache items in seconds.
     * If not specified, the cache client default is used.
     * @param {boolean} props.ensureCacheExists If true, ensure that the cache exists before returning.
     * If false, the cache is not checked for existence.
     * @throws {InvalidArgumentError} If {@link props.sessionTtl} is not strictly positive.
     * @returns A new chat message history backed by Momento.
     */
    static fromProps(props: MomentoChatMessageHistoryProps): Promise<MomentoChatMessageHistory>;
    /**
     * Validate the user-specified TTL, if provided, is strictly positive.
     * @param ttlSeconds The TTL to validate.
     */
    private validateTtlSeconds;
    getMessages(): Promise<BaseChatMessage[]>;
    addMessage(message: BaseChatMessage): Promise<void>;
    clear(): Promise<void>;
}
