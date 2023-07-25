"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructuredChatAgent = void 0;
const zod_to_json_schema_1 = require("zod-to-json-schema");
const llm_chain_js_1 = require("../../chains/llm_chain.cjs");
const prompt_js_1 = require("../../prompts/prompt.cjs");
const chat_js_1 = require("../../prompts/chat.cjs");
const agent_js_1 = require("../agent.cjs");
const outputParser_js_1 = require("./outputParser.cjs");
const prompt_js_2 = require("./prompt.cjs");
/**
 * Agent that interoperates with Structured Tools using React logic.
 * @augments Agent
 */
class StructuredChatAgent extends agent_js_1.Agent {
    constructor(input) {
        const outputParser = input?.outputParser ?? StructuredChatAgent.getDefaultOutputParser();
        super({ ...input, outputParser });
    }
    _agentType() {
        return "structured-chat-zero-shot-react-description";
    }
    observationPrefix() {
        return "Observation: ";
    }
    llmPrefix() {
        return "Thought:";
    }
    _stop() {
        return ["Observation:"];
    }
    static validateTools(tools) {
        const descriptionlessTool = tools.find((tool) => !tool.description);
        if (descriptionlessTool) {
            const msg = `Got a tool ${descriptionlessTool.name} without a description.` +
                ` This agent requires descriptions for all tools.`;
            throw new Error(msg);
        }
    }
    static getDefaultOutputParser(fields) {
        if (fields?.llm) {
            return outputParser_js_1.StructuredChatOutputParserWithRetries.fromLLM(fields.llm, {
                toolNames: fields.toolNames,
            });
        }
        return new outputParser_js_1.StructuredChatOutputParserWithRetries({
            toolNames: fields?.toolNames,
        });
    }
    async constructScratchPad(steps) {
        const agentScratchpad = await super.constructScratchPad(steps);
        if (agentScratchpad) {
            return `This was your previous work (but I haven't seen any of it! I only see what you return as final answer):\n${agentScratchpad}`;
        }
        return agentScratchpad;
    }
    static createToolSchemasString(tools) {
        return tools
            .map((tool) => `${tool.name}: ${tool.description}, args: ${JSON.stringify((0, zod_to_json_schema_1.zodToJsonSchema)(tool.schema).properties)}`)
            .join("\n");
    }
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
    static createPrompt(tools, args) {
        const { prefix = prompt_js_2.PREFIX, suffix = prompt_js_2.SUFFIX, inputVariables = ["input", "agent_scratchpad"], memoryPrompts = [], } = args ?? {};
        const template = [prefix, prompt_js_2.FORMAT_INSTRUCTIONS, suffix].join("\n\n");
        const humanMessageTemplate = "{input}\n\n{agent_scratchpad}";
        const messages = [
            new chat_js_1.SystemMessagePromptTemplate(new prompt_js_1.PromptTemplate({
                template,
                inputVariables,
                partialVariables: {
                    tool_schemas: StructuredChatAgent.createToolSchemasString(tools),
                    tool_names: tools.map((tool) => tool.name).join(", "),
                },
            })),
            ...memoryPrompts,
            new chat_js_1.HumanMessagePromptTemplate(new prompt_js_1.PromptTemplate({
                template: humanMessageTemplate,
                inputVariables,
            })),
        ];
        return chat_js_1.ChatPromptTemplate.fromPromptMessages(messages);
    }
    static fromLLMAndTools(llm, tools, args) {
        StructuredChatAgent.validateTools(tools);
        const prompt = StructuredChatAgent.createPrompt(tools, args);
        const outputParser = args?.outputParser ??
            StructuredChatAgent.getDefaultOutputParser({
                llm,
                toolNames: tools.map((tool) => tool.name),
            });
        const chain = new llm_chain_js_1.LLMChain({
            prompt,
            llm,
            callbacks: args?.callbacks,
        });
        return new StructuredChatAgent({
            llmChain: chain,
            outputParser,
            allowedTools: tools.map((t) => t.name),
        });
    }
}
exports.StructuredChatAgent = StructuredChatAgent;
