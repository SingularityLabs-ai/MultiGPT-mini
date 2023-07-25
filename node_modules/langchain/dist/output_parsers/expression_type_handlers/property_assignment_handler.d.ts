import { NodeHandler } from "./base.js";
import { PropertyAssignmentType } from "./types.js";
export declare class PropertyAssignmentHandler extends NodeHandler {
    accepts(node: ExpressionNode): Promise<PropertyAssignment | boolean>;
    handle(node: PropertyAssignment): Promise<PropertyAssignmentType>;
}
