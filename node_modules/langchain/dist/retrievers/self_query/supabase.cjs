"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseTranslator = void 0;
const ir_js_1 = require("../../chains/query_constructor/ir.cjs");
const base_js_1 = require("./base.cjs");
class SupabaseTranslator extends base_js_1.BaseTranslator {
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
                return (attr, value) => (rpc) => rpc.eq(this.buildColumnName(attr, value), value);
            }
            case ir_js_1.Comparators.ne: {
                return (attr, value) => (rpc) => rpc.neq(this.buildColumnName(attr, value), value);
            }
            case ir_js_1.Comparators.gt: {
                return (attr, value) => (rpc) => rpc.gt(this.buildColumnName(attr, value), value);
            }
            case ir_js_1.Comparators.gte: {
                return (attr, value) => (rpc) => rpc.gte(this.buildColumnName(attr, value), value);
            }
            case ir_js_1.Comparators.lt: {
                return (attr, value) => (rpc) => rpc.lt(this.buildColumnName(attr, value), value);
            }
            case ir_js_1.Comparators.lte: {
                return (attr, value) => (rpc) => rpc.lte(this.buildColumnName(attr, value), value);
            }
            default: {
                throw new Error("Unknown comparator");
            }
        }
    }
    buildColumnName(attr, value, includeType = true) {
        let column = "";
        if (typeof value === "string") {
            column = `metadata->>${attr}`;
        }
        else if (typeof value === "number") {
            column = `metadata->${attr}${includeType ? "::int" : ""}`;
        }
        else {
            throw new Error("Data type not supported");
        }
        return column;
    }
    visitOperationAsString(operation) {
        const { args } = operation;
        if (!args) {
            return "";
        }
        return args
            ?.reduce((acc, arg) => {
            if (arg.exprName === "Comparison") {
                acc.push(this.visitComparisonAsString(arg));
            }
            else if (arg.exprName === "Operation") {
                const { operator: innerOperator } = arg;
                acc.push(`${innerOperator}(${this.visitOperationAsString(arg)})`);
            }
            return acc;
        }, [])
            .join(",");
    }
    visitOperation(operation) {
        const { operator, args } = operation;
        if (this.allowedOperators.includes(operator)) {
            if (operator === ir_js_1.Operators.and) {
                if (!args) {
                    return (rpc) => rpc;
                }
                const filter = (rpc) => args.reduce((acc, arg) => {
                    const filter = arg.accept(this);
                    return filter(acc);
                }, rpc);
                return filter;
            }
            else if (operator === ir_js_1.Operators.or) {
                return (rpc) => rpc.or(this.visitOperationAsString(operation));
            }
            else {
                throw new Error("Unknown operator");
            }
        }
        else {
            throw new Error("Operator not allowed");
        }
    }
    visitComparisonAsString(comparison) {
        let { value } = comparison;
        const { comparator: _comparator, attribute } = comparison;
        let comparator = _comparator;
        if (comparator === ir_js_1.Comparators.ne) {
            comparator = "neq";
        }
        if (Array.isArray(value)) {
            value = `(${value
                .map((v) => {
                if (typeof v === "string" && /[,()]/.test(v))
                    return `"${v}"`;
                return v;
            })
                .join(",")})`;
        }
        return `${this.buildColumnName(attribute, value, false)}.${comparator}.${value}}`;
    }
    visitComparison(comparison) {
        const { comparator, attribute, value } = comparison;
        if (this.allowedComparators.includes(comparator)) {
            const comparatorFunction = this.getComparatorFunction(comparator);
            return comparatorFunction(attribute, value);
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
exports.SupabaseTranslator = SupabaseTranslator;
