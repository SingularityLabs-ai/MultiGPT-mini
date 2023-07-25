import { NodeHandler, ASTParser } from "./base.js";
export class NumericLiteralHandler extends NodeHandler {
    async accepts(node) {
        if (ASTParser.isNumericLiteral(node)) {
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
