import { NodeHandler } from "./base.js";
import { StringLiteralType } from "./types.js";
export declare class StringLiteralHandler extends NodeHandler {
    accepts(node: ExpressionNode): Promise<StringLiteral | boolean>;
    handle(node: StringLiteral): Promise<StringLiteralType>;
}
