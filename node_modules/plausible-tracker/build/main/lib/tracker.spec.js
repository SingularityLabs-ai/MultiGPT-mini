"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable functional/immutable-data */
const requestModule = __importStar(require("./request"));
const tracker_1 = __importDefault(require("./tracker"));
const requestSpy = jest.spyOn(requestModule, 'sendEvent');
beforeEach(() => {
    jest.clearAllMocks();
    requestSpy.mockImplementation();
});
describe('tracker', () => {
    const getDefaultData = () => ({
        hashMode: false,
        trackLocalhost: false,
        url: location.href,
        domain: location.hostname,
        referrer: document.referrer || null,
        deviceWidth: window.innerWidth,
        apiHost: 'https://plausible.io',
    });
    const getCustomData = () => ({
        hashMode: true,
        trackLocalhost: true,
        url: 'https://my-url.com',
        domain: 'my-domain.com',
        referrer: 'my-referrer',
        deviceWidth: 1080,
        apiHost: 'https://my-api-hos.t',
    });
    const getEventOptions = () => ({
        callback: jest.fn(),
        props: {
            variation1: 'A',
            variation2: 'B',
            variation3: 1,
            variation4: true,
        },
    });
    test('inits with default config', () => {
        const { trackEvent } = tracker_1.default();
        expect(requestSpy).not.toHaveBeenCalled();
        trackEvent('myEvent');
        expect(requestSpy).toHaveBeenCalled();
        expect(requestSpy).toHaveBeenCalledWith('myEvent', expect.objectContaining(getDefaultData()), undefined);
    });
    test('inits with overridden config', () => {
        const config = getCustomData();
        const { trackEvent } = tracker_1.default(config);
        expect(requestSpy).not.toHaveBeenCalled();
        trackEvent('myEvent');
        expect(requestSpy).toHaveBeenCalled();
        expect(requestSpy).toHaveBeenCalledWith('myEvent', config, undefined);
    });
    describe('trackEvent', () => {
        test('tracks event', () => {
            const { trackEvent } = tracker_1.default();
            expect(requestSpy).not.toHaveBeenCalled();
            trackEvent('myEvent');
            expect(requestSpy).toHaveBeenCalled();
            expect(requestSpy).toHaveBeenCalledWith('myEvent', getDefaultData(), undefined);
        });
        test('accepts data on trackEvent', () => {
            const { trackEvent } = tracker_1.default();
            expect(requestSpy).not.toHaveBeenCalled();
            const config = getCustomData();
            trackEvent('myEvent', undefined, config);
            expect(requestSpy).toHaveBeenCalled();
            expect(requestSpy).toHaveBeenCalledWith('myEvent', config, undefined);
        });
        test('accepts options on trackEvent', () => {
            const { trackEvent } = tracker_1.default();
            expect(requestSpy).not.toHaveBeenCalled();
            const options = getEventOptions();
            trackEvent('myEvent', options);
            expect(requestSpy).toHaveBeenCalled();
            expect(requestSpy).toHaveBeenCalledWith('myEvent', getDefaultData(), options);
        });
    });
    describe('pageView', () => {
        test('tracks pageview', () => {
            const { trackPageview } = tracker_1.default();
            expect(requestSpy).not.toHaveBeenCalled();
            trackPageview();
            expect(requestSpy).toHaveBeenCalled();
            expect(requestSpy).toHaveBeenCalledWith('pageview', getDefaultData(), undefined);
        });
        test('accepts data on pageview', () => {
            const { trackPageview } = tracker_1.default();
            expect(requestSpy).not.toHaveBeenCalled();
            const config = getCustomData();
            trackPageview(config);
            expect(requestSpy).toHaveBeenCalled();
            expect(requestSpy).toHaveBeenCalledWith('pageview', config, undefined);
        });
        test('accepts event options on pageview', () => {
            const { trackPageview } = tracker_1.default();
            expect(requestSpy).not.toHaveBeenCalled();
            const options = getEventOptions();
            trackPageview({}, options);
            expect(requestSpy).toHaveBeenCalled();
            expect(requestSpy).toHaveBeenCalledWith('pageview', getDefaultData(), options);
        });
    });
    describe('enableAutoPageviews', () => {
        test('tracks first pageview', () => {
            const { enableAutoPageviews } = tracker_1.default();
            expect(requestSpy).not.toHaveBeenCalled();
            const cleanup = enableAutoPageviews();
            expect(requestSpy).toHaveBeenCalledWith('pageview', getDefaultData(), undefined);
            cleanup();
        });
        test('does not track popstate if no history.pushState', () => {
            const originalPushState = history.pushState;
            const { enableAutoPageviews } = tracker_1.default();
            expect(requestSpy).not.toHaveBeenCalled();
            history.pushState = null;
            const cleanup = enableAutoPageviews();
            expect(requestSpy).toHaveBeenCalledTimes(1);
            window.dispatchEvent(new PopStateEvent('popstate'));
            expect(requestSpy).toHaveBeenCalledTimes(1);
            cleanup();
            history.pushState = originalPushState;
        });
        test('tracks pageviews on push state', () => {
            const { enableAutoPageviews } = tracker_1.default();
            expect(requestSpy).not.toHaveBeenCalled();
            const cleanup = enableAutoPageviews();
            expect(requestSpy).toHaveBeenCalledTimes(1);
            history.pushState({}, 'second', '/url');
            expect(requestSpy).toHaveBeenCalledTimes(2);
            cleanup();
        });
        test('tracks pageviews on popstate', () => {
            const { enableAutoPageviews } = tracker_1.default();
            expect(requestSpy).not.toHaveBeenCalled();
            const cleanup = enableAutoPageviews();
            expect(requestSpy).toHaveBeenCalledTimes(1);
            window.dispatchEvent(new PopStateEvent('popstate'));
            expect(requestSpy).toHaveBeenCalledTimes(2);
            cleanup();
        });
        test('does not track hashchange by default', () => {
            const { enableAutoPageviews } = tracker_1.default();
            expect(requestSpy).not.toHaveBeenCalled();
            const cleanup = enableAutoPageviews();
            expect(requestSpy).toHaveBeenCalledTimes(1);
            window.dispatchEvent(new HashChangeEvent('hashchange'));
            expect(requestSpy).toHaveBeenCalledTimes(1);
            cleanup();
        });
        test('tracks hashchange if specified', () => {
            const { enableAutoPageviews } = tracker_1.default({ hashMode: true });
            expect(requestSpy).not.toHaveBeenCalled();
            const cleanup = enableAutoPageviews();
            expect(requestSpy).toHaveBeenCalledTimes(1);
            window.dispatchEvent(new HashChangeEvent('hashchange'));
            expect(requestSpy).toHaveBeenCalledTimes(2);
            cleanup();
        });
    });
    describe('enableAutoOutboundTracking', () => {
        const createAnchors = (amount, start = 0) => {
            return [...Array(amount).keys()].map((i) => {
                const el = document.createElement('a');
                el.setAttribute('href', `https://link-${i + start}.com`);
                return el;
            });
        };
        const mountAnchors = (anchors) => {
            const div = document.createElement('div');
            anchors.forEach((a) => div.appendChild(a));
            document.body.append(div);
        };
        const clickLink = (anchor) => {
            anchor.click();
        };
        afterEach(() => {
            // Reset body
            document.body.innerHTML = '';
        });
        test('tracks existing anchors', () => {
            const anchors = createAnchors(10);
            mountAnchors(anchors);
            const { enableAutoOutboundTracking } = tracker_1.default(document);
            const cleanup = enableAutoOutboundTracking();
            expect(requestSpy).not.toHaveBeenCalled();
            // Click anchors
            anchors.forEach(clickLink);
            expect(requestSpy).toHaveBeenCalledTimes(10);
            anchors.forEach((a) => {
                expect(requestSpy).toHaveBeenCalledWith('Outbound Link: Click', expect.anything(), expect.objectContaining({
                    props: { url: a.href },
                }));
            });
            cleanup();
        });
        test('do not track host links', () => {
            const anchors = createAnchors(1);
            mountAnchors(anchors);
            const anchor = anchors[0];
            anchor.setAttribute('href', `https://${location.host}`);
            const { enableAutoOutboundTracking } = tracker_1.default(document);
            const cleanup = enableAutoOutboundTracking();
            expect(requestSpy).not.toHaveBeenCalled();
            // Click anchors
            anchors.forEach(clickLink);
            expect(requestSpy).not.toHaveBeenCalled();
            cleanup();
        });
        test('tracks href change', async () => {
            const anchors = createAnchors(1);
            mountAnchors(anchors);
            const { enableAutoOutboundTracking } = tracker_1.default(document);
            const cleanup = enableAutoOutboundTracking();
            const newHref = 'https://other.com/';
            // Change href
            const anchor = document.querySelector('a');
            expect(anchor).toBeTruthy();
            if (anchor) {
                anchor.removeAttribute('href');
                anchor.setAttribute('href', newHref);
            }
            expect(requestSpy).not.toHaveBeenCalled();
            // Wait for observer to run
            await new Promise((resolve) => setTimeout(() => {
                resolve(null);
            }, 100));
            // Click anchors
            anchors.forEach(clickLink);
            expect(requestSpy).toHaveBeenCalledTimes(1);
            expect(requestSpy).toBeCalledWith('Outbound Link: Click', expect.anything(), expect.objectContaining({
                props: { url: newHref },
            }));
            cleanup();
        });
        test('tracks node addition', async () => {
            const oldAnchors = createAnchors(5);
            mountAnchors(oldAnchors);
            const { enableAutoOutboundTracking } = tracker_1.default(document);
            const cleanup = enableAutoOutboundTracking();
            const newAnchors = createAnchors(5, 5);
            mountAnchors(newAnchors);
            expect(requestSpy).not.toHaveBeenCalled();
            const anchors = [...oldAnchors, ...newAnchors];
            // Wait for observer to run
            await new Promise((resolve) => setTimeout(() => {
                resolve(null);
            }, 100));
            // Click anchors
            anchors.forEach((a) => a.click());
            expect(requestSpy).toHaveBeenCalledTimes(10);
            anchors.forEach((a) => {
                expect(requestSpy).toHaveBeenCalledWith('Outbound Link: Click', expect.anything(), expect.objectContaining({
                    props: { url: a.href },
                }));
            });
            cleanup();
        });
        test('tracks node removal', async () => {
            var _a;
            const anchors = createAnchors(5);
            mountAnchors(anchors);
            const { enableAutoOutboundTracking } = tracker_1.default(document);
            const cleanup = enableAutoOutboundTracking();
            expect(requestSpy).not.toHaveBeenCalled();
            // Remove nodes
            (_a = document.querySelector('div')) === null || _a === void 0 ? void 0 : _a.remove();
            // Wait for observer to run
            await new Promise((resolve) => setTimeout(() => {
                resolve(null);
            }, 100));
            // Click anchors
            anchors.forEach(clickLink);
            expect(requestSpy).not.toHaveBeenCalled();
            cleanup();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhY2tlci5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi90cmFja2VyLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOENBQThDO0FBQzlDLHlEQUEyQztBQUMzQyx3REFBd0Q7QUFFeEQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFFMUQsVUFBVSxDQUFDLEdBQUcsRUFBRTtJQUNkLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUNyQixVQUFVLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztBQUNsQyxDQUFDLENBQUMsQ0FBQztBQUVILFFBQVEsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO0lBQ3ZCLE1BQU0sY0FBYyxHQUFxQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzlELFFBQVEsRUFBRSxLQUFLO1FBQ2YsY0FBYyxFQUFFLEtBQUs7UUFDckIsR0FBRyxFQUFFLFFBQVEsQ0FBQyxJQUFJO1FBQ2xCLE1BQU0sRUFBRSxRQUFRLENBQUMsUUFBUTtRQUN6QixRQUFRLEVBQUUsUUFBUSxDQUFDLFFBQVEsSUFBSSxJQUFJO1FBQ25DLFdBQVcsRUFBRSxNQUFNLENBQUMsVUFBVTtRQUM5QixPQUFPLEVBQUUsc0JBQXNCO0tBQ2hDLENBQUMsQ0FBQztJQUVILE1BQU0sYUFBYSxHQUFxQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzdELFFBQVEsRUFBRSxJQUFJO1FBQ2QsY0FBYyxFQUFFLElBQUk7UUFDcEIsR0FBRyxFQUFFLG9CQUFvQjtRQUN6QixNQUFNLEVBQUUsZUFBZTtRQUN2QixRQUFRLEVBQUUsYUFBYTtRQUN2QixXQUFXLEVBQUUsSUFBSTtRQUNqQixPQUFPLEVBQUUsc0JBQXNCO0tBQ2hDLENBQUMsQ0FBQztJQUVILE1BQU0sZUFBZSxHQUErQyxHQUFHLEVBQUUsQ0FBQyxDQUFD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