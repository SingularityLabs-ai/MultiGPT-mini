"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallExpressionHandler = void 0;
const base_js_1 = require("./base.cjs");
class CallExpressionHandler extends base_js_1.NodeHandler {
    async accepts(node) {
        if (base_js_1.ASTParser.isCallExpression(node)) {
            return node;
        }
        else {
            return false;
        }
    }
    async handle(node) {
        function checkCallExpressionArgumentType(arg) {
            return [
                base_js_1.ASTParser.isStringLiteral,
                base_js_1.ASTParser.isNumericLiteral,
                base_js_1.ASTParser.isBooleanLiteral,
                base_js_1.ASTParser.isArrayExpression,
                base_js_1.ASTParser.isObjectExpression,
                base_js_1.ASTParser.isCallExpression,
                base_js_1.ASTParser.isIdentifier,
            ].reduce((acc, func) => acc || func(arg), false);
        }
        if (this.parentHandler === undefined) {
            throw new Error("ArrayLiteralExpressionHandler must have a parent handler");
        }
        const { callee } = node;
        let funcCall;
        if (base_js_1.ASTParser.isIdentifier(callee)) {
            funcCall = callee.name.replace(/^["'](.+(?=["']$))["']$/, "$1");
        }
        else if (base_js_1.ASTParser.isMemberExpression(callee)) {
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
exports.CallExpressionHandler = CallExpressionHandler;
