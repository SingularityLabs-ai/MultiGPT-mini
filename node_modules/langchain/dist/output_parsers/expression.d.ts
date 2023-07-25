import { ParsedType } from "./expression_type_handlers/types.js";
import { BaseOutputParser } from "../schema/output_parser.js";
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
export declare class ExpressionParser extends BaseOutputParser<ParsedType> {
    parser: ParseFunction;
    /**
     * We should separate loading the parser into its own function
     * because loading the grammar takes some time. If there are
     * multiple concurrent parse calls, it's faster to just wait
     * for building the parser once and then use it for all
     * subsequent calls. See expression.test.ts for an example.
     */
    ensureParser(): Promise<void>;
    parse(text: string): Promise<ParsedType>;
    getFormatInstructions(): string;
}
export * from "./expression_type_handlers/types.js";
export { MasterHandler } from "./expression_type_handlers/factory.js";
