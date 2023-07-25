"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadQueryConstructorChain = exports.formatAttributeInfo = exports.StructuredQueryOutputParser = exports.EXAMPLE_PROMPT = exports.DEFAULT_SUFFIX = exports.DEFAULT_SCHEMA = exports.DEFAULT_PREFIX = exports.DEFAULT_EXAMPLES = exports.QueryTransformer = void 0;
const zod_1 = require("zod");
const parser_js_1 = require("./parser.cjs");
Object.defineProperty(exports, "QueryTransformer", { enumerable: true, get: function () { return parser_js_1.QueryTransformer; } });
const ir_js_1 = require("./ir.cjs");
const prompt_js_1 = require("./prompt.cjs");
Object.defineProperty(exports, "DEFAULT_EXAMPLES", { enumerable: true, get: function () { return prompt_js_1.DEFAULT_EXAMPLES; } });
Object.defineProperty(exports, "DEFAULT_PREFIX", { enumerable: true, get: function () { return prompt_js_1.DEFAULT_PREFIX; } });
Object.defineProperty(exports, "DEFAULT_SCHEMA", { enumerable: true, get: function () { return prompt_js_1.DEFAULT_SCHEMA; } });
Object.defineProperty(exports, "DEFAULT_SUFFIX", { enumerable: true, get: function () { return prompt_js_1.DEFAULT_SUFFIX; } });
Object.defineProperty(exports, "EXAMPLE_PROMPT", { enumerable: true, get: function () { return prompt_js_1.EXAMPLE_PROMPT; } });
const template_js_1 = require("../../prompts/template.cjs");
const llm_chain_js_1 = require("../llm_chain.cjs");
const few_shot_js_1 = require("../../prompts/few_shot.cjs");
const structured_js_1 = require("../../output_parsers/structured.cjs");
const queryInputSchema = /* #__PURE__ */ zod_1.z.object({
    query: /* #__PURE__ */ zod_1.z
        .string()
        .describe("text string to compare to document contents"),
    filter: /* #__PURE__ */ zod_1.z
        .string()
        .optional()
        .describe("logical condition statement for filtering documents"),
});
class StructuredQueryOutputParser extends structured_js_1.AsymmetricStructuredOutputParser {
    constructor(parserFunction) {
        super(queryInputSchema);
        Object.defineProperty(this, "parserFunction", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: parserFunction
        });
    }
    async outputProcessor(input) {
        return this.parserFunction(input.query, input.filter);
    }
    static fromComponents(allowedComparators = [], allowedOperators = []) {
        const queryTransformer = new parser_js_1.QueryTransformer(allowedComparators, allowedOperators);
        return new StructuredQueryOutputParser(async (query, filter) => {
            let myQuery = query;
            if (myQuery.length === 0) {
                myQuery = " ";
            }
            if (filter === "NO_FILTER" || filter === undefined) {
                return new ir_js_1.StructuredQuery(query);
            }
            else {
                const parsedFilter = await queryTransformer.parse(filter);
                return new ir_js_1.StructuredQuery(query, parsedFilter);
            }
        });
    }
}
exports.StructuredQueryOutputParser = StructuredQueryOutputParser;
function formatAttributeInfo(info) {
    const infoObj = info.reduce((acc, attr) => {
        acc[attr.name] = {
            type: attr.type,
            description: attr.description,
        };
        return acc;
    }, {});
    return JSON.stringify(infoObj, null, 2)
        .replaceAll("{", "{{")
        .replaceAll("}", "}}");
}
exports.formatAttributeInfo = formatAttributeInfo;
const defaultExample = prompt_js_1.DEFAULT_EXAMPLES.map((EXAMPLE) => EXAMPLE);
function _getPrompt(documentContents, attributeInfo, allowedComparators, allowedOperators, examples = defaultExample) {
    const myAllowedComparators = allowedComparators ?? Object.values(ir_js_1.Comparators);
    const myAllowedOperators = allowedOperators ?? Object.values(ir_js_1.Operators);
    const attributeJSON = formatAttributeInfo(attributeInfo);
    const schema = (0, template_js_1.interpolateFString)(prompt_js_1.DEFAULT_SCHEMA, {
        allowed_comparators: myAllowedComparators.join(" | "),
        allowed_operators: myAllowedOperators.join(" | "),
    });
    const prefix = (0, template_js_1.interpolateFString)(prompt_js_1.DEFAULT_PREFIX, {
        schema,
    });
    const suffix = (0, template_js_1.interpolateFString)(prompt_js_1.DEFAULT_SUFFIX, {
        i: examples.length + 1,
        content: documentContents,
        attributes: attributeJSON,
    });
    const outputParser = StructuredQueryOutputParser.fromComponents(allowedComparators, allowedOperators);
    return new few_shot_js_1.FewShotPromptTemplate({
        examples,
        examplePrompt: prompt_js_1.EXAMPLE_PROMPT,
        inputVariables: ["query"],
        suffix,
        prefix,
        outputParser,
    });
}
function loadQueryConstructorChain(opts) {
    const prompt = _getPrompt(opts.documentContents, opts.attributeInfo, opts.allowedComparators, opts.allowedOperators, opts.examples);
    return new llm_chain_js_1.LLMChain({
        llm: opts.llm,
        prompt,
    });
}
exports.loadQueryConstructorChain = loadQueryConstructorChain;
