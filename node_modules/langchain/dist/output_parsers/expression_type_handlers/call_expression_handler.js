import { NodeHandler, ASTParser } from "./base.js";
export class CallExpressionHandler extends NodeHandler {
    async accepts(node) {
        if (ASTParser.isCallExpression(node)) {
            return node;
        }
        else {
            return false;
        }
    }
    async handle(node) {
        function checkCallExpressionArgumentType(arg) {
            return [
                ASTParser.isStringLiteral,
                ASTParser.isNumericLiteral,
                ASTParser.isBooleanLiteral,
                ASTParser.isArrayExpression,
                ASTParser.isObjectExpression,
                ASTParser.isCallExpression,
                ASTParser.isIdentifier,
            ].reduce((acc, func) => acc || func(arg), false);
        }
        if (this.parentHandler === undefined) {
            throw new Error("ArrayLiteralExpressionHandler must have a parent handler");
        }
        const { callee } = node;
        let funcCall;
        if (ASTParser.isIdentifier(callee)) {
            funcCall = callee.name.replace(/^["'](.+(?=["']$))["']$/, "$1");
        }
        else if (ASTParser.isMemberExpression(callee)) {
            funcCall = (await this.parentHandler.handle(callee));
        }
        else {
            throw new Error("Unknown expression type");
        }
        const args = await Promise.all(node.arguments.map((arg) => {
            if (!checkCallExpressionArgumentType(arg)) {
                throw new Error("Unknown argument type");
            }
            if (!this.parentHandler) {
                throw new Error("CallExpressionHandler must have a parent handler");
            }
            return this.parentHandler.handle(arg);
        }));
        return { type: "call_expression", funcCall, args };
    }
}
