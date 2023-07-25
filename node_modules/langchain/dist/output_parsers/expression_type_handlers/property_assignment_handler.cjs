"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyAssignmentHandler = void 0;
const base_js_1 = require("./base.cjs");
class PropertyAssignmentHandler extends base_js_1.NodeHandler {
    async accepts(node) {
        if (base_js_1.ASTParser.isPropertyAssignment(node)) {
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
        let name;
        if (base_js_1.ASTParser.isIdentifier(node.key)) {
            name = node.key.name;
        }
        else if (base_js_1.ASTParser.isStringLiteral(node.key)) {
            name = node.key.value;
        }
        else {
            throw new Error("Invalid property key type");
        }
        if (!name) {
            throw new Error("Invalid property key");
        }
        const identifier = `${name}`.replace(/^["'](.+(?=["']$))["']$/, "$1");
        const value = await this.parentHandler.handle(node.value);
        return { type: "property_assignment", identifier, value };
    }
}
exports.PropertyAssignmentHandler = PropertyAssignmentHandler;
