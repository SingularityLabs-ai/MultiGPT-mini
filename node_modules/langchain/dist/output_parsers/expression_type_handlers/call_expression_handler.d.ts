import { NodeHandler } from "./base.js";
import { CallExpressionType } from "./types.js";
export declare class CallExpressionHandler extends NodeHandler {
    accepts(node: ExpressionNode): Promise<CallExpression | boolean>;
    handle(node: CallExpression): Promise<CallExpressionType>;
}
