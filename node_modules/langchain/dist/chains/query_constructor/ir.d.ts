export type AND = "and";
export type OR = "or";
export type NOT = "not";
export type Operator = AND | OR | NOT;
export type EQ = "eq";
export type NE = "ne";
export type LT = "lt";
export type GT = "gt";
export type LTE = "lte";
export type GTE = "gte";
export type Comparator = EQ | NE | LT | GT | LTE | GTE;
export declare const Operators: {
    [key: string]: Operator;
};
export declare const Comparators: {
    [key: string]: Comparator;
};
export type VisitorResult = VisitorOperationResult | VisitorComparisonResult | VisitorStructuredQueryResult;
export type VisitorOperationResult = {
    [operator: string]: VisitorResult[];
};
export type VisitorComparisonResult = {
    [attr: string]: {
        [comparator: string]: string | number;
    };
};
export type VisitorStructuredQueryResult = {
    filter?: VisitorStructuredQueryResult | VisitorComparisonResult | VisitorOperationResult;
};
export declare abstract class Visitor {
    VisitOperationOutput: object;
    VisitComparisonOutput: object;
    VisitStructuredQueryOutput: {
        filter?: object;
    };
    abstract allowedOperators: Operator[];
    abstract allowedComparators: Comparator[];
    abstract visitOperation(operation: Operation): this["VisitOperationOutput"];
    abstract visitComparison(comparison: Comparison): this["VisitComparisonOutput"];
    abstract visitStructuredQuery(structuredQuery: StructuredQuery): this["VisitStructuredQueryOutput"];
}
export declare abstract class Expression {
    abstract exprName: "Operation" | "Comparison" | "StructuredQuery";
    accept(visitor: Visitor): object;
}
export declare abstract class FilterDirective extends Expression {
}
export declare class Comparison extends FilterDirective {
    comparator: Comparator;
    attribute: string;
    value: string | number;
    exprName: "Comparison";
    constructor(comparator: Comparator, attribute: string, value: string | number);
}
export declare class Operation extends FilterDirective {
    operator: Operator;
    args?: FilterDirective[] | undefined;
    exprName: "Operation";
    constructor(operator: Operator, args?: FilterDirective[] | undefined);
}
export declare class StructuredQuery extends Expression {
    query: string;
    filter?: FilterDirective | undefined;
    exprName: "StructuredQuery";
    constructor(query: string, filter?: FilterDirective | undefined);
}
