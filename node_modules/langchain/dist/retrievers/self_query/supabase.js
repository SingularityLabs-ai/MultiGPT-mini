import { Comparators, Operators, } from "../../chains/query_constructor/ir.js";
import { BaseTranslator } from "./base.js";
export class SupabaseTranslator extends BaseTranslator {
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
                return (attr, value) => (rpc) => rpc.eq(this.buildColumnName(attr, value), value);
            }
            case Comparators.ne: {
                return (attr, value) => (rpc) => rpc.neq(this.buildColumnName(attr, value), value);
            }
            case Comparators.gt: {
                return (attr, value) => (rpc) => rpc.gt(this.buildColumnName(attr, value), value);
            }
            case Comparators.gte: {
                return (attr, value) => (rpc) => rpc.gte(this.buildColumnName(attr, value), value);
            }
            case Comparators.lt: {
                return (attr, value) => (rpc) => rpc.lt(this.buildColumnName(attr, value), value);
            }
            case Comparators.lte: {
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
            if (operator === Operators.and) {
                if (!args) {
                    return (rpc) => rpc;
                }
                const filter = (rpc) => args.reduce((acc, arg) => {
                    const filter = arg.accept(this);
                    return filter(acc);
                }, rpc);
                return filter;
            }
            else if (operator === Operators.or) {
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
        if (comparator === Comparators.ne) {
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
