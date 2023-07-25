import { z } from "zod";
import { QueryTransformer, TraverseType } from "./parser.js";
import { Comparator, Operator, StructuredQuery } from "./ir.js";
import { InputValues } from "../../schema/index.js";
import { DEFAULT_EXAMPLES, DEFAULT_PREFIX, DEFAULT_SCHEMA, DEFAULT_SUFFIX, EXAMPLE_PROMPT } from "./prompt.js";
import { LLMChain } from "../llm_chain.js";
import { BaseLanguageModel } from "../../base_language/index.js";
import { AsymmetricStructuredOutputParser } from "../../output_parsers/structured.js";
import { AttributeInfo } from "../../schema/query_constructor.js";
export { QueryTransformer, TraverseType };
export { DEFAULT_EXAMPLES, DEFAULT_PREFIX, DEFAULT_SCHEMA, DEFAULT_SUFFIX, EXAMPLE_PROMPT, };
declare const queryInputSchema: z.ZodObject<{
    query: z.ZodString;
    filter: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    query: string;
    filter?: string | undefined;
}, {
    query: string;
    filter?: string | undefined;
}>;
export declare class StructuredQueryOutputParser extends AsymmetricStructuredOutputParser<typeof queryInputSchema, StructuredQuery> {
    private parserFunction;
    constructor(parserFunction: (query: string, filter?: string) => Promise<StructuredQuery>);
    outputProcessor(input: z.infer<typeof queryInputSchema>): Promise<StructuredQuery>;
    static fromComponents(allowedComparators?: Comparator[], allowedOperators?: Operator[]): StructuredQueryOutputParser;
}
export declare function formatAttributeInfo(info: AttributeInfo[]): string;
export type QueryConstructorChainOptions = {
    llm: BaseLanguageModel;
    documentContents: string;
    attributeInfo: AttributeInfo[];
    examples?: InputValues[];
    allowedComparators?: Comparator[];
    allowedOperators?: Operator[];
};
export declare function loadQueryConstructorChain(opts: QueryConstructorChainOptions): LLMChain<string>;
