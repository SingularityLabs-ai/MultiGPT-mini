import { Comparators, Operators, Visitor, } from "../../chains/query_constructor/ir.js";
export class BaseTranslator extends Visitor {
}
export class BasicTranslator extends BaseTranslator {
    constructor(opts) {
        super();
        Object.defineProperty(this, "allowedOperators", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "allowedComparators", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.allowedOperators = opts?.allowedOperators ?? [
            Operators.and,
            Operators.or,
        ];
        this.allowedComparators = opts?.allowedComparators ?? [
            Comparators.eq,
            Comparators.ne,
            Comparators.gt,
            Comparators.gte,
            Comparators.lt,
            Comparators.lte,
        ];
    }
    formatFunction(func) {
        if (func in Comparators) {
            if (this.allowedComparators.length > 0 &&
                this.allowedComparators.indexOf(func) === -1) {
                throw new Error(`Comparator ${func} not allowed. Allowed operators: ${this.allowedComparators.join(", ")}`);
            }
        }
        else if (func in Operators) {
            if (this.allowedOperators.length > 0 &&
                this.allowedOperators.indexOf(func) === -1) {
                throw new Error(`Operator ${func} not allowed. Allowed operators: ${this.allowedOperators.join(", ")}`);
            }
        }
        else {
            throw new Error("Unknown comparator or operator");
        }
        return `$${func}`;
    }
    visitOperation(operation) {
        const args = operation.args?.map((arg) => arg.accept(this));
        return {
            [this.formatFunction(operation.operator)]: args,
        };
    }
    visitComparison(comparison) {
        return {
            [comparison.attribute]: {
                [this.formatFunction(comparison.comparator)]: comparison.value,
            },
        };
    }
    visitStructuredQuery(query) {
        let nextArg = {};
        if (query.filter) {
            nextArg = {
                filter: query.filter.accept(this),
            };
        }
        return nextArg;
    }
}
