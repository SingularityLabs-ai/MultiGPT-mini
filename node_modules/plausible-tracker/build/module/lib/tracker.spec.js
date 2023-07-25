/* eslint-disable functional/immutable-data */
import * as requestModule from './request';
import Plausible from './tracker';
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
        const { trackEvent } = Plausible();
        expect(requestSpy).not.toHaveBeenCalled();
        trackEvent('myEvent');
        expect(requestSpy).toHaveBeenCalled();
        expect(requestSpy).toHaveBeenCalledWith('myEvent', expect.objectContaining(getDefaultData()), undefined);
    });
    test('inits with overridden config', () => {
        const config = getCustomData();
        const { trackEvent } = Plausible(config);
        expect(requestSpy).not.toHaveBeenCalled();
        trackEvent('myEvent');
        expect(requestSpy).toHaveBeenCalled();
        expect(requestSpy).toHaveBeenCalledWith('myEvent', config, undefined);
    });
    describe('trackEvent', () => {
        test('tracks event', () => {
            const { trackEvent } = Plausible();
            expect(requestSpy).not.toHaveBeenCalled();
            trackEvent('myEvent');
            expect(requestSpy).toHaveBeenCalled();
            expect(requestSpy).toHaveBeenCalledWith('myEvent', getDefaultData(), undefined);
        });
        test('accepts data on trackEvent', () => {
            const { trackEvent } = Plausible();
            expect(requestSpy).not.toHaveBeenCalled();
            const config = getCustomData();
            trackEvent('myEvent', undefined, config);
            expect(requestSpy).toHaveBeenCalled();
            expect(requestSpy).toHaveBeenCalledWith('myEvent', config, undefined);
        });
        test('accepts options on trackEvent', () => {
            const { trackEvent } = Plausible();
            expect(requestSpy).not.toHaveBeenCalled();
            const options = getEventOptions();
            trackEvent('myEvent', options);
            expect(requestSpy).toHaveBeenCalled();
            expect(requestSpy).toHaveBeenCalledWith('myEvent', getDefaultData(), options);
        });
    });
    describe('pageView', () => {
        test('tracks pageview', () => {
            const { trackPageview } = Plausible();
            expect(requestSpy).not.toHaveBeenCalled();
            trackPageview();
            expect(requestSpy).toHaveBeenCalled();
            expect(requestSpy).toHaveBeenCalledWith('pageview', getDefaultData(), undefined);
        });
        test('accepts data on pageview', () => {
            const { trackPageview } = Plausible();
            expect(requestSpy).not.toHaveBeenCalled();
            const config = getCustomData();
            trackPageview(config);
            expect(requestSpy).toHaveBeenCalled();
            expect(requestSpy).toHaveBeenCalledWith('pageview', config, undefined);
        });
        test('accepts event options on pageview', () => {
            const { trackPageview } = Plausible();
            expect(requestSpy).not.toHaveBeenCalled();
            const options = getEventOptions();
            trackPageview({}, options);
            expect(requestSpy).toHaveBeenCalled();
            expect(requestSpy).toHaveBeenCalledWith('pageview', getDefaultData(), options);
        });
    });
    describe('enableAutoPageviews', () => {
        test('tracks first pageview', () => {
            const { enableAutoPageviews } = Plausible();
            expect(requestSpy).not.toHaveBeenCalled();
            const cleanup = enableAutoPageviews();
            expect(requestSpy).toHaveBeenCalledWith('pageview', getDefaultData(), undefined);
            cleanup();
        });
        test('does not track popstate if no history.pushState', () => {
            const originalPushState = history.pushState;
            const { enableAutoPageviews } = Plausible();
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
            const { enableAutoPageviews } = Plausible();
            expect(requestSpy).not.toHaveBeenCalled();
            const cleanup = enableAutoPageviews();
            expect(requestSpy).toHaveBeenCalledTimes(1);
            history.pushState({}, 'second', '/url');
            expect(requestSpy).toHaveBeenCalledTimes(2);
            cleanup();
        });
        test('tracks pageviews on popstate', () => {
            const { enableAutoPageviews } = Plausible();
            expect(requestSpy).not.toHaveBeenCalled();
            const cleanup = enableAutoPageviews();
            expect(requestSpy).toHaveBeenCalledTimes(1);
            window.dispatchEvent(new PopStateEvent('popstate'));
            expect(requestSpy).toHaveBeenCalledTimes(2);
            cleanup();
        });
        test('does not track hashchange by default', () => {
            const { enableAutoPageviews } = Plausible();
            expect(requestSpy).not.toHaveBeenCalled();
            const cleanup = enableAutoPageviews();
            expect(requestSpy).toHaveBeenCalledTimes(1);
            window.dispatchEvent(new HashChangeEvent('hashchange'));
            expect(requestSpy).toHaveBeenCalledTimes(1);
            cleanup();
        });
        test('tracks hashchange if specified', () => {
            const { enableAutoPageviews } = Plausible({ hashMode: true });
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
            const { enableAutoOutboundTracking } = Plausible(document);
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
            const { enableAutoOutboundTracking } = Plausible(document);
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
            const { enableAutoOutboundTracking } = Plausible(document);
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
            const { enableAutoOutboundTracking } = Plausible(document);
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
            const anchors = createAnchors(5);
            mountAnchors(anchors);
            const { enableAutoOutboundTracking } = Plausible(document);
            const cleanup = enableAutoOutboundTracking();
            expect(requestSpy).not.toHaveBeenCalled();
            // Remove nodes
            document.querySelector('div')?.remove();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhY2tlci5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi90cmFja2VyLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsOENBQThDO0FBQzlDLE9BQU8sS0FBSyxhQUFhLE1BQU0sV0FBVyxDQUFDO0FBQzNDLE9BQU8sU0FBK0IsTUFBTSxXQUFXLENBQUM7QUFFeEQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFFMUQsVUFBVSxDQUFDLEdBQUcsRUFBRTtJQUNkLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUNyQixVQUFVLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztBQUNsQyxDQUFDLENBQUMsQ0FBQztBQUVILFFBQVEsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO0lBQ3ZCLE1BQU0sY0FBYyxHQUFxQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzlELFFBQVEsRUFBRSxLQUFLO1FBQ2YsY0FBYyxFQUFFLEtBQUs7UUFDckIsR0FBRyxFQUFFLFFBQVEsQ0FBQyxJQUFJO1FBQ2xCLE1BQU0sRUFBRSxRQUFRLENBQUMsUUFBUTtRQUN6QixRQUFRLEVBQUUsUUFBUSxDQUFDLFFBQVEsSUFBSSxJQUFJO1FBQ25DLFdBQVcsRUFBRSxNQUFNLENBQUMsVUFBVTtRQUM5QixPQUFPLEVBQUUsc0JBQXNCO0tBQ2hDLENBQUMsQ0FBQztJQUVILE1BQU0sYUFBYSxHQUFxQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzdELFFBQVEsRUFBRSxJQUFJO1FBQ2QsY0FBYyxFQUFFLElBQUk7UUFDcEIsR0FBRyxFQUFFLG9CQUFvQjtRQUN6QixNQUFNLEVBQUUsZUFBZTtRQUN2QixRQUFRLEVBQUUsYUFBYTtRQUN2QixXQUFXLEVBQUUsSUFBSTtRQUNqQixPQUFPLEVBQUUsc0JBQXNCO0tBQ2hDLENBQUMsQ0FBQztJQUVILE1BQU0sZUFBZSxHQUErQyxH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