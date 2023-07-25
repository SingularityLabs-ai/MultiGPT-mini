import { NodeHandler } from "./base.js";
import { ParsedType } from "./types.js";
export declare class MasterHandler extends NodeHandler {
    nodeHandlers: NodeHandler[];
    accepts(node: ExpressionNode): Promise<ExpressionNode | boolean>;
    handle(node: CallExpression): Promise<ParsedType>;
    static createMasterHandler(): MasterHandler;
}
