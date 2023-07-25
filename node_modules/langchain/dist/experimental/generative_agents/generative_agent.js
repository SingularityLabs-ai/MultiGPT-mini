import { LLMChain } from "../../chains/llm_chain.js";
import { PromptTemplate } from "../../prompts/index.js";
export class GenerativeAgent {
    // TODO: Add support for daily summaries
    // private dailySummaries: string[] = []; // summary of the events in the plan that the agent took.
    constructor(llm, memory, config) {
        // a character with memory and innate characterisitics
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // the character's name
        Object.defineProperty(this, "age", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // the optional age of the character
        Object.defineProperty(this, "traits", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // permanent traits to ascribe to the character
        Object.defineProperty(this, "status", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // the traits of the character you wish not to change
        Object.defineProperty(this, "memory", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "llm", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // the underlying language model
        Object.defineProperty(this, "verbose", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // false
        Object.defineProperty(this, "summary", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // stateful self-summary generated via reflection on the character's memory.
        Object.defineProperty(this, "summaryRefreshSeconds", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 3600
        });
        Object.defineProperty(this, "lastRefreshed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // the last time the character's summary was regenerated
        this.llm = llm;
        this.memory = memory;
        this.name = config.name;
        this.age = config.age;
        this.traits = config.traits;
        this.status = config.status;
        this.verbose = config.verbose ?? this.verbose;
        this.summary = "";
        this.summaryRefreshSeconds =
            config.summaryRefreshSeconds ?? this.summaryRefreshSeconds;
        this.lastRefreshed = new Date();
        // this.dailySummaries = config.dailySummaries ?? this.dailySummaries;
    }
    // LLM methods
    parseList(text) {
        // parse a newline-seperated string into a list of strings
        const lines = text.trim().split("\n");
        const result = lines.map((line) => line.replace(/^\s*\d+\.\s*/, "").trim());
        return result;
    }
    chain(prompt) {
        const chain = new LLMChain({
            llm: this.llm,
            prompt,
            verbose: this.verbose,
            outputKey: "output",
            memory: this.memory,
        });
        return chain;
    }
    async getEntityFromObservations(observation) {
        const prompt = PromptTemplate.fromTemplate("What is the observed entity in the following observation? {observation}" +
            "\nEntity=");
        const result = await this.chain(prompt).call({
            observation,
        });
        return result.output;
    }
    async getEntityAction(observation, entityName) {
        const prompt = PromptTemplate.fromTemplate("What is the {entity} doing in the following observation? {observation}" +
            "\nThe {entity} is");
        const result = await this.chain(prompt).call({
            entity: entityName,
            observation,
        });
        const trimmedResult = result.output.trim();
        return trimmedResult;
    }
    async summarizeRelatedMemories(observation) {
        // summarize memories that are most relevant to an observation
        const prompt = PromptTemplate.fromTemplate(`
{q1}?
Context from memory:
{relevant_memories}
Relevant context:`);
        const entityName = await this.getEntityFromObservations(observation);
        const entityAction = await this.getEntityAction(observation, entityName);
        const q1 = `What is the relationship between ${this.name} and ${entityName}`;
        const q2 = `${entityName} is ${entityAction}`;
        const response = await this.chain(prompt).call({
            q1,
            queries: [q1, q2],
        });
        return response.output.trim(); // added output
    }
    async _generateReaction(observation, suffix, now) {
        // react to a given observation or dialogue act
        const prompt = PromptTemplate.fromTemplate(`{agent_summary_description}` +
            `\nIt is {current_time}.` +
            `\n{agent_name}'s status: {agent_status}` +
            `\nSummary of relevant context from {agent_name}'s memory:` +
            "\n{relevant_memories}" +
            `\nMost recent observations: {most_recent_memories}` +
            `\nObservation: {observation}` +
            `\n\n${suffix}`);
        const agentSummaryDescription = await this.getSummary(); // now = now in param
        const relevantMemoriesStr = await this.summarizeRelatedMemories(observation);
        const currentTime = (now || new Date()).toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        });
        const chainInputs = {
            agent_summary_description: agentSummaryDescription,
            current_time: currentTime,
            agent_name: this.name,
            observation,
            agent_status: this.status,
            most_recent_memories: "",
        };
        chainInputs[this.memory.getRelevantMemoriesKey()] = relevantMemoriesStr;
        const consumedTokens = await this.llm.getNumTokens(await prompt.format({ ...chainInputs }));
        chainInputs[this.memory.getMostRecentMemoriesTokenKey()] = consumedTokens;
        const response = await this.chain(prompt).call(chainInputs);
        return response.output.trim();
    }
    _cleanResponse(text) {
        if (text === undefined) {
            return "";
        }
        const regex = new RegExp(`^${this.name} `);
        return text.replace(regex, "").trim();
    }
    async generateReaction(observation, now) {
        const callToActionTemplate = `Should {agent_name} react to the observation, and if so,` +
            ` what would be an appropriate reaction? Respond in one line.` +
            ` If the action is to engage in dialogue, write:\nSAY: "what to say"` +
            ` \notherwise, write:\nREACT: {agent_name}'s reaction (if anything).` +
            ` \nEither do nothing, react, or say something but not both.\n\n`;
        const fullResult = await this._generateReaction(observation, callToActionTemplate, now);
        const result = fullResult.trim().split("\n")[0];
        await this.memory.saveContext({}, {
            [this.memory.getAddMemoryKey()]: `${this.name} observed ${observation} and reacted by ${result}`,
            [this.memory.getCurrentTimeKey()]: now,
        });
        if (result.includes("REACT:")) {
            const reaction = this._cleanResponse(result.split("SAY:").pop());
            return [false, `${this.name} ${reaction}`];
        }
        if (result.includes("SAY:")) {
            const saidValue = this._cleanResponse(result.split("SAY:").pop());
            return [true, `${this.name} said ${saidValue}`];
        }
        return [false, result];
    }
    async generateDialogueResponse(observation, now) {
        const callToActionTemplate = `What would ${this.name} say? To end the conversation, write: GOODBYE: "what to say". Otherwise to continue the conversation, write: SAY: "what to say next"\n\n`;
        const fullResult = await this._generateReaction(observation, callToActionTemplate, now);
        const result = fullResult.trim().split("\n")[0] ?? "";
        if (result.includes("GOODBYE:")) {
            const farewell = this._cleanResponse(result.split("GOODBYE:").pop() ?? "");
            await this.memory.saveContext({}, {
                [this.memory
                    .addMemoryKey]: `${this.name} observed ${observation} and said ${farewell}`,
                [this.memory.getCurrentTimeKey()]: now,
            });
            return [false, `${this.name} said ${farewell}`];
        }
        if (result.includes("SAY:")) {
            const responseText = this._cleanResponse(result.split("SAY:").pop() ?? "");
            await this.memory.saveContext({}, {
                [this.memory
                    .addMemoryKey]: `${this.name} observed ${observation} and said ${responseText}`,
                [this.memory.getCurrentTimeKey()]: now,
            });
            return [true, `${this.name} said ${responseText}`];
        }
        return [false, result];
    }
    // Agent stateful' summary methods
    // Each dialog or response prompt includes a header
    // summarizing the agent's self-description. This is
    // updated periodically through probing it's memories
    async getSummary(config = {}) {
        const { now = new Date(), forceRefresh = false } = config;
        const sinceRefresh = Math.floor((now.getTime() - this.lastRefreshed.getTime()) / 1000);
        if (!this.summary ||
            sinceRefresh >= this.summaryRefreshSeconds ||
            forceRefresh) {
            this.summary = await this.computeAgentSummary();
            this.lastRefreshed = now;
        }
        let age;
        if (this.age) {
            age = this.age;
        }
        else {
            age = "N/A";
        }
        return `Name: ${this.name} (age: ${age})
Innate traits: ${this.traits}
${this.summary}`;
    }
    async computeAgentSummary() {
        const prompt = PromptTemplate.fromTemplate("How would you summarize {name}'s core characteristics given the following statements:\n" +
            "----------" +
            "{relevant_memories}" +
            "----------" +
            "Do not embellish." +
            "\n\nSummary: ");
        // the agent seeks to think about their core characterisitics
        const result = await this.chain(prompt).call({
            name: this.name,
            queries: [`${this.name}'s core characteristics`],
        });
        return result.output.trim();
    }
    getFullHeader(config = {}) {
        const { now = new Date(), forceRefresh = false } = config;
        // return a full header of the agent's status, summary, and current time.
        const summary = this.getSummary({ now, forceRefresh });
        const currentTimeString = now.toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        });
        return `${summary}\nIt is ${currentTimeString}.\n${this.name}'s status: ${this.status}`;
    }
}
