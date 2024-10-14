import { CachedGitHubData } from "./types";

// IN-MEMORY CACHE - STORE CACHED GITHUB DATA IN MEMORY
export const inMemoryCache: { current: CachedGitHubData | null } = { current: null };
