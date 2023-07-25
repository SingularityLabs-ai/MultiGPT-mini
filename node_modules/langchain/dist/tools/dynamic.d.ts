import { z } from "zod";
import { CallbackManagerForToolRun, Callbacks } from "../callbacks/manager.js";
import { StructuredTool, Tool } from "./base.js";
export interface BaseDynamicToolInput {
    name: string;
    description: string;
    returnDirect?: boolean;
    verbose?: boolean;
    callbacks?: Callbacks;
}
export interface DynamicToolInput extends BaseDynamicToolInput {
    func: (input: string, runManager?: CallbackManagerForToolRun) => Promise<string>;
}
export interface DynamicStructuredToolInput<T extends z.ZodObject<any, any, any, any> = z.ZodObject<any, any, any, any>> extends BaseDynamicToolInput {
    func: (input: z.infer<T>, runManager?: CallbackManagerForToolRun) => Promise<string>;
    schema: T;
}
/**
 * A tool that can be created dynamically from a function, name, and description.
 */
export declare class DynamicTool extends Tool {
    name: string;
    description: string;
    func: DynamicToolInput["func"];
    constructor(fields: DynamicToolInput);
    /** @ignore */
    _call(input: string, runManager?: CallbackManagerForToolRun): Promise<string>;
}
export declare class DynamicStructuredTool<T extends z.ZodObject<any, any, any, any> = z.ZodObject<any, any, any, any>> extends StructuredTool {
    name: string;
    description: string;
    func: DynamicStructuredToolInput["func"];
    schema: T;
    constructor(fields: DynamicStructuredToolInput<T>);
    protected _call(arg: z.output<T>, runManager?: CallbackManagerForToolRun): Promise<string>;
}
