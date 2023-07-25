import { MasterHandler } from "./expression_type_handlers/factory.js";
import { BaseOutputParser } from "../schema/output_parser.js";
import { ASTParser } from "./expression_type_handlers/base.js";
/**
 * okay so we need to be able to handle the following cases:
 * ExpressionStatement
 *  CallExpression
 *      Identifier | MemberExpression
 *      ExpressionLiterals: [
 *          CallExpression
 *          StringLiteral
 *          NumericLiteral
 *          ArrayLiteralExpression
 *              ExpressionLiterals
 *          ObjectLiteralExpression
 *              PropertyAssignment
 *                  Identifier
 *                  ExpressionLiterals
 *      ]
 */
export class ExpressionParser extends BaseOutputParser {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "parser", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    /**
     * We should separate loading the parser into its own function
     * because loading the grammar takes some time. If there are
     * multiple concurrent parse calls, it's faster to just wait
     * for building the parser once and then use it for all
     * subsequent calls. See expression.test.ts for an example.
     */
    async ensureParser() {
        if (!this.parser) {
            this.parser = await ASTParser.importASTParser();
        }
    }
    async parse(text) {
        await this.ensureParser();
        try {
            const program = this.parser(text);
            const node = program.body;
            if (!ASTParser.isExpressionStatement(node)) {
                throw new Error(`Expected ExpressionStatement, got ${node.type}`);
            }
            const { expression: expressionStatement } = node;
            if (!ASTParser.isCallExpression(expressionStatement)) {
                throw new Error("Expected CallExpression");
            }
            const masterHandler = MasterHandler.createMasterHandler();
            return await masterHandler.handle(expressionStatement);
        }
        catch (err) {
            throw new Error(`Error parsing ${err}: ${text}`);
        }
    }
    getFormatInstructions() {
        return "";
    }
}
export * from "./expression_type_handlers/types.js";
export { MasterHandler } from "./expression_type_handlers/factory.js";
