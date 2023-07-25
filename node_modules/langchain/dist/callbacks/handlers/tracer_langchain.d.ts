import { AsyncCaller, AsyncCallerParams } from "../../util/async_caller.js";
import { BaseTracer, Run, BaseRun } from "./tracer.js";
import { RunOutputs } from "../../schema/index.js";
export interface RunCreate extends BaseRun {
    parent_run_id?: string;
    child_runs: this[];
    session_name?: string;
}
export interface RunUpdate {
    end_time?: number;
    error?: string;
    outputs?: RunOutputs;
    parent_run_id?: string;
    reference_example_id?: string;
}
export interface LangChainTracerFields {
    exampleId?: string;
    sessionName?: string;
    callerParams?: AsyncCallerParams;
    timeout?: number;
}
export declare class LangChainTracer extends BaseTracer implements LangChainTracerFields {
    name: string;
    protected endpoint: string;
    protected headers: Record<string, string>;
    sessionName?: string;
    exampleId?: string;
    caller: AsyncCaller;
    timeout: number;
    constructor({ exampleId, sessionName, callerParams, timeout, }?: LangChainTracerFields);
    private _convertToCreate;
    protected persistRun(_run: Run): Promise<void>;
    protected _persistRunSingle(run: Run): Promise<void>;
    protected _updateRunSingle(run: Run): Promise<void>;
    onLLMStart(run: Run): Promise<void>;
    onLLMEnd(run: Run): Promise<void>;
    onLLMError(run: Run): Promise<void>;
    onChainStart(run: Run): Promise<void>;
    onChainEnd(run: Run): Promise<void>;
    onChainError(run: Run): Promise<void>;
    onToolStart(run: Run): Promise<void>;
    onToolEnd(run: Run): Promise<void>;
    onToolError(run: Run): Promise<void>;
}
