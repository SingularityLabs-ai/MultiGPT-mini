import { Comparator, Comparison, Operation, Operator, StructuredQuery, Visitor, VisitorComparisonResult, VisitorOperationResult, VisitorStructuredQueryResult } from "../../chains/query_constructor/ir.js";
export type TranslatorOpts = {
    allowedOperators: Operator[];
    allowedComparators: Comparator[];
};
export declare abstract class BaseTranslator extends Visitor {
    abstract formatFunction(func: Operator | Comparator): string;
}
export declare class BasicTranslator extends BaseTranslator {
    VisitOperationOutput: VisitorOperationResult;
    VisitComparisonOutput: VisitorComparisonResult;
    VisitStructuredQueryOutput: VisitorStructuredQueryResult;
    allowedOperators: Operator[];
    allowedComparators: Comparator[];
    constructor(opts?: TranslatorOpts);
    formatFunction(func: Operator | Comparator): string;
    visitOperation(operation: Operation): this["VisitOperationOutput"];
    visitComparison(comparison: Comparison): this["VisitComparisonOutput"];
    visitStructuredQuery(query: StructuredQuery): this["VisitStructuredQueryOutput"];
}
