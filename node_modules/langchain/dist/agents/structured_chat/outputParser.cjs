"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructuredChatOutputParserWithRetries = exports.StructuredChatOutputParser = void 0;
const types_js_1 = require("../types.cjs");
const prompt_js_1 = require("./prompt.cjs");
const fix_js_1 = require("../../output_parsers/fix.cjs");
const output_parser_js_1 = require("../../schema/output_parser.cjs");
const index_js_1 = require("../../prompts/index.cjs");
class StructuredChatOutputParser extends types_js_1.AgentActionOutputParser {
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
                throw new output_parser_js_1.OutputParserException(`Could not parse an action. The agent action must be within a markdown code block, and "action" must be a provided tool or "Final Answer"`);
            }
            const response = JSON.parse(actionMatch[1].trim());
            const { action, action_input } = response;
            if (action === "Final Answer") {
                return { returnValues: { output: action_input }, log: text };
            }
            return { tool: action, toolInput: action_input || {}, log: text };
        }
        catch (e) {
            throw new output_parser_js_1.OutputParserException(`Failed to parse. Text: "${text}". Error: ${e}`);
        }
    }
    getFormatInstructions() {
        return (0, index_js_1.renderTemplate)(prompt_js_1.AGENT_ACTION_FORMAT_INSTRUCTIONS, "f-string", {
            tool_names: this.toolNames.join(", "),
        });
    }
}
exports.StructuredChatOutputParser = StructuredChatOutputParser;
class StructuredChatOutputParserWithRetries extends types_js_1.AgentActionOutputParser {
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
        return (0, index_js_1.renderTemplate)(prompt_js_1.FORMAT_INSTRUCTIONS, "f-string", {
            tool_names: this.toolNames.join(", "),
        });
    }
    static fromLLM(llm, options) {
        const baseParser = options.baseParser ??
            new StructuredChatOutputParser(options.toolNames ?? []);
        const outputFixingParser = fix_js_1.OutputFixingParser.fromLLM(llm, baseParser);
        return new StructuredChatOutputParserWithRetries({
            baseParser,
            outputFixingParser,
            toolNames: options.toolNames,
        });
    }
}
exports.StructuredChatOutputParserWithRetries = StructuredChatOutputParserWithRetries;
