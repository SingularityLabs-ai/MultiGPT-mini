"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayLiteralExpressionHandler = void 0;
const base_js_1 = require("./base.cjs");
class ArrayLiteralExpressionHandler extends base_js_1.NodeHandler {
    async accepts(node) {
        if (base_js_1.ASTParser.isArrayExpression(node)) {
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
            type: "array_literal",
            values: await Promise.all(node.elements.map((innerNode) => 
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.parentHandler.handle(innerNode))),
        };
    }
}
exports.ArrayLiteralExpressionHandler = ArrayLiteralExpressionHandler;
