/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextEncoder, TextDecoder } from "util";
import "whatwg-fetch";

global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;
