import { BaseRun, Run, RunType } from "../callbacks/handlers/tracer.js";
import { LangChainTracer } from "../callbacks/handlers/tracer_langchain.js";
import { ChainValues, LLMResult, RunInputs, RunOutputs } from "../schema/index.js";
import { BaseLanguageModel } from "../base_language/index.js";
import { BaseChain } from "../chains/base.js";
import { BaseLLM } from "../llms/base.js";
import { BaseChatModel } from "../chat_models/base.js";
import { AsyncCallerParams } from "../util/async_caller.js";
export interface TracerSession {
    id: string;
    tenant_id: string;
    name: string;
}
export interface RunResult extends BaseRun {
    name: string;
    session_id: string;
    parent_run_id?: string;
}
export interface BaseDataset {
    name: string;
    description: string;
    tenant_id: string;
}
export interface Dataset extends BaseDataset {
    id: string;
    created_at: string;
    modified_at: string;
}
export interface BaseExample {
    dataset_id: string;
    inputs: RunInputs;
    outputs: RunOutputs;
}
export interface ExampleCreate extends BaseExample {
    id?: string;
    created_at: string;
}
export interface Example extends BaseExample {
    id: string;
    created_at: string;
    modified_at: string;
    runs: RunResult[];
}
interface ListRunsParams {
    sessionId?: string;
    sessionName?: string;
    executionOrder?: number;
    runType?: RunType;
    error?: boolean;
}
interface UploadCSVParams {
    csvFile: Blob;
    fileName: string;
    inputKeys: string[];
    outputKeys: string[];
    description?: string;
}
export type DatasetRunResults = Record<string, (string | LLMResult | ChainValues)[]>;
export declare function isLLM(llm: BaseLanguageModel | (() => Promise<BaseChain>)): llm is BaseLLM;
export declare function isChatModel(llm: BaseLanguageModel | (() => Promise<BaseChain>)): llm is BaseChatModel;
export declare function isChain(llm: BaseLanguageModel | (() => Promise<BaseChain>)): Promise<boolean>;
export declare class LangChainPlusClient {
    private apiKey?;
    private apiUrl;
    private caller;
    private timeout;
    constructor(config: {
        apiUrl?: string;
        apiKey?: string;
        timeout?: number;
        callerOptions?: AsyncCallerParams;
    });
    static create(config?: {
        apiUrl?: string;
        apiKey?: string;
    }): Promise<LangChainPlusClient>;
    private validateApiKeyIfHosted;
    private get headers();
    private _get;
    readRun(runId: string): Promise<Run>;
    listRuns({ sessionId, sessionName, executionOrder, runType, error, }: ListRunsParams): Promise<Run[]>;
    readSession({ sessionId, sessionName, }: {
        sessionId?: string;
        sessionName?: string;
    }): Promise<TracerSession>;
    listSessions(): Promise<TracerSession[]>;
    uploadCsv({ csvFile, fileName, inputKeys, outputKeys, description, }: UploadCSVParams): Promise<Dataset>;
    createDataset(name: string, { description }: {
        description?: string;
    }): Promise<Dataset>;
    readDataset({ datasetId, datasetName, }: {
        datasetId?: string;
        datasetName?: string;
    }): Promise<Dataset>;
    listDatasets({ limit, }?: {
        limit?: number;
    }): Promise<Dataset[]>;
    deleteDataset({ datasetId, datasetName, }: {
        datasetId?: string;
        datasetName?: string;
    }): Promise<Dataset>;
    createExample(inputs: RunInputs, outputs: RunOutputs, { datasetId, datasetName, createdAt, }: {
        datasetId?: string;
        datasetName?: string;
        createdAt?: Date;
    }): Promise<Example>;
    readExample(exampleId: string): Promise<Example>;
    listExamples({ datasetId, datasetName, }?: {
        datasetId?: string;
        datasetName?: string;
    }): Promise<Example[]>;
    deleteExample(exampleId: string): Promise<Example>;
    protected runLLM(example: Example, tracer: LangChainTracer, llm: BaseLLM, { numRepetitions }: {
        numRepetitions?: number;
    }): Promise<(LLMResult | string)[]>;
    protected runChain(example: Example, tracer: LangChainTracer, chainFactory: () => Promise<BaseChain>, { numRepetitions, }: {
        numRepetitions?: number;
    }): Promise<(ChainValues | string)[]>;
    protected runChatModel(example: Example, tracer: LangChainTracer, chatModel: BaseChatModel, { numRepetitions, }: {
        numRepetitions?: number;
    }): Promise<(LLMResult | string)[]>;
    runOnDataset(datasetName: string, llmOrChainFactory: BaseLanguageModel | (() => Promise<BaseChain>), { numRepetitions, sessionName, }?: {
        numRepetitions?: number;
        sessionName?: string;
    }): Promise<DatasetRunResults>;
}
export {};
