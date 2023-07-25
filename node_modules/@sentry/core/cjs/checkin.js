Object.defineProperty(exports, '__esModule', { value: true });

const utils = require('@sentry/utils');

/**
 * Create envelope from check in item.
 */
function createCheckInEnvelope(
  checkIn,
  metadata,
  tunnel,
  dsn,
) {
  const headers = {
    sent_at: new Date().toISOString(),
    ...(metadata &&
      metadata.sdk && {
        sdk: {
          name: metadata.sdk.name,
          version: metadata.sdk.version,
        },
      }),
    ...(!!tunnel && !!dsn && { dsn: utils.dsnToString(dsn) }),
  };
  const item = createCheckInEnvelopeItem(checkIn);
  return utils.createEnvelope(headers, [item]);
}

function createCheckInEnvelopeItem(checkIn) {
  const checkInHeaders = {
    type: 'check_in',
  };
  return [checkInHeaders, checkIn];
}

exports.createCheckInEnvelope = createCheckInEnvelope;
//# sourceMappingURL=checkin.js.map
