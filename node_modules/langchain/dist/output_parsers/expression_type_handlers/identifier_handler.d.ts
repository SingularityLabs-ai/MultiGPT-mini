import { NodeHandler } from "./base.js";
import { IdentifierType } from "./types.js";
export declare class IdentifierHandler extends NodeHandler {
    accepts(node: ExpressionNode): Promise<Identifier | boolean>;
    handle(node: Identifier): Promise<IdentifierType>;
}
