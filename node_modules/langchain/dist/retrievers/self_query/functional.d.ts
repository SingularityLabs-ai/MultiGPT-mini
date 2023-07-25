import { Comparator, Comparison, Operation, Operator, StructuredQuery } from "../../chains/query_constructor/ir.js";
import { Document } from "../../document.js";
import { BaseTranslator } from "./base.js";
type ValueType = {
    eq: string | number;
    ne: string | number;
    lt: string | number;
    lte: string | number;
    gt: string | number;
    gte: string | number;
};
export type FunctionFilter = (document: Document) => boolean;
export declare class FunctionalTranslator extends BaseTranslator {
    VisitOperationOutput: FunctionFilter;
    VisitComparisonOutput: FunctionFilter;
    VisitStructuredQueryOutput: {
        filter: FunctionFilter;
    };
    allowedOperators: Operator[];
    allowedComparators: Comparator[];
    formatFunction(): string;
    getComparatorFunction<C extends Comparator>(comparator: Comparator): (a: string | number, b: ValueType[C]) => boolean;
    getOperatorFunction(operator: Operator): (a: boolean, b: boolean) => boolean;
    visitOperation(operation: Operation): this["VisitOperationOutput"];
    visitComparison(comparison: Comparison): this["VisitComparisonOutput"];
    visitStructuredQuery(query: StructuredQuery): this["VisitStructuredQueryOutput"];
}
export {};
