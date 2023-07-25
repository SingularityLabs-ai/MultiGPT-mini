import { sendEvent } from './request';
/**
 * Initializes the tracker with your default values.
 *
 * ### Example (es module)
 * ```js
 * import Plausible from 'plausible-tracker'
 *
 * const { enableAutoPageviews, trackEvent } = Plausible({
 *   domain: 'my-app-domain.com',
 *   hashMode: true
 * })
 *
 * enableAutoPageviews()
 *
 * function onUserRegister() {
 *   trackEvent('register')
 * }
 * ```
 *
 * ### Example (commonjs)
 * ```js
 * var Plausible = require('plausible-tracker');
 *
 * var { enableAutoPageviews, trackEvent } = Plausible({
 *   domain: 'my-app-domain.com',
 *   hashMode: true
 * })
 *
 * enableAutoPageviews()
 *
 * function onUserRegister() {
 *   trackEvent('register')
 * }
 * ```
 *
 * @param defaults - Default event parameters that will be applied to all requests.
 */
export default function Plausible(defaults) {
    const getConfig = () => ({
        hashMode: false,
        trackLocalhost: false,
        url: location.href,
        domain: location.hostname,
        referrer: document.referrer || null,
        deviceWidth: window.innerWidth,
        apiHost: 'https://plausible.io',
        ...defaults,
    });
    const trackEvent = (eventName, options, eventData) => {
        sendEvent(eventName, { ...getConfig(), ...eventData }, options);
    };
    const trackPageview = (eventData, options) => {
        trackEvent('pageview', options, eventData);
    };
    const enableAutoPageviews = () => {
        const page = () => trackPageview();
        // Attach pushState and popState listeners
        const originalPushState = history.pushState;
        if (originalPushState) {
            // eslint-disable-next-line functional/immutable-data
            history.pushState = function (data, title, url) {
                originalPushState.apply(this, [data, title, url]);
                page();
            };
            addEventListener('popstate', page);
        }
        // Attach hashchange listener
        if (defaults && defaults.hashMode) {
            addEventListener('hashchange', page);
        }
        // Trigger first page view
        trackPageview();
        return function cleanup() {
            if (originalPushState) {
                // eslint-disable-next-line functional/immutable-data
                history.pushState = originalPushState;
                removeEventListener('popstate', page);
            }
            if (defaults && defaults.hashMode) {
                removeEventListener('hashchange', page);
            }
        };
    };
    const enableAutoOutboundTracking = (targetNode = document, observerInit = {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['href'],
    }) => {
        function trackClick(event) {
            trackEvent('Outbound Link: Click', { props: { url: this.href } });
            /* istanbul ignore next */
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (!(typeof process !== 'undefined' &&
                process &&
                process.env.NODE_ENV === 'test')) {
                setTimeout(() => {
                    // eslint-disable-next-line functional/immutable-data
                    location.href = this.href;
                }, 150);
            }
            event.preventDefault();
        }
        // eslint-disable-next-line functional/prefer-readonly-type
        const tracked = new Set();
        function addNode(node) {
            if (node instanceof HTMLAnchorElement) {
                if (node.host !== location.host) {
                    node.addEventListener('click', trackClick);
                    tracked.add(node);
                }
            } /* istanbul ignore next */
            else if ('querySelectorAll' in node) {
                node.querySelectorAll('a').forEach(addNode);
            }
        }
        function removeNode(node) {
            if (node instanceof HTMLAnchorElement) {
                node.removeEventListener('click', trackClick);
                tracked.delete(node);
            } /* istanbul ignore next */
            else if ('querySelectorAll' in node) {
                node.querySelectorAll('a').forEach(removeNode);
            }
        }
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes') {
                    // Handle changed href
                    removeNode(mutation.target);
                    addNode(mutation.target);
                } /* istanbul ignore next */
                else if (mutation.type === 'childList') {
                    // Handle added nodes
                    mutation.addedNodes.forEach(addNode);
                    // Handle removed nodes
                    mutation.removedNodes.forEach(removeNode);
                }
            });
        });
        // Track existing nodes
        targetNode.querySelectorAll('a').forEach(addNode);
        // Observe mutations
        observer.observe(targetNode, observerInit);
        return function cleanup() {
            tracked.forEach((a) => {
                a.removeEventListener('click', trackClick);
            });
            tracked.clear();
            observer.disconnect();
        };
    };
    return {
        trackEvent,
        trackPageview,
        enableAutoPageviews,
        enableAutoOutboundTracking,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhY2tlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdHJhY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQWdCLFNBQVMsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQTRLcEQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW9DRztBQUNILE1BQU0sQ0FBQyxPQUFPLFVBQVUsU0FBUyxDQUMvQixRQUErQjtJQU8vQixNQUFNLFNBQVMsR0FBRyxHQUErQixFQUFFLENBQUMsQ0FBQztRQUNuRCxRQUFRLEVBQUUsS0FBSztRQUNmLGNBQWMsRUFBRSxLQUFLO1FBQ3JCLEdBQUcsRUFBRSxRQUFRLENBQUMsSUFBSTtRQUNsQixNQUFNLEVBQUUsUUFBUSxDQUFDLFFBQVE7UUFDekIsUUFBUSxFQUFFLFFBQVEsQ0FBQyxRQUFRLElBQUksSUFBSTtRQUNuQyxXQUFXLEVBQUUsTUFBTSxDQUFDLFVBQVU7UUFDOUIsT0FBTyxFQUFFLHNCQUFzQjtRQUMvQixHQUFHLFFBQVE7S0FDWixDQUFDLENBQUM7SUFFSCxNQUFNLFVBQVUsR0FBZSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUU7UUFDL0QsU0FBUyxDQUFDLFNBQVMsRUFBRSxFQUFFLEdBQUcsU0FBUyxFQUFFLEVBQUUsR0FBRyxTQUFTLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNsRSxDQUFDLENBQUM7SUFFRixNQUFNLGFBQWEsR0FBa0IsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLEVBQUU7UUFDMUQsVUFBVSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDN0MsQ0FBQyxDQUFDO0lBRUYsTUFBTSxtQkFBbUIsR0FBd0IsR0FBRyxFQUFFO1FBQ3BELE1BQU0sSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ25DLDBDQUEwQztRQUMxQyxN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