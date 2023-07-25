import { Comparators, Operators, } from "../../chains/query_constructor/ir.js";
import { BaseTranslator } from "./base.js";
export class FunctionalTranslator extends BaseTranslator {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "allowedOperators", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [Operators.and, Operators.or]
        });
        Object.defineProperty(this, "allowedComparators", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                Comparators.eq,
                Comparators.ne,
                Comparators.gt,
                Comparators.gte,
                Comparators.lt,
                Comparators.lte,
            ]
        });
    }
    formatFunction() {
        throw new Error("Not implemented");
    }
    getComparatorFunction(comparator) {
        switch (comparator) {
            case Comparators.eq: {
                return (a, b) => a === b;
            }
            case Comparators.ne: {
                return (a, b) => a !== b;
            }
            case Comparators.gt: {
                return (a, b) => a > b;
            }
            case Comparators.gte: {
                return (a, b) => a >= b;
            }
            case Comparators.lt: {
                return (a, b) => a < b;
            }
            case Comparators.lte: {
                return (a, b) => a <= b;
            }
            default: {
                throw new Error("Unknown comparator");
            }
        }
    }
    getOperatorFunction(operator) {
        switch (operator) {
            case Operators.and: {
                return (a, b) => a && b;
            }
            case Operators.or: {
                return (a, b) => a || b;
            }
            default: {
                throw new Error("Unknown operator");
            }
        }
    }
    visitOperation(operation) {
        const { operator, args } = operation;
        if (this.allowedOperators.includes(operator)) {
            const operatorFunction = this.getOperatorFunction(operator);
            return (document) => {
                if (!args) {
                    return true;
                }
                return args.reduce((acc, arg) => {
                    const result = arg.accept(this);
                    if (typeof result === "function") {
                        return operatorFunction(acc, result(document));
                    }
                    else {
                        throw new Error("Filter is not a function");
                    }
                }, true);
            };
        }
        else {
            throw new Error("Operator not allowed");
        }
    }
    visitComparison(comparison) {
        const { comparator, attribute, value } = comparison;
        const undefinedTrue = [Comparators.ne];
        if (this.allowedComparators.includes(comparator)) {
            const comparatorFunction = this.getComparatorFunction(comparator);
            return (document) => {
                const documentValue = document.metadata[attribute];
                if (documentValue === undefined) {
                    if (undefinedTrue.includes(comparator)) {
                        return true;
                    }
                    return false;
                }
                return comparatorFunction(documentValue, value);
            };
        }
        else {
            throw new Error("Comparator not allowed");
        }
    }
    visitStructuredQuery(query) {
        const filterFunction = query.filter?.accept(this);
        if (typeof filterFunction !== "function") {
            throw new Error("Structured query filter is not a function");
        }
        return { filter: filterFunction };
    }
}
