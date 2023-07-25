"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicTranslator = exports.BaseTranslator = void 0;
const ir_js_1 = require("../../chains/query_constructor/ir.cjs");
class BaseTranslator extends ir_js_1.Visitor {
}
exports.BaseTranslator = BaseTranslator;
class BasicTranslator extends BaseTranslator {
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
            ir_js_1.Operators.and,
            ir_js_1.Operators.or,
        ];
        this.allowedComparators = opts?.allowedComparators ?? [
            ir_js_1.Comparators.eq,
            ir_js_1.Comparators.ne,
            ir_js_1.Comparators.gt,
            ir_js_1.Comparators.gte,
            ir_js_1.Comparators.lt,
            ir_js_1.Comparators.lte,
        ];
    }
    formatFunction(func) {
        if (func in ir_js_1.Comparators) {
            if (this.allowedComparators.length > 0 &&
                this.allowedComparators.indexOf(func) === -1) {
                throw new Error(`Comparator ${func} not allowed. Allowed operators: ${this.allowedComparators.join(", ")}`);
            }
        }
        else if (func in ir_js_1.Operators) {
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
exports.BasicTranslator = BasicTranslator;
