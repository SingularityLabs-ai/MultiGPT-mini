"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectLiteralExpressionHandler = void 0;
const base_js_1 = require("./base.cjs");
const property_assignment_handler_js_1 = require("./property_assignment_handler.cjs");
class ObjectLiteralExpressionHandler extends base_js_1.NodeHandler {
    async accepts(node) {
        if (base_js_1.ASTParser.isObjectExpression(node)) {
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
        const values = [];
        const { properties } = node;
        for (const property of properties) {
            if (base_js_1.ASTParser.isPropertyAssignment(property)) {
                values.push(await new property_assignment_handler_js_1.PropertyAssignmentHandler(this.parentHandler).handle(property));
            }
        }
        return { type: "object_literal", values };
    }
}
exports.ObjectLiteralExpressionHandler = ObjectLiteralExpressionHandler;
