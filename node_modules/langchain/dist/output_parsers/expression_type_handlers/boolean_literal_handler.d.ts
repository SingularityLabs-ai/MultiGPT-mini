import { NodeHandler } from "./base.js";
import { BooleanLiteralType } from "./types.js";
export declare class BooleanLiteralHandler extends NodeHandler {
    accepts(node: ExpressionNode): Promise<BooleanLiteral | boolean>;
    handle(node: BooleanLiteral): Promise<BooleanLiteralType>;
}
