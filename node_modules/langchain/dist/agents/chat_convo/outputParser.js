import { OutputParserException, } from "../../schema/output_parser.js";
import { renderTemplate } from "../../prompts/template.js";
import { AgentActionOutputParser } from "../types.js";
import { FORMAT_INSTRUCTIONS } from "./prompt.js";
import { OutputFixingParser } from "../../output_parsers/fix.js";
export class ChatConversationalAgentOutputParser extends AgentActionOutputParser {
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
        let jsonOutput = text.trim();
        if (jsonOutput.includes("```json")) {
            jsonOutput = jsonOutput.split("```json")[1].trimStart();
        }
        else if (jsonOutput.includes("```")) {
            const firstIndex = jsonOutput.indexOf("```");
            jsonOutput = jsonOutput.slice(firstIndex + 3).trimStart();
        }
        const lastIndex = jsonOutput.lastIndexOf("```");
        if (lastIndex !== -1) {
            jsonOutput = jsonOutput.slice(0, lastIndex).trimEnd();
        }
        try {
            const response = JSON.parse(jsonOutput);
            const { action, action_input } = response;
            if (action === "Final Answer") {
                return { returnValues: { output: action_input }, log: text };
            }
            return { tool: action, toolInput: action_input, log: text };
        }
        catch (e) {
            throw new OutputParserException(`Failed to parse. Text: "${text}". Error: ${e}`);
        }
    }
    getFormatInstructions() {
        return renderTemplate(FORMAT_INSTRUCTIONS, "f-string", {
            tool_names: this.toolNames.join(", "),
        });
    }
}
export class ChatConversationalAgentOutputParserWithRetries extends AgentActionOutputParser {
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
            fields?.baseParser ??
                new ChatConversationalAgentOutputParser(this.toolNames);
        this.outputFixingParser = fields?.outputFixingParser;
    }
    getFormatInstructions(options) {
        if (options.raw) {
            return FORMAT_INSTRUCTIONS;
        }
        return renderTemplate(FORMAT_INSTRUCTIONS, "f-string", {
            tool_names: options.toolNames.join(", "),
        });
    }
    async parse(text) {
        if (this.outputFixingParser !== undefined) {
            return this.outputFixingParser.parse(text);
        }
        return this.baseParser.parse(text);
    }
    static fromLLM(llm, options) {
        const baseParser = options.baseParser ??
            new ChatConversationalAgentOutputParser(options.toolNames ?? []);
        const outputFixingParser = OutputFixingParser.fromLLM(llm, baseParser);
        return new ChatConversationalAgentOutputParserWithRetries({
            baseParser,
            outputFixingParser,
            toolNames: options.toolNames,
        });
    }
}
