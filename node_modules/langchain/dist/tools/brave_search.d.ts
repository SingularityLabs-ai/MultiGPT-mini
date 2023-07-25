import { Tool } from "./base.js";
export interface BraveSearchParams {
    apiKey?: string;
}
export declare class BraveSearch extends Tool {
    name: string;
    description: string;
    apiKey: string;
    constructor(fields?: BraveSearchParams);
    /** @ignore */
    _call(input: string): Promise<string>;
}
