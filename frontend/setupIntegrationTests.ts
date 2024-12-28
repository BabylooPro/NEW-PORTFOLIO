/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import "./jest.setup";
import fetch from "node-fetch";

// SETUP GLOBAL FETCH
global.fetch = fetch as any;
global.Request = fetch.Request as any;
global.Response = fetch.Response as any;
global.Headers = fetch.Headers as any;

// MOCK NEXT/SERVER
jest.mock("next/server", () => {
    const actual = jest.requireActual("next/server");
    return {
        ...actual,
        NextResponse: {
            json: (data: any, init?: any) => {
                return {
                    status: init?.status || 200,
                    json: async () => data,
                    headers: new Map(),
                };
            },
        },
    };
});

// SETUP WINDOW MEDIA QUERY
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
