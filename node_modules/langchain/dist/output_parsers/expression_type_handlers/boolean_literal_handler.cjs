"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanLiteralHandler = void 0;
const base_js_1 = require("./base.cjs");
class BooleanLiteralHandler extends base_js_1.NodeHandler {
    async accepts(node) {
        if (base_js_1.ASTParser.isBooleanLiteral(node)) {
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
            type: "boolean_literal",
            value: node.value,
        };
    }
}
exports.BooleanLiteralHandler = BooleanLiteralHandler;
