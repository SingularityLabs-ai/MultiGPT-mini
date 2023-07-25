Object.defineProperty(exports, '__esModule', { value: true });

const core = require('@sentry/core');
const utils = require('@sentry/utils');
const nodeUtils = require('./utils/node-utils.js');

function isValidPrismaClient(possibleClient) {
  return possibleClient && !!(possibleClient )['$use'];
}

/** Tracing integration for @prisma/client package */
class Prisma  {
  /**
   * @inheritDoc
   */
   static __initStatic() {this.id = 'Prisma';}

  /**
   * @inheritDoc
   */
   __init() {this.name = Prisma.id;}

  /**
   * Prisma ORM Client Instance
   */

  /**
   * @inheritDoc
   */
   constructor(options = {}) {Prisma.prototype.__init.call(this);
    if (isValidPrismaClient(options.client)) {
      this._client = options.client;
    } else {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
        utils.logger.warn(
          `Unsupported Prisma client provided to PrismaIntegration. Provided client: ${JSON.stringify(options.client)}`,
        );
    }
  }

  /**
   * @inheritDoc
   */
   setupOnce(_, getCurrentHub) {
    if (!this._client) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && utils.logger.error('PrismaIntegration is missing a Prisma Client Instance');
      return;
    }

    if (nodeUtils.shouldDisableAutoInstrumentation(getCurrentHub)) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && utils.logger.log('Prisma Integration is skipped because of instrumenter configuration.');
      return;
    }

    this._client.$use((params, next) => {
      const action = params.action;
      const model = params.model;
      return core.trace(
        { name: model ? `${model} ${action}` : action, op: 'db.sql.prisma', data: { 'db.system': 'prisma' } },
        () => next(params),
      );
    });
  }
} Prisma.__initStatic();

exports.Prisma = Prisma;
//# sourceMappingURL=prisma.js.map
