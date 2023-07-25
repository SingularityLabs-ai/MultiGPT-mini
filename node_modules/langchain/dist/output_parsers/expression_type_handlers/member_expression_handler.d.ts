import { NodeHandler } from "./base.js";
import { MemberExpressionType } from "./types.js";
export declare class MemberExpressionHandler extends NodeHandler {
    accepts(node: ExpressionNode): Promise<MemberExpression | boolean>;
    handle(node: MemberExpression): Promise<MemberExpressionType>;
}
