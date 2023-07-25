import { NodeHandler } from "./base.js";
import { ObjectLiteralType } from "./types.js";
export declare class ObjectLiteralExpressionHandler extends NodeHandler {
    accepts(node: ExpressionNode): Promise<ObjectExpression | boolean>;
    handle(node: ObjectExpression): Promise<ObjectLiteralType>;
}
