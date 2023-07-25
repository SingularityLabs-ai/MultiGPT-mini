"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringLiteralHandler = void 0;
const base_js_1 = require("./base.cjs");
class StringLiteralHandler extends base_js_1.NodeHandler {
    async accepts(node) {
        if (base_js_1.ASTParser.isStringLiteral(node)) {
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
        const text = `${node.value}`.replace(/^["'](.+(?=["']$))["']$/, "$1");
        return { type: "string_literal", value: text };
    }
}
exports.StringLiteralHandler = StringLiteralHandler;
