import { NodeHandler } from "./base.js";
import { NumericLiteralType } from "./types.js";
export declare class NumericLiteralHandler extends NodeHandler {
    accepts(node: ExpressionNode): Promise<NumericLiteral | boolean>;
    handle(node: NumericLiteral): Promise<NumericLiteralType>;
}
