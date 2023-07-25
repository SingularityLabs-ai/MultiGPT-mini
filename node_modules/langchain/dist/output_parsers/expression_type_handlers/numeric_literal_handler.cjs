"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumericLiteralHandler = void 0;
const base_js_1 = require("./base.cjs");
class NumericLiteralHandler extends base_js_1.NodeHandler {
    async accepts(node) {
        if (base_js_1.ASTParser.isNumericLiteral(node)) {
            return node;
        }
        else {
            return false;
        }
    }
    async handle(node) {
        if (!this.parentHandler) {
            throw new Error("ArrayLiteralExpressionHandler must have a parent handler");
        }
        return {
            type: "numeric_literal",
            value: Number(node.value),
        };
    }
}
exports.NumericLiteralHandler = NumericLiteralHandler;
