/**
 * Plugin to sanitize HTML.
 *
 * @type {import('unified').Plugin<[Options?] | Array<void>, Root, Root>}
 */
export default function rehypeSanitize(
  options?: void | import('hast-util-sanitize/lib').Schema | undefined
):
  | void
  | import('unified').Transformer<import('hast').Root, import('hast').Root>
export {defaultSchema} from 'hast-util-sanitize'
export type Root = import('hast').Root
/**
 * The sanitation schema defines how and if nodes and properties should be cleaned.
 * See `hast-util-sanitize`.
 * The default schema is exported as `defaultSchema`.
 */
export type Options = import('hast-util-sanitize').Schema
