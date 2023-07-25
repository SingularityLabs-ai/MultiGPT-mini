"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionalTranslator = void 0;
const ir_js_1 = require("../../chains/query_constructor/ir.cjs");
const base_js_1 = require("./base.cjs");
class FunctionalTranslator extends base_js_1.BaseTranslator {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "allowedOperators", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [ir_js_1.Operators.and, ir_js_1.Operators.or]
        });
        Object.defineProperty(this, "allowedComparators", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                ir_js_1.Comparators.eq,
                ir_js_1.Comparators.ne,
                ir_js_1.Comparators.gt,
                ir_js_1.Comparators.gte,
                ir_js_1.Comparators.lt,
                ir_js_1.Comparators.lte,
            ]
        });
    }
    formatFunction() {
        throw new Error("Not implemented");
    }
    getComparatorFunction(comparator) {
        switch (comparator) {
            case ir_js_1.Comparators.eq: {
                return (a, b) => a === b;
            }
            case ir_js_1.Comparators.ne: {
                return (a, b) => a !== b;
            }
            case ir_js_1.Comparators.gt: {
                return (a, b) => a > b;
            }
            case ir_js_1.Comparators.gte: {
                return (a, b) => a >= b;
            }
            case ir_js_1.Comparators.lt: {
                return (a, b) => a < b;
            }
            case ir_js_1.Comparators.lte: {
                return (a, b) => a <= b;
            }
            default: {
                throw new Error("Unknown comparator");
            }
        }
    }
    getOperatorFunction(operator) {
        switch (operator) {
            case ir_js_1.Operators.and: {
                return (a, b) => a && b;
            }
            case ir_js_1.Operators.or: {
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
        const undefinedTrue = [ir_js_1.Comparators.ne];
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
exports.FunctionalTranslator = FunctionalTranslator;
