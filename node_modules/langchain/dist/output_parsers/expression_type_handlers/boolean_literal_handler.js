import { NodeHandler, ASTParser } from "./base.js";
export class BooleanLiteralHandler extends NodeHandler {
    async accepts(node) {
        if (ASTParser.isBooleanLiteral(node)) {
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
