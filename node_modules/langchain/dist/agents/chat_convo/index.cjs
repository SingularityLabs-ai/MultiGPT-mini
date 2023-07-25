"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatConversationalAgent = void 0;
const llm_chain_js_1 = require("../../chains/llm_chain.cjs");
const chat_js_1 = require("../../prompts/chat.cjs");
const template_js_1 = require("../../prompts/template.cjs");
const index_js_1 = require("../../schema/index.cjs");
const agent_js_1 = require("../agent.cjs");
const outputParser_js_1 = require("./outputParser.cjs");
const prompt_js_1 = require("./prompt.cjs");
/**
 * Agent for the MRKL chain.
 * @augments Agent
 */
class ChatConversationalAgent extends agent_js_1.Agent {
    constructor(input) {
        const outputParser = input.outputParser ?? ChatConversationalAgent.getDefaultOutputParser();
        super({ ...input, outputParser });
    }
    _agentType() {
        return "chat-conversational-react-description";
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
    async constructScratchPad(steps) {
        const thoughts = [];
        for (const step of steps) {
            thoughts.push(new index_js_1.AIChatMessage(step.action.log));
            thoughts.push(new index_js_1.HumanChatMessage((0, template_js_1.renderTemplate)(prompt_js_1.TEMPLATE_TOOL_RESPONSE, "f-string", {
                observation: step.observation,
            })));
        }
        return thoughts;
    }
    static getDefaultOutputParser(fields) {
        if (fields?.llm) {
            return outputParser_js_1.ChatConversationalAgentOutputParserWithRetries.fromLLM(fields.llm, {
                toolNames: fields.toolNames,
            });
        }
        return new outputParser_js_1.ChatConversationalAgentOutputParserWithRetries({
            toolNames: fields?.toolNames,
        });
    }
    /**
     * Create prompt in the style of the ChatConversationAgent.
     *
     * @param tools - List of tools the agent will have access to, used to format the prompt.
     * @param args - Arguments to create the prompt with.
     * @param args.systemMessage - String to put before the list of tools.
     * @param args.humanMessage - String to put after the list of tools.
     * @param args.outputParser - Output parser to use for formatting.
     */
    static createPrompt(tools, args) {
        const systemMessage = (args?.systemMessage ?? prompt_js_1.DEFAULT_PREFIX) + prompt_js_1.PREFIX_END;
        const humanMessage = args?.humanMessage ?? prompt_js_1.DEFAULT_SUFFIX;
        const toolStrings = tools
            .map((tool) => `${tool.name}: ${tool.description}`)
            .join("\n");
        const toolNames = tools.map((tool) => tool.name);
        const outputParser = args?.outputParser ??
            ChatConversationalAgent.getDefaultOutputParser({ toolNames });
        const formatInstructions = outputParser.getFormatInstructions({
            toolNames,
        });
        const renderedHumanMessage = (0, template_js_1.renderTemplate)(humanMessage, "f-string", {
            format_instructions: formatInstructions,
            tools: toolStrings,
        });
        const messages = [
            chat_js_1.SystemMessagePromptTemplate.fromTemplate(systemMessage),
            new chat_js_1.MessagesPlaceholder("chat_history"),
            chat_js_1.HumanMessagePromptTemplate.fromTemplate(renderedHumanMessage),
            new chat_js_1.MessagesPlaceholder("agent_scratchpad"),
        ];
        return chat_js_1.ChatPromptTemplate.fromPromptMessages(messages);
    }
    static fromLLMAndTools(llm, tools, args) {
        ChatConversationalAgent.validateTools(tools);
        const outputParser = args?.outputParser ??
            ChatConversationalAgent.getDefaultOutputParser({
                llm,
                toolNames: tools.map((tool) => tool.name),
            });
        const prompt = ChatConversationalAgent.createPrompt(tools, {
            ...args,
            outputParser,
        });
        const chain = new llm_chain_js_1.LLMChain({
            prompt,
            llm,
            callbacks: args?.callbacks ?? args?.callbackManager,
        });
        return new ChatConversationalAgent({
            llmChain: chain,
            outputParser,
            allowedTools: tools.map((t) => t.name),
        });
    }
}
exports.ChatConversationalAgent = ChatConversationalAgent;
