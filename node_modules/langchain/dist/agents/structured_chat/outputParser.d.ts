import { AgentActionOutputParser } from "../types.js";
import { OutputFixingParser } from "../../output_parsers/fix.js";
import { BaseLanguageModel } from "../../base_language/index.js";
import { AgentAction, AgentFinish } from "../../schema/index.js";
import { Callbacks } from "../../callbacks/manager.js";
export declare class StructuredChatOutputParser extends AgentActionOutputParser {
    private toolNames;
    constructor(toolNames: string[]);
    parse(text: string): Promise<AgentAction | AgentFinish>;
    getFormatInstructions(): string;
}
export interface StructuredChatOutputParserArgs {
    baseParser?: StructuredChatOutputParser;
    outputFixingParser?: OutputFixingParser<AgentAction | AgentFinish>;
    toolNames?: string[];
}
export declare class StructuredChatOutputParserWithRetries extends AgentActionOutputParser {
    private baseParser;
    private outputFixingParser?;
    private toolNames;
    constructor(fields: StructuredChatOutputParserArgs);
    parse(text: string, callbacks?: Callbacks): Promise<AgentAction | AgentFinish>;
    getFormatInstructions(): string;
    static fromLLM(llm: BaseLanguageModel, options: Omit<StructuredChatOutputParserArgs, "outputFixingParser">): StructuredChatOutputParserWithRetries;
}
