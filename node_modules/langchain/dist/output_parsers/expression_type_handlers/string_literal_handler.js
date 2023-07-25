import { NodeHandler, ASTParser } from "./base.js";
export class StringLiteralHandler extends NodeHandler {
    async accepts(node) {
        if (ASTParser.isStringLiteral(node)) {
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
