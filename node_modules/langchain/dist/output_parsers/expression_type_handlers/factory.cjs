"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterHandler = void 0;
const base_js_1 = require("./base.cjs");
const array_literal_expression_handler_js_1 = require("./array_literal_expression_handler.cjs");
const boolean_literal_handler_js_1 = require("./boolean_literal_handler.cjs");
const call_expression_handler_js_1 = require("./call_expression_handler.cjs");
const numeric_literal_handler_js_1 = require("./numeric_literal_handler.cjs");
const object_literal_expression_handler_js_1 = require("./object_literal_expression_handler.cjs");
const property_assignment_handler_js_1 = require("./property_assignment_handler.cjs");
const string_literal_handler_js_1 = require("./string_literal_handler.cjs");
const identifier_handler_js_1 = require("./identifier_handler.cjs");
const member_expression_handler_js_1 = require("./member_expression_handler.cjs");
const handlers = [
    array_literal_expression_handler_js_1.ArrayLiteralExpressionHandler,
    boolean_literal_handler_js_1.BooleanLiteralHandler,
    call_expression_handler_js_1.CallExpressionHandler,
    numeric_literal_handler_js_1.NumericLiteralHandler,
    object_literal_expression_handler_js_1.ObjectLiteralExpressionHandler,
    member_expression_handler_js_1.MemberExpressionHandler,
    property_assignment_handler_js_1.PropertyAssignmentHandler,
    string_literal_handler_js_1.StringLiteralHandler,
    identifier_handler_js_1.IdentifierHandler,
];
class MasterHandler extends base_js_1.NodeHandler {
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
exports.MasterHandler = MasterHandler;
