import { NodeHandler } from "./base.js";
import { ArrayLiteralExpressionHandler } from "./array_literal_expression_handler.js";
import { BooleanLiteralHandler } from "./boolean_literal_handler.js";
import { CallExpressionHandler } from "./call_expression_handler.js";
import { NumericLiteralHandler } from "./numeric_literal_handler.js";
import { ObjectLiteralExpressionHandler } from "./object_literal_expression_handler.js";
import { PropertyAssignmentHandler } from "./property_assignment_handler.js";
import { StringLiteralHandler } from "./string_literal_handler.js";
import { IdentifierHandler } from "./identifier_handler.js";
import { MemberExpressionHandler } from "./member_expression_handler.js";
const handlers = [
    ArrayLiteralExpressionHandler,
    BooleanLiteralHandler,
    CallExpressionHandler,
    NumericLiteralHandler,
    ObjectLiteralExpressionHandler,
    MemberExpressionHandler,
    PropertyAssignmentHandler,
    StringLiteralHandler,
    IdentifierHandler,
];
export class MasterHandler extends NodeHandler {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "nodeHandlers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
    }
    async accepts(node) {
        throw new Error(`Master handler does not accept any nodes: ${node}`);
    }
    async handle(node) {
        for (const handler of this.nodeHandlers) {
            const accepts = await handler.accepts(node);
            if (accepts) {
                return handler.handle(node);
            }
        }
        throw new Error(`No handler found for node: ${node}`);
    }
    static createMasterHandler() {
        const masterHandler = new MasterHandler();
        handlers.forEach((Handler) => {
            const handlerInstance = new Handler(masterHandler);
            masterHandler.nodeHandlers.push(handlerInstance);
        });
        return masterHandler;
    }
}
