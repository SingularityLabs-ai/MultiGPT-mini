import { Tool } from "./base.js";
import { LLMChain } from "../chains/llm_chain.js";
import type { SqlDatabase } from "../sql_db.js";
import { BaseLanguageModel } from "../base_language/index.js";
interface SqlTool {
    db: SqlDatabase;
}
export declare class QuerySqlTool extends Tool implements SqlTool {
    name: string;
    db: SqlDatabase;
    constructor(db: SqlDatabase);
    /** @ignore */
    _call(input: string): Promise<string>;
    description: string;
}
export declare class InfoSqlTool extends Tool implements SqlTool {
    name: string;
    db: SqlDatabase;
    constructor(db: SqlDatabase);
    /** @ignore */
    _call(input: string): Promise<string>;
    description: string;
}
export declare class ListTablesSqlTool extends Tool implements SqlTool {
    name: string;
    db: SqlDatabase;
    constructor(db: SqlDatabase);
    /** @ignore */
    _call(_: string): Promise<string>;
    description: string;
}
type QueryCheckerToolArgs = {
    llmChain?: LLMChain;
    llm?: BaseLanguageModel;
    _chainType?: never;
};
export declare class QueryCheckerTool extends Tool {
    name: string;
    template: string;
    llmChain: LLMChain;
    constructor(llmChainOrOptions?: LLMChain | QueryCheckerToolArgs);
    /** @ignore */
    _call(input: string): Promise<string>;
    description: string;
}
export {};
