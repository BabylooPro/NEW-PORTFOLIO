/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import "./jest.setup";
import "isomorphic-fetch";

// SETUP GLOBAL FETCH
global.fetch = fetch as any;
global.Request = Request as any;
global.Response = Response as any;
global.Headers = Headers as any;

if (typeof window !== 'undefined') {
    Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        })),
    });
}
