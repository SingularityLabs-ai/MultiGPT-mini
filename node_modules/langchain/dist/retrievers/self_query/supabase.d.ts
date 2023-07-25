import { Comparator, Comparison, Operation, Operator, StructuredQuery } from "../../chains/query_constructor/ir.js";
import { SupabaseFilterRPCCall } from "../../vectorstores/supabase.js";
import { BaseTranslator } from "./base.js";
type ValueType = {
    eq: string | number;
    ne: string | number;
    lt: string | number;
    lte: string | number;
    gt: string | number;
    gte: string | number;
};
export declare class SupabaseTranslator extends BaseTranslator {
    VisitOperationOutput: SupabaseFilterRPCCall;
    VisitComparisonOutput: SupabaseFilterRPCCall;
    VisitStructuredQueryOutput: {
        filter: SupabaseFilterRPCCall;
    };
    allowedOperators: Operator[];
    allowedComparators: Comparator[];
    formatFunction(): string;
    getComparatorFunction<C extends Comparator>(comparator: Comparator): (attr: string, value: ValueType[C]) => SupabaseFilterRPCCall;
    buildColumnName(attr: string, value: string | number, includeType?: boolean): string;
    visitOperationAsString(operation: Operation): string;
    visitOperation(operation: Operation): this["VisitOperationOutput"];
    visitComparisonAsString(comparison: Comparison): string;
    visitComparison(comparison: Comparison): this["VisitComparisonOutput"];
    visitStructuredQuery(query: StructuredQuery): this["VisitStructuredQueryOutput"];
}
export {};
