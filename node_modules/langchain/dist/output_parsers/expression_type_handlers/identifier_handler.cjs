"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentifierHandler = void 0;
const base_js_1 = require("./base.cjs");
class IdentifierHandler extends base_js_1.NodeHandler {
    async accepts(node) {
        if (base_js_1.ASTParser.isIdentifier(node)) {
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
        const text = node.name.replace(/^["'](.+(?=["']$))["']$/, "$1");
        return { type: "identifier", value: text };
    }
}
exports.IdentifierHandler = IdentifierHandler;
