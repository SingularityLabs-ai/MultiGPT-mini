import { getOriginalFunction } from '@sentry/utils';

let originalFunctionToString;

/** Patch toString calls to return proper name for wrapped functions */
class FunctionToString  {constructor() { FunctionToString.prototype.__init.call(this); }
  /**
   * @inheritDoc
   */
   static __initStatic() {this.id = 'FunctionToString';}

  /**
   * @inheritDoc
   */
   __init() {this.name = FunctionToString.id;}

  /**
   * @inheritDoc
   */
   setupOnce() {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    originalFunctionToString = Function.prototype.toString;

    // intrinsics (like Function.prototype) might be immutable in some environments
    // e.g. Node with --frozen-intrinsics, XS (an embedded JavaScript engine) or SES (a JavaScript proposal)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Function.prototype.toString = function ( ...args) {
        const context = getOriginalFunction(this) || this;
        return originalFunctionToString.apply(context, args);
      };
    } catch (e) {
      // ignore errors here, just don't patch this
    }
  }
} FunctionToString.__initStatic();

export { FunctionToString };
//# sourceMappingURL=functiontostring.js.map
