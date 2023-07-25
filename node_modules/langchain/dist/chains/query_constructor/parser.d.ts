import { Comparator, Comparison, Operation, Operator } from "./ir.js";
export type TraverseType = boolean | Operation | Comparison | string | number | {
    [key: string]: TraverseType;
} | TraverseType[];
export declare class QueryTransformer {
    allowedComparators: Comparator[];
    allowedOperators: Operator[];
    constructor(allowedComparators?: Comparator[], allowedOperators?: Operator[]);
    private matchFunctionName;
    private transform;
    parse(expression: string): Promise<Operation | Comparison>;
}
