import { GRAMMAR } from "./grammar/parser_grammar.js";
export class NodeHandler {
    constructor(parentHandler) {
        Object.defineProperty(this, "parentHandler", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: parentHandler
        });
    }
}
export class ASTParser {
    static async importASTParser() {
        try {
            if (!ASTParser.astParseInstance) {
                const { default: peggy } = await import("peggy");
                const parser = peggy.generate(GRAMMAR);
                const { parse } = parser;
                ASTParser.astParseInstance = parse;
            }
            return ASTParser.astParseInstance;
        }
        catch (e) {
            throw new Error(`Failed to import peggy. Please install peggy (i.e. "npm install peggy" or "yarn add peggy").`);
        }
    }
    static isProgram(node) {
        return node.type === "Program";
    }
    static isExpressionStatement(node) {
        return node.type === "ExpressionStatement";
    }
    static isCallExpression(node) {
        return node.type === "CallExpression";
    }
    static isStringLiteral(node) {
        return node.type === "StringLiteral" && typeof node.value === "string";
    }
    static isNumericLiteral(node) {
        return node.type === "NumericLiteral" && typeof node.value === "number";
    }
    static isBooleanLiteral(node) {
        return node.type === "BooleanLiteral" && typeof node.value === "boolean";
    }
    static isIdentifier(node) {
        return node.type === "Identifier";
    }
    static isObjectExpression(node) {
        return node.type === "ObjectExpression";
    }
    static isArrayExpression(node) {
        return node.type === "ArrayExpression";
    }
    static isPropertyAssignment(node) {
        return node.type === "PropertyAssignment";
    }
    static isMemberExpression(node) {
        return node.type === "MemberExpression";
    }
}
