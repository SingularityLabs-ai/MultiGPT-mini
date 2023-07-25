import { NodeHandler, ASTParser } from "./base.js";
import { PropertyAssignmentHandler } from "./property_assignment_handler.js";
export class ObjectLiteralExpressionHandler extends NodeHandler {
    async accepts(node) {
        if (ASTParser.isObjectExpression(node)) {
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
            if (ASTParser.isPropertyAssignment(property)) {
                values.push(await new PropertyAssignmentHandler(this.parentHandler).handle(property));
            }
        }
        return { type: "object_literal", values };
    }
}
