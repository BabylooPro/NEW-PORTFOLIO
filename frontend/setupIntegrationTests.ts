/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// MOCK FETCH
const fetchSpy = jest.spyOn(global, 'fetch');

// SETUP TEXT ENCODER/DECODER
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// CLEANUP
afterEach(() => {
    fetchSpy.mockClear();
});
