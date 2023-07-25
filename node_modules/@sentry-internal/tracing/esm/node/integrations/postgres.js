import { _optionalChain } from '@sentry/utils/esm/buildPolyfills';
import { loadModule, logger, fill, isThenable } from '@sentry/utils';
import { shouldDisableAutoInstrumentation } from './utils/node-utils.js';

/** Tracing integration for node-postgres package */
class Postgres  {
  /**
   * @inheritDoc
   */
   static __initStatic() {this.id = 'Postgres';}

  /**
   * @inheritDoc
   */
   __init() {this.name = Postgres.id;}

   constructor(options = {}) {Postgres.prototype.__init.call(this);
    this._usePgNative = !!options.usePgNative;
  }

  /** @inheritdoc */
   loadDependency() {
    return (this._module = this._module || loadModule('pg'));
  }

  /**
   * @inheritDoc
   */
   setupOnce(_, getCurrentHub) {
    if (shouldDisableAutoInstrumentation(getCurrentHub)) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && logger.log('Postgres Integration is skipped because of instrumenter configuration.');
      return;
    }

    const pkg = this.loadDependency();

    if (!pkg) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && logger.error('Postgres Integration was unable to require `pg` package.');
      return;
    }

    if (this._usePgNative && !_optionalChain([pkg, 'access', _2 => _2.native, 'optionalAccess', _3 => _3.Client])) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && logger.error("Postgres Integration was unable to access 'pg-native' bindings.");
      return;
    }

    const { Client } = this._usePgNative ? pkg.native : pkg;

    /**
     * function (query, callback) => void
     * function (query, params, callback) => void
     * function (query) => Promise
     * function (query, params) => Promise
     * function (pg.Cursor) => pg.Cursor
     */
    fill(Client.prototype, 'query', function (orig) {
      return function ( config, values, callback) {
        const scope = getCurrentHub().getScope();
        const parentSpan = _optionalChain([scope, 'optionalAccess', _4 => _4.getSpan, 'call', _5 => _5()]);
        const span = _optionalChain([parentSpan, 'optionalAccess', _6 => _6.startChild, 'call', _7 => _7({
          description: typeof config === 'string' ? config : (config ).text,
          op: 'db',
          data: {
            'db.system': 'postgresql',
          },
        })]);

        if (typeof callback === 'function') {
          return orig.call(this, config, values, function (err, result) {
            _optionalChain([span, 'optionalAccess', _8 => _8.finish, 'call', _9 => _9()]);
            callback(err, result);
          });
        }

        if (typeof values === 'function') {
          return orig.call(this, config, function (err, result) {
            _optionalChain([span, 'optionalAccess', _10 => _10.finish, 'call', _11 => _11()]);
            values(err, result);
          });
        }

        const rv = typeof values !== 'undefined' ? orig.call(this, config, values) : orig.call(this, config);

        if (isThenable(rv)) {
          return rv.then((res) => {
            _optionalChain([span, 'optionalAccess', _12 => _12.finish, 'call', _13 => _13()]);
            return res;
          });
        }

        _optionalChain([span, 'optionalAccess', _14 => _14.finish, 'call', _15 => _15()]);
        return rv;
      };
    });
  }
}Postgres.__initStatic();

export { Postgres };
//# sourceMappingURL=postgres.js.map
