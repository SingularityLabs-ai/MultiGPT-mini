import { AgentActionOutputParser } from "../types.js";
import { AGENT_ACTION_FORMAT_INSTRUCTIONS, FORMAT_INSTRUCTIONS, } from "./prompt.js";
import { OutputFixingParser } from "../../output_parsers/fix.js";
import { OutputParserException } from "../../schema/output_parser.js";
import { renderTemplate } from "../../prompts/index.js";
export class StructuredChatOutputParser extends AgentActionOutputParser {
    constructor(toolNames) {
        super();
        Object.defineProperty(this, "toolNames", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: toolNames
        });
    }
    async parse(text) {
        try {
            const regex = /```(?:json)?(.*)(```)/gs;
            const actionMatch = regex.exec(text);
            if (actionMatch === null) {
                throw new OutputParserException(`Could not parse an action. The agent action must be within a markdown code block, and "action" must be a provided tool or "Final Answer"`);
            }
            const response = JSON.parse(actionMatch[1].trim());
            const { action, action_input } = response;
            if (action === "Final Answer") {
                return { returnValues: { output: action_input }, log: text };
            }
            return { tool: action, toolInput: action_input || {}, log: text };
        }
        catch (e) {
            throw new OutputParserException(`Failed to parse. Text: "${text}". Error: ${e}`);
        }
    }
    getFormatInstructions() {
        return renderTemplate(AGENT_ACTION_FORMAT_INSTRUCTIONS, "f-string", {
            tool_names: this.toolNames.join(", "),
        });
    }
}
export class StructuredChatOutputParserWithRetries extends AgentActionOutputParser {
    constructor(fields) {
        super();
        Object.defineProperty(this, "baseParser", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "outputFixingParser", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "toolNames", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        this.toolNames = fields.toolNames ?? this.toolNames;
        this.baseParser =
            fields?.baseParser ?? new StructuredChatOutputParser(this.toolNames);
        this.outputFixingParser = fields?.outputFixingParser;
    }
    async parse(text, callbacks) {
        if (this.outputFixingParser !== undefined) {
            return this.outputFixingParser.parse(text, callbacks);
        }
        return this.baseParser.parse(text);
    }
    getFormatInstructions() {
        return renderTemplate(FORMAT_INSTRUCTIONS, "f-string", {
            tool_names: this.toolNames.join(", "),
        });
    }
    static fromLLM(llm, options) {
        const baseParser = options.baseParser ??
            new StructuredChatOutputParser(options.toolNames ?? []);
        const outputFixingParser = OutputFixingParser.fromLLM(llm, baseParser);
        return new StructuredChatOutputParserWithRetries({
            baseParser,
            outputFixingParser,
            toolNames: options.toolNames,
        });
    }
}
