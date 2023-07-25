import { BaseLanguageModel } from "../../base_language/index.js";
import { BaseMessagePromptTemplate, ChatPromptTemplate } from "../../prompts/chat.js";
import { AgentStep } from "../../schema/index.js";
import { StructuredTool } from "../../tools/base.js";
import { Optional } from "../../types/type-utils.js";
import { Agent, AgentArgs, OutputParserArgs } from "../agent.js";
import { AgentInput } from "../types.js";
import { StructuredChatOutputParserWithRetries } from "./outputParser.js";
export interface StructuredChatCreatePromptArgs {
    /** String to put after the list of tools. */
    suffix?: string;
    /** String to put before the list of tools. */
    prefix?: string;
    /** List of input variables the final prompt will expect. */
    inputVariables?: string[];
    /** List of historical prompts from memory.  */
    memoryPrompts?: BaseMessagePromptTemplate[];
}
export type StructuredChatAgentInput = Optional<AgentInput, "outputParser">;
/**
 * Agent that interoperates with Structured Tools using React logic.
 * @augments Agent
 */
export declare class StructuredChatAgent extends Agent {
    constructor(input: StructuredChatAgentInput);
    _agentType(): "structured-chat-zero-shot-react-description";
    observationPrefix(): string;
    llmPrefix(): string;
    _stop(): string[];
    static validateTools(tools: StructuredTool[]): void;
    static getDefaultOutputParser(fields?: OutputParserArgs & {
        toolNames: string[];
    }): StructuredChatOutputParserWithRetries;
    constructScratchPad(steps: AgentStep[]): Promise<string>;
    static createToolSchemasString(tools: StructuredTool[]): string;
    /**
     * Create prompt in the style of the agent.
     *
     * @param tools - List of tools the agent will have access to, used to format the prompt.
     * @param args - Arguments to create the prompt with.
     * @param args.suffix - String to put after the list of tools.
     * @param args.prefix - String to put before the list of tools.
     * @param args.inputVariables List of input variables the final prompt will expect.
     * @param args.memoryPrompts List of historical prompts from memory.
     */
    static createPrompt(tools: StructuredTool[], args?: StructuredChatCreatePromptArgs): ChatPromptTemplate;
    static fromLLMAndTools(llm: BaseLanguageModel, tools: StructuredTool[], args?: StructuredChatCreatePromptArgs & AgentArgs): StructuredChatAgent;
}
