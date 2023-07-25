export const Operators = {
    and: "and",
    or: "or",
    not: "not",
};
export const Comparators = {
    eq: "eq",
    ne: "ne",
    lt: "lt",
    gt: "gt",
    lte: "lte",
    gte: "gte",
};
export class Visitor {
}
export class Expression {
    accept(visitor) {
        if (this.exprName === "Operation") {
            return visitor.visitOperation(this);
        }
        else if (this.exprName === "Comparison") {
            return visitor.visitComparison(this);
        }
        else if (this.exprName === "StructuredQuery") {
            return visitor.visitStructuredQuery(this);
        }
        else {
            throw new Error("Unknown Expression type");
        }
    }
}
export class FilterDirective extends Expression {
}
export class Comparison extends FilterDirective {
    constructor(comparator, attribute, value) {
        super();
        Object.defineProperty(this, "comparator", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: comparator
        });
        Object.defineProperty(this, "attribute", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: attribute
        });
        Object.defineProperty(this, "value", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: value
        });
        Object.defineProperty(this, "exprName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Comparison"
        });
    }
}
export class Operation extends FilterDirective {
    constructor(operator, args) {
        super();
        Object.defineProperty(this, "operator", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: operator
        });
        Object.defineProperty(this, "args", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: args
        });
        Object.defineProperty(this, "exprName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Operation"
        });
    }
}
export class StructuredQuery extends Expression {
    constructor(query, filter) {
        super();
        Object.defineProperty(this, "query", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: query
        });
        Object.defineProperty(this, "filter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: filter
        });
        Object.defineProperty(this, "exprName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "StructuredQuery"
        });
    }
}
