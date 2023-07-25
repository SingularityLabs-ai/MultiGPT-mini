import { Comparators, Comparison, Operation, Operators, } from "./ir.js";
import { ExpressionParser, } from "../../output_parsers/expression.js";
export class QueryTransformer {
    constructor(allowedComparators = [], allowedOperators = []) {
        Object.defineProperty(this, "allowedComparators", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: allowedComparators
        });
        Object.defineProperty(this, "allowedOperators", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: allowedOperators
        });
    }
    matchFunctionName(funcName) {
        if (funcName in Comparators) {
            if (this.allowedComparators.length > 0) {
                if (this.allowedComparators.includes(funcName)) {
                    return funcName;
                }
                else {
                    throw new Error("Received comparator not allowed");
                }
            }
            else {
                return funcName;
            }
        }
        if (funcName in Operators) {
            if (this.allowedOperators.length > 0) {
                if (this.allowedOperators.includes(funcName)) {
                    return funcName;
                }
                else {
                    throw new Error("Received operator not allowed");
                }
            }
            else {
                return funcName;
            }
        }
        throw new Error("Unknown function name");
    }
    transform(parsed) {
        const traverse = (node) => {
            switch (node.type) {
                case "call_expression": {
                    if (typeof node.funcCall !== "string") {
                        throw new Error("Property access expression and element access expression not supported");
                    }
                    const funcName = this.matchFunctionName(node.funcCall);
                    if (funcName in Operators) {
                        return new Operation(funcName, node.args?.map((arg) => traverse(arg)));
                    }
                    if (funcName in Comparators) {
                        if (node.args && node.args.length === 2) {
                            return new Comparison(funcName, traverse(node.args[0]), traverse(node.args[1]));
                        }
                        throw new Error("Comparator must have exactly 2 arguments");
                    }
                    throw new Error("Function name neither operator nor comparator");
                }
                case "string_literal": {
                    return node.value;
                }
                case "numeric_literal": {
                    return node.value;
                }
                case "array_literal": {
                    return node.values.map((value) => traverse(value));
                }
                case "object_literal": {
                    return node.values.reduce((acc, value) => {
                        acc[value.identifier] = traverse(value.value);
                        return acc;
                    }, {});
                }
                case "boolean_literal": {
                    return node.value;
                }
                default: {
                    throw new Error("Unknown node type");
                }
            }
        };
        return traverse(parsed);
    }
    async parse(expression) {
        const expressionParser = new ExpressionParser();
        const parsed = (await expressionParser.parse(expression));
        if (!parsed) {
            throw new Error("Could not parse expression");
        }
        return this.transform(parsed);
    }
}
