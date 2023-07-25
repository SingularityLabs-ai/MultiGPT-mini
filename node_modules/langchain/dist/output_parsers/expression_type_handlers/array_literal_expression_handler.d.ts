import { NodeHandler } from "./base.js";
import { ArrayLiteralType } from "./types.js";
export declare class ArrayLiteralExpressionHandler extends NodeHandler {
    accepts(node: ExpressionNode): Promise<ArrayExpression | boolean>;
    handle(node: ArrayExpression): Promise<ArrayLiteralType>;
}
