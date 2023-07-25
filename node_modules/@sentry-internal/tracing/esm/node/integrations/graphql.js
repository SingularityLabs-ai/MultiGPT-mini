import { _optionalChain } from '@sentry/utils/esm/buildPolyfills';
import { loadModule, logger, fill, isThenable } from '@sentry/utils';
import { shouldDisableAutoInstrumentation } from './utils/node-utils.js';

/** Tracing integration for graphql package */
class GraphQL  {constructor() { GraphQL.prototype.__init.call(this); }
  /**
   * @inheritDoc
   */
   static __initStatic() {this.id = 'GraphQL';}

  /**
   * @inheritDoc
   */
   __init() {this.name = GraphQL.id;}

  /** @inheritdoc */
   loadDependency() {
    return (this._module = this._module || loadModule('graphql/execution/execute.js'));
  }

  /**
   * @inheritDoc
   */
   setupOnce(_, getCurrentHub) {
    if (shouldDisableAutoInstrumentation(getCurrentHub)) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && logger.log('GraphQL Integration is skipped because of instrumenter configuration.');
      return;
    }

    const pkg = this.loadDependency();

    if (!pkg) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && logger.error('GraphQL Integration was unable to require graphql/execution package.');
      return;
    }

    fill(pkg, 'execute', function (orig) {
      return function ( ...args) {
        const scope = getCurrentHub().getScope();
        const parentSpan = _optionalChain([scope, 'optionalAccess', _2 => _2.getSpan, 'call', _3 => _3()]);

        const span = _optionalChain([parentSpan, 'optionalAccess', _4 => _4.startChild, 'call', _5 => _5({
          description: 'execute',
          op: 'graphql.execute',
        })]);

        _optionalChain([scope, 'optionalAccess', _6 => _6.setSpan, 'call', _7 => _7(span)]);

        const rv = orig.call(this, ...args);

        if (isThenable(rv)) {
          return rv.then((res) => {
            _optionalChain([span, 'optionalAccess', _8 => _8.finish, 'call', _9 => _9()]);
            _optionalChain([scope, 'optionalAccess', _10 => _10.setSpan, 'call', _11 => _11(parentSpan)]);

            return res;
          });
        }

        _optionalChain([span, 'optionalAccess', _12 => _12.finish, 'call', _13 => _13()]);
        _optionalChain([scope, 'optionalAccess', _14 => _14.setSpan, 'call', _15 => _15(parentSpan)]);
        return rv;
      };
    });
  }
}GraphQL.__initStatic();

export { GraphQL };
//# sourceMappingURL=graphql.js.map
