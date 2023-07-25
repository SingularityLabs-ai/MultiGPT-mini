import { LLMChain } from "../../chains/llm_chain.js";
import { ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder, SystemMessagePromptTemplate, } from "../../prompts/chat.js";
import { renderTemplate } from "../../prompts/template.js";
import { AIChatMessage, HumanChatMessage, } from "../../schema/index.js";
import { Agent } from "../agent.js";
import { ChatConversationalAgentOutputParserWithRetries } from "./outputParser.js";
import { PREFIX_END, DEFAULT_PREFIX, DEFAULT_SUFFIX, TEMPLATE_TOOL_RESPONSE, } from "./prompt.js";
/**
 * Agent for the MRKL chain.
 * @augments Agent
 */
export class ChatConversationalAgent extends Agent {
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
            thoughts.push(new AIChatMessage(step.action.log));
            thoughts.push(new HumanChatMessage(renderTemplate(TEMPLATE_TOOL_RESPONSE, "f-string", {
                observation: step.observation,
            })));
        }
        return thoughts;
    }
    static getDefaultOutputParser(fields) {
        if (fields?.llm) {
            return ChatConversationalAgentOutputParserWithRetries.fromLLM(fields.llm, {
                toolNames: fields.toolNames,
            });
        }
        return new ChatConversationalAgentOutputParserWithRetries({
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
        const systemMessage = (args?.systemMessage ?? DEFAULT_PREFIX) + PREFIX_END;
        const humanMessage = args?.humanMessage ?? DEFAULT_SUFFIX;
        const toolStrings = tools
            .map((tool) => `${tool.name}: ${tool.description}`)
            .join("\n");
        const toolNames = tools.map((tool) => tool.name);
        const outputParser = args?.outputParser ??
            ChatConversationalAgent.getDefaultOutputParser({ toolNames });
        const formatInstructions = outputParser.getFormatInstructions({
            toolNames,
        });
        const renderedHumanMessage = renderTemplate(humanMessage, "f-string", {
            format_instructions: formatInstructions,
            tools: toolStrings,
        });
        const messages = [
            SystemMessagePromptTemplate.fromTemplate(systemMessage),
            new MessagesPlaceholder("chat_history"),
            HumanMessagePromptTemplate.fromTemplate(renderedHumanMessage),
            new MessagesPlaceholder("agent_scratchpad"),
        ];
        return ChatPromptTemplate.fromPromptMessages(messages);
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
        const chain = new LLMChain({
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
