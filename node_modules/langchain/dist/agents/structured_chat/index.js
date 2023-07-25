import { zodToJsonSchema } from "zod-to-json-schema";
import { LLMChain } from "../../chains/llm_chain.js";
import { PromptTemplate } from "../../prompts/prompt.js";
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate, } from "../../prompts/chat.js";
import { Agent } from "../agent.js";
import { StructuredChatOutputParserWithRetries } from "./outputParser.js";
import { FORMAT_INSTRUCTIONS, PREFIX, SUFFIX } from "./prompt.js";
/**
 * Agent that interoperates with Structured Tools using React logic.
 * @augments Agent
 */
export class StructuredChatAgent extends Agent {
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
            return StructuredChatOutputParserWithRetries.fromLLM(fields.llm, {
                toolNames: fields.toolNames,
            });
        }
        return new StructuredChatOutputParserWithRetries({
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
            .map((tool) => `${tool.name}: ${tool.description}, args: ${JSON.stringify(zodToJsonSchema(tool.schema).properties)}`)
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
        const { prefix = PREFIX, suffix = SUFFIX, inputVariables = ["input", "agent_scratchpad"], memoryPrompts = [], } = args ?? {};
        const template = [prefix, FORMAT_INSTRUCTIONS, suffix].join("\n\n");
        const humanMessageTemplate = "{input}\n\n{agent_scratchpad}";
        const messages = [
            new SystemMessagePromptTemplate(new PromptTemplate({
                template,
                inputVariables,
                partialVariables: {
                    tool_schemas: StructuredChatAgent.createToolSchemasString(tools),
                    tool_names: tools.map((tool) => tool.name).join(", "),
                },
            })),
            ...memoryPrompts,
            new HumanMessagePromptTemplate(new PromptTemplate({
                template: humanMessageTemplate,
                inputVariables,
            })),
        ];
        return ChatPromptTemplate.fromPromptMessages(messages);
    }
    static fromLLMAndTools(llm, tools, args) {
        StructuredChatAgent.validateTools(tools);
        const prompt = StructuredChatAgent.createPrompt(tools, args);
        const outputParser = args?.outputParser ??
            StructuredChatAgent.getDefaultOutputParser({
                llm,
                toolNames: tools.map((tool) => tool.name),
            });
        const chain = new LLMChain({
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
