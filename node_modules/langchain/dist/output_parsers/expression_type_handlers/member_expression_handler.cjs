"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberExpressionHandler = void 0;
const base_js_1 = require("./base.cjs");
class MemberExpressionHandler extends base_js_1.NodeHandler {
    async accepts(node) {
        if (base_js_1.ASTParser.isMemberExpression(node)) {
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
        const { object, property } = node;
        let prop;
        if (base_js_1.ASTParser.isIdentifier(property)) {
            prop = property.name.replace(/^["'](.+(?=["']$))["']$/, "$1");
        }
        else if (base_js_1.ASTParser.isStringLiteral(property)) {
            prop = `${property.value}`.replace(/^["'](.+(?=["']$))["']$/, "$1");
        }
        else {
            throw new Error("Invalid property key type");
        }
        let identifier;
        if (base_js_1.ASTParser.isIdentifier(object)) {
            identifier = object.name.replace(/^["'](.+(?=["']$))["']$/, "$1");
        }
        else if (base_js_1.ASTParser.isStringLiteral(object)) {
            identifier = `${object.value}`.replace(/^["'](.+(?=["']$))["']$/, "$1");
        }
        else {
            throw new Error("Invalid object type");
        }
        if (object.type !== "Identifier" && object.type !== "StringLiteral") {
            throw new Error("ArrayExpression is not supported");
        }
        return { type: "member_expression", identifier, property: prop };
    }
}
exports.MemberExpressionHandler = MemberExpressionHandler;
