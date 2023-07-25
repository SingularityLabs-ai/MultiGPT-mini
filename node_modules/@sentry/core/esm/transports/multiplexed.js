import { dsnFromString, forEachEnvelopeItem } from '@sentry/utils';
import { getEnvelopeEndpointWithUrlEncodedAuth } from '../api.js';

function eventFromEnvelope(env, types) {
  let event;

  forEachEnvelopeItem(env, (item, type) => {
    if (types.includes(type)) {
      event = Array.isArray(item) ? (item )[1] : undefined;
    }
    // bail out if we found an event
    return !!event;
  });

  return event;
}

/**
 * Creates a transport that can send events to different DSNs depending on the envelope contents.
 */
function makeMultiplexedTransport(
  createTransport,
  matcher,
) {
  return options => {
    const fallbackTransport = createTransport(options);
    const otherTransports = {};

    function getTransport(dsn) {
      if (!otherTransports[dsn]) {
        const validatedDsn = dsnFromString(dsn);
        if (!validatedDsn) {
          return undefined;
        }
        const url = getEnvelopeEndpointWithUrlEncodedAuth(validatedDsn);
        otherTransports[dsn] = createTransport({ ...options, url });
      }

      return otherTransports[dsn];
    }

    async function send(envelope) {
      function getEvent(types) {
        const eventTypes = types && types.length ? types : ['event'];
        return eventFromEnvelope(envelope, eventTypes);
      }

      const transports = matcher({ envelope, getEvent })
        .map(dsn => getTransport(dsn))
        .filter((t) => !!t);

      // If we have no transports to send to, use the fallback transport
      if (transports.length === 0) {
        transports.push(fallbackTransport);
      }

      const results = await Promise.all(transports.map(transport => transport.send(envelope)));

      return results[0];
    }

    async function flush(timeout) {
      const allTransports = [...Object.keys(otherTransports).map(dsn => otherTransports[dsn]), fallbackTransport];
      const results = await Promise.all(allTransports.map(transport => transport.flush(timeout)));
      return results.every(r => r);
    }

    return {
      send,
      flush,
    };
  };
}

export { makeMultiplexedTransport };
//# sourceMappingURL=multiplexed.js.map
