"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data */
const request_1 = require("./request");
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
        request_1.sendEvent('myEvent', defaultData);
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
        request_1.sendEvent('myEvent', Object.assign(Object.assign({}, defaultData), { hashMode: true }));
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
        request_1.sendEvent('myEvent', defaultData);
        expect(xmr).not.toHaveBeenCalled();
    });
    test('does not send if local file', () => {
        window.location.protocol = 'file:';
        expect(xmr).not.toHaveBeenCalled();
        request_1.sendEvent('myEvent', defaultData);
        expect(xmr).not.toHaveBeenCalled();
    });
    test('sends to localhost if trackLocalhost', () => {
        window.location.hostname = 'localhost';
        expect(xmr).not.toHaveBeenCalled();
        request_1.sendEvent('myEvent', Object.assign(Object.assign({}, defaultData), { trackLocalhost: true }));
        expect(xmr).toHaveBeenCalled();
    });
    test('does not send if "plausible_ignore" is set to "true" in localStorage', () => {
        window.localStorage.setItem('plausible_ignore', 'true');
        expect(xmr).not.toHaveBeenCalled();
        request_1.sendEvent('myEvent', defaultData);
        expect(xmr).not.toHaveBeenCalled();
        window.localStorage.setItem('plausible_ignore', 'something-not-true');
        request_1.sendEvent('myEvent', defaultData);
        expect(xmr).toHaveBeenCalled();
        window.localStorage.removeItem('plausible_ignore');
    });
    test('does not throw an error if localStorage is not available', () => {
        const localStorage = window.localStorage;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete window['localStorage'];
        expect(xmr).not.toHaveBeenCalled();
        request_1.sendEvent('myEvent', defaultData);
        expect(xmr).toHaveBeenCalled();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.localStorage = localStorage;
    });
    test('calls callback', () => {
        expect(xmr).not.toHaveBeenCalled();
        const callback = jest.fn();
        request_1.sendEvent('myEvent', defaultData, { callback });
        expect(callback).not.toHaveBeenCalled();
        xhrMockClass.ready(3);
        expect(callback).not.toHaveBeenCalled();
        xhrMockClass.ready(4);
        expect(callback).toHaveBeenCalled();
    });
    test('sends props', () => {
        expect(xmr).not.toHaveBeenCalled();
        const props = { variation1: 'A', variation2: 'B' };
        request_1.sendEvent('myEvent', defaultData, { props });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9yZXF1ZXN0LnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBc0M7QUFDdEMsOENBQThDO0FBQzlDLHVDQUFzQztBQUd0QyxNQUFNLGVBQWUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzdCLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFO0lBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUU7SUFDZixnQkFBZ0IsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFO0lBQzNCLGtCQUFrQixFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUU7SUFDN0IsVUFBVSxFQUFFLENBQUM7SUFDYixLQUFLLENBQUMsS0FBYTtRQUNqQixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztRQUN4QixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztJQUM1QixDQUFDO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsSUFBSSxZQUFnRCxDQUFDO0FBRXJELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLGdCQUFnQixDQUFDLENBQUM7QUFFakQsTUFBTSxXQUFXLEdBQStCO0lBQzlDLFFBQVEsRUFBRSxLQUFLO0lBQ2YsY0FBYyxFQUFFLEtBQUs7SUFDckIsR0FBRyxFQUFFLDJCQUEyQjtJQUNoQyxNQUFNLEVBQUUsWUFBWTtJQUNwQixRQUFRLEVBQUUsSUFBSTtJQUNkLFdBQVcsRUFBRSxJQUFJO0lBQ2pCLE9BQU8sRUFBRSxzQkFBc0I7Q0FDaEMsQ0FBQztBQUVGLE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFFcEMsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDdkQsNkRBQTZEO0FBQzdELGFBQWE7QUFDYixPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMxQixNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUU7SUFDeEMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDO0NBQ2xDLENBQUMsQ0FBQztBQUVILFVBQVUsQ0FBQyxHQUFHLEVBQUU7SUFDZCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDckIsWUFBWSxHQUFHLGVBQWUsRUFBRSxDQUFDO0lBQ2pDLEdBQUcsQ0FBQyxlQUFlLENBQUUsWUFBMEMsQ0FBQyxDQUFDO0lBQ2pFLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQztJQUN4QyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7QUFDckMsQ0FBQyxDQUFDLENBQUM7QUFFSCxRQUFRLENBQUMsR0FBRyxFQUFFO0lBQ1osTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ3pELENBQUMsQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7SUFDekIsSUFBSSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRTtRQUMvQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDbkMsbUJBQVMsQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDbEMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxvQkFBb0IsQ0FDNUMsTUFBTSxFQUNOLEdBQUcsV0FBVyxDQUFDLE9BQU8sWUFBWSxFQUNsQyxJQUFJLENBQ0wsQ0FBQztRQUNGLE1BQU0sQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxvQkFBb0IsQ0FDeEQsY0FBYyxFQUNkLFlBQVksQ0FDYixDQUFDO1FBRUYsTUFBTSxPQUFPLEdBQUc7WUFDZCxDQUFDLEVBQUUsU0FBUztZQUNaLENBQUMsRUFBRSxXQUFXLENBQUMsR0FBRztZQUNsQixDQUFDLEVBQUUsV0FBVyxDQUFDLE1BQU07WUFDckIsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxRQUFRO1lBQ3ZCLENBQUMsRUFBRSxXQUFXLENBQUMsV0FBVztZQUMxQixDQUFDLEVBQUUsQ0FBQztTQUNMLENBQUM7UUFFRixNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUMxRSxDQUFDLENBQUMsQ0FBQztJQUNILElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO1FBQ3JCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUNuQyxtQkFBUyxDQUFDLFNBQVMsa0NBQU8sV0FBVyxLQUFFLFFBQVEsRUFBRSxJQUFJLElBQUcsQ0FBQztRQUV6RCxNQUFNLE9BQU8sR0FBRztZQUNkLENBQUMsRUFBRSxTQUFTO1lBQ1osQ0FBQyxFQUFFLFdBQVcsQ0FBQyxHQUFHO1lBQ2xCLENBQUMsRUFBRSxXQUFXLENBQUMsTUFBTTtZQUNyQixDQUFDLEVBQUUsV0FBVyxDQUFDLFFBQVE7WUFDdkIsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxXQUFXO1lBQzFCLENBQUMsRUFBRSxDQUFDO1NBQ0wsQ0FBQztRQUVGLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQzFFLENBQUMsQ0FBQyxDQUFDO0lBQ0gsSUFBSSxDQUFDLDRCQUE0QixFQUFFLEdBQUcsRUFBRTtRQUN0QyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUM7UUFDdkMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQ25DLG1CQUFTLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztJQUNyQyxDQUFDLENBQUMsQ0FBQztJQUNILElBQUksQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUU7UUFDdkMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1FBQ25DLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUNuQyxtQkFBUyxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNsQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDckMsQ0FBQyxDQUFDLENBQUM7SUFDSCxJQUFJLENBQUMsc0NBQXNDLEVBQUUsR0FBRyxFQUFFO1FBQ2hELE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQztRQUN2QyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDbkMsbUJBQVMsQ0FBQyxTQUFTLGtDQUFPLFdBQVcsS0FBRSxjQUFjLEVBQUUsSUFBSSxJQUFHLENBQUM7UUFDL0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDakMsQ0FBQyxDQUFDLENBQUM7SUFDSCxJQUFJLENBQUMsc0VBQXNFLEVBQUUsR0FBRyxFQUFFO1FBQ2hGLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3hELE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUNuQyxtQkFBUyxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNsQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFFbkMsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztRQUN0RSxtQkFBUyxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNsQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUUvQixNQUFNLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQ3JELENBQUMsQ0FBQyxDQUFDO0lBQ0gsSUFBSSxDQUFDLDBEQUEwRCxFQUFFLEdBQUcsRUFBRTtRQUNwRSxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDO1FBQ3pDLDZEQUE2RDtRQUM3RCxhQUFhO1FBQ2IsT0FBTyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFOUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQ25DLG1CQUFTLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBRS9CLDZEQUE2RDtRQUM3RCxhQUFhO1FBQ2IsTUFBTSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7SUFDckMsQ0FBQyxDQUFDLENBQUM7SUFDSCxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFO1FBQzFCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUNuQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDM0IsbUJBQVMsQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUNoRCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDeEMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDeEMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztJQUN0QyxDQUFDLENBQUMsQ0FBQztJQUNILElBQUksQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFO1FBQ3ZCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUNuQyxNQUFNLEtBQUssR0FBRyxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ25ELG1CQUFTLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFFN0MsTUFBTSxPQUFPLEdBQUc7WUFDZCxDQUFDLEVBQUUsU0FBUztZQUNaLENBQUMsRUFBRSxXQUFXLENBQUMsR0FBRztZQUNsQixDQUFDLEVBQUUsV0FBVyxDQUFDLE1BQU07WUFDckIsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxRQUFRO1lBQ3ZCLENBQUMsRUFBRSxXQUFXLENBQUMsV0FBVztZQUMxQixDQUFDLEVBQUUsQ0FBQztZQUNKLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztTQUN6QixDQUFDO1FBRUYsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDMUUsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9