/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data */
import { sendEvent } from './request';
const getXhrMockClass = () => ({
    open: jest.fn(),
    send: jest.fn(),
    setRequestHeader: jest.fn(),
    onreadystatechange: jest.fn(),
    readyState: 0,
    ready(state) {
        this.readyState = state;
        this.onreadystatechange();
    },
});
let xhrMockClass;
const xmr = jest.spyOn(window, 'XMLHttpRequest');
const defaultData = {
    hashMode: false,
    trackLocalhost: false,
    url: 'https://my-app.com/my-url',
    domain: 'my-app.com',
    referrer: null,
    deviceWidth: 1080,
    apiHost: 'https://plausible.io',
};
const oldLocation = window.location;
const windowLocation = JSON.stringify(window.location);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
delete window['location'];
Object.defineProperty(window, 'location', {
    value: JSON.parse(windowLocation),
});
beforeEach(() => {
    jest.clearAllMocks();
    xhrMockClass = getXhrMockClass();
    xmr.mockReturnValue(xhrMockClass);
    window.location.hostname = 'my-app.com';
    window.location.protocol = 'http:';
});
afterAll(() => {
    Object.defineProperty(window, 'location', oldLocation);
});
describe('sendEvent', () => {
    test('sends default event', () => {
        expect(xmr).not.toHaveBeenCalled();
        sendEvent('myEvent', defaultData);
        xhrMockClass.ready(4);
        expect(xmr).toHaveBeenCalledTimes(1);
        expect(xhrMockClass.open).toHaveBeenCalledWith('POST', `${defaultData.apiHost}/api/event`, true);
        expect(xhrMockClass.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
        const payload = {
            n: 'myEvent',
            u: defaultData.url,
            d: defaultData.domain,
            r: defaultData.referrer,
            w: defaultData.deviceWidth,
            h: 0,
        };
        expect(xhrMockClass.send).toHaveBeenCalledWith(JSON.stringify(payload));
    });
    test('hash mode', () => {
        expect(xmr).not.toHaveBeenCalled();
        sendEvent('myEvent', { ...defaultData, hashMode: true });
        const payload = {
            n: 'myEvent',
            u: defaultData.url,
            d: defaultData.domain,
            r: defaultData.referrer,
            w: defaultData.deviceWidth,
            h: 1,
        };
        expect(xhrMockClass.send).toHaveBeenCalledWith(JSON.stringify(payload));
    });
    test('does not send to localhost', () => {
        window.location.hostname = 'localhost';
        expect(xmr).not.toHaveBeenCalled();
        sendEvent('myEvent', defaultData);
        expect(xmr).not.toHaveBeenCalled();
    });
    test('does not send if local file', () => {
        window.location.protocol = 'file:';
        expect(xmr).not.toHaveBeenCalled();
        sendEvent('myEvent', defaultData);
        expect(xmr).not.toHaveBeenCalled();
    });
    test('sends to localhost if trackLocalhost', () => {
        window.location.hostname = 'localhost';
        expect(xmr).not.toHaveBeenCalled();
        sendEvent('myEvent', { ...defaultData, trackLocalhost: true });
        expect(xmr).toHaveBeenCalled();
    });
    test('does not send if "plausible_ignore" is set to "true" in localStorage', () => {
        window.localStorage.setItem('plausible_ignore', 'true');
        expect(xmr).not.toHaveBeenCalled();
        sendEvent('myEvent', defaultData);
        expect(xmr).not.toHaveBeenCalled();
        window.localStorage.setItem('plausible_ignore', 'something-not-true');
        sendEvent('myEvent', defaultData);
        expect(xmr).toHaveBeenCalled();
        window.localStorage.removeItem('plausible_ignore');
    });
    test('does not throw an error if localStorage is not available', () => {
        const localStorage = window.localStorage;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete window['localStorage'];
        expect(xmr).not.toHaveBeenCalled();
        sendEvent('myEvent', defaultData);
        expect(xmr).toHaveBeenCalled();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.localStorage = localStorage;
    });
    test('calls callback', () => {
        expect(xmr).not.toHaveBeenCalled();
        const callback = jest.fn();
        sendEvent('myEvent', defaultData, { callback });
        expect(callback).not.toHaveBeenCalled();
        xhrMockClass.ready(3);
        expect(callback).not.toHaveBeenCalled();
        xhrMockClass.ready(4);
        expect(callback).toHaveBeenCalled();
    });
    test('sends props', () => {
        expect(xmr).not.toHaveBeenCalled();
        const props = { variation1: 'A', variation2: 'B' };
        sendEvent('myEvent', defaultData, { props });
        const payload = {
            n: 'myEvent',
            u: defaultData.url,
            d: defaultData.domain,
            r: defaultData.referrer,
            w: defaultData.deviceWidth,
            h: 0,
            p: JSON.stringify(props),
        };
        expect(xhrMockClass.send).toHaveBeenCalledWith(JSON.stringify(payload));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9yZXF1ZXN0LnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsc0NBQXNDO0FBQ3RDLDhDQUE4QztBQUM5QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBR3RDLE1BQU0sZUFBZSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDN0IsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUU7SUFDZixJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRTtJQUNmLGdCQUFnQixFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUU7SUFDM0Isa0JBQWtCLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRTtJQUM3QixVQUFVLEVBQUUsQ0FBQztJQUNiLEtBQUssQ0FBQyxLQUFhO1FBQ2pCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0lBQzVCLENBQUM7Q0FDRixDQUFDLENBQUM7QUFFSCxJQUFJLFlBQWdELENBQUM7QUFFckQsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztBQUVqRCxNQUFNLFdBQVcsR0FBK0I7SUFDOUMsUUFBUSxFQUFFLEtBQUs7SUFDZixjQUFjLEVBQUUsS0FBSztJQUNyQixHQUFHLEVBQUUsMkJBQTJCO0lBQ2hDLE1BQU0sRUFBRSxZQUFZO0lBQ3BCLFFBQVEsRUFBRSxJQUFJO0lBQ2QsV0FBVyxFQUFFLElBQUk7SUFDakIsT0FBTyxFQUFFLHNCQUFzQjtDQUNoQyxDQUFDO0FBRUYsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUVwQyxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN2RCw2REFB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