import { Tool } from "./base.js";
export interface GoogleCustomSearchParams {
    apiKey?: string;
    googleCSEId?: string;
}
export declare class GoogleCustomSearch extends Tool {
    name: string;
    protected apiKey: string;
    protected googleCSEId: string;
    description: string;
    constructor(fields?: GoogleCustomSearchParams);
    _call(input: string): Promise<string>;
}
