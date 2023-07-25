import { _optionalChain } from '@sentry/utils/esm/buildPolyfills';
import { loadModule, logger, fill, arrayify, isThenable } from '@sentry/utils';
import { shouldDisableAutoInstrumentation } from './utils/node-utils.js';

/** Tracing integration for Apollo */
class Apollo  {
  /**
   * @inheritDoc
   */
   static __initStatic() {this.id = 'Apollo';}

  /**
   * @inheritDoc
   */
   __init() {this.name = Apollo.id;}

  /**
   * @inheritDoc
   */
   constructor(
    options = {
      useNestjs: false,
    },
  ) {Apollo.prototype.__init.call(this);
    this._useNest = !!options.useNestjs;
  }

  /** @inheritdoc */
   loadDependency() {
    if (this._useNest) {
      this._module = this._module || loadModule('@nestjs/graphql');
    } else {
      this._module = this._module || loadModule('apollo-server-core');
    }

    return this._module;
  }

  /**
   * @inheritDoc
   */
   setupOnce(_, getCurrentHub) {
    if (shouldDisableAutoInstrumentation(getCurrentHub)) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && logger.log('Apollo Integration is skipped because of instrumenter configuration.');
      return;
    }

    if (this._useNest) {
      const pkg = this.loadDependency();

      if (!pkg) {
        (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && logger.error('Apollo-NestJS Integration was unable to require @nestjs/graphql package.');
        return;
      }

      /**
       * Iterate over resolvers of NestJS ResolversExplorerService before schemas are constructed.
       */
      fill(
        pkg.GraphQLFactory.prototype,
        'mergeWithSchema',
        function (orig) {
          return function (

            ...args
          ) {
            fill(this.resolversExplorerService, 'explore', function (orig) {
              return function () {
                const resolvers = arrayify(orig.call(this));

                const instrumentedResolvers = instrumentResolvers(resolvers, getCurrentHub);

                return instrumentedResolvers;
              };
            });

            return orig.call(this, ...args);
          };
        },
      );
    } else {
      const pkg = this.loadDependency();

      if (!pkg) {
        (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && logger.error('Apollo Integration was unable to require apollo-server-core package.');
        return;
      }

      /**
       * Iterate over resolvers of the ApolloServer instance before schemas are constructed.
       */
      fill(pkg.ApolloServerBase.prototype, 'constructSchema', function (orig) {
        return function (

) {
          if (!this.config.resolvers) {
            if ((typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__)) {
              if (this.config.schema) {
                logger.warn(
                  'Apollo integration is not able to trace `ApolloServer` instances constructed via `schema` property.' +
                    'If you are using NestJS with Apollo, please use `Sentry.Integrations.Apollo({ useNestjs: true })` instead.',
                );
                logger.warn();
              } else if (this.config.modules) {
                logger.warn(
                  'Apollo integration is not able to trace `ApolloServer` instances constructed via `modules` property.',
                );
              }

              logger.error('Skipping tracing as no resolvers found on the `ApolloServer` instance.');
            }

            return orig.call(this);
          }

          const resolvers = arrayify(this.config.resolvers);

          this.config.resolvers = instrumentResolvers(resolvers, getCurrentHub);

          return orig.call(this);
        };
      });
    }
  }
}Apollo.__initStatic();

function instrumentResolvers(resolvers, getCurrentHub) {
  return resolvers.map(model => {
    Object.keys(model).forEach(resolverGroupName => {
      Object.keys(model[resolverGroupName]).forEach(resolverName => {
        if (typeof model[resolverGroupName][resolverName] !== 'function') {
          return;
        }

        wrapResolver(model, resolverGroupName, resolverName, getCurrentHub);
      });
    });

    return model;
  });
}

/**
 * Wrap a single resolver which can be a parent of other resolvers and/or db operations.
 */
function wrapResolver(
  model,
  resolverGroupName,
  resolverName,
  getCurrentHub,
) {
  fill(model[resolverGroupName], resolverName, function (orig) {
    return function ( ...args) {
      const scope = getCurrentHub().getScope();
      const parentSpan = _optionalChain([scope, 'optionalAccess', _2 => _2.getSpan, 'call', _3 => _3()]);
      const span = _optionalChain([parentSpan, 'optionalAccess', _4 => _4.startChild, 'call', _5 => _5({
        description: `${resolverGroupName}.${resolverName}`,
        op: 'graphql.resolve',
      })]);

      const rv = orig.call(this, ...args);

      if (isThenable(rv)) {
        return rv.then((res) => {
          _optionalChain([span, 'optionalAccess', _6 => _6.finish, 'call', _7 => _7()]);
          return res;
        });
      }

      _optionalChain([span, 'optionalAccess', _8 => _8.finish, 'call', _9 => _9()]);

      return rv;
    };
  });
}

export { Apollo };
//# sourceMappingURL=apollo.js.map
