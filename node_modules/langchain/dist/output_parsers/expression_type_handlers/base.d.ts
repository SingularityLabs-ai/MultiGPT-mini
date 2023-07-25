export declare abstract class NodeHandler {
    protected parentHandler?: NodeHandler | undefined;
    constructor(parentHandler?: NodeHandler | undefined);
    abstract accepts(node: ExpressionNode): Promise<ExpressionNode | boolean>;
    abstract handle(node: ExpressionNode): Promise<any>;
}
export declare class ASTParser {
    static astParseInstance: ParseFunction;
    static importASTParser(): Promise<ParseFunction>;
    static isProgram(node: ExpressionNode): node is Program;
    static isExpressionStatement(node: ExpressionNode): node is ExpressionStatement;
    static isCallExpression(node: ExpressionNode): node is CallExpression;
    static isStringLiteral(node: ExpressionNode): node is StringLiteral;
    static isNumericLiteral(node: ExpressionNode): node is NumericLiteral;
    static isBooleanLiteral(node: ExpressionNode): node is BooleanLiteral;
    static isIdentifier(node: ExpressionNode): node is Identifier;
    static isObjectExpression(node: ExpressionNode): node is ObjectExpression;
    static isArrayExpression(node: ExpressionNode): node is ArrayExpression;
    static isPropertyAssignment(node: ExpressionNode): node is PropertyAssignment;
    static isMemberExpression(node: ExpressionNode): node is MemberExpression;
}
