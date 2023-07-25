import { NodeHandler, ASTParser } from "./base.js";
export class MemberExpressionHandler extends NodeHandler {
    async accepts(node) {
        if (ASTParser.isMemberExpression(node)) {
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
        if (ASTParser.isIdentifier(property)) {
            prop = property.name.replace(/^["'](.+(?=["']$))["']$/, "$1");
        }
        else if (ASTParser.isStringLiteral(property)) {
            prop = `${property.value}`.replace(/^["'](.+(?=["']$))["']$/, "$1");
        }
        else {
            throw new Error("Invalid property key type");
        }
        let identifier;
        if (ASTParser.isIdentifier(object)) {
            identifier = object.name.replace(/^["'](.+(?=["']$))["']$/, "$1");
        }
        else if (ASTParser.isStringLiteral(object)) {
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
