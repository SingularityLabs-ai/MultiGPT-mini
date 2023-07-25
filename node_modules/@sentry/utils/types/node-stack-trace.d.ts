import type { StackLineParserFn } from '@sentry/types';
export declare type GetModuleFn = (filename: string | undefined) => string | undefined;
/** Node Stack line parser */
export declare function node(getModule?: GetModuleFn): StackLineParserFn;
//# sourceMappingURL=node-stack-trace.d.ts.map