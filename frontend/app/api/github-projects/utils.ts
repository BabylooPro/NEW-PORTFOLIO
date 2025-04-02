import { GITHUB_PROJECTS_QUERY } from "../../../src/lib/githubQueries";
import { GitHubData, CachedGitHubData } from "./types";

const GITHUB_API_URL = "https://api.github.com/graphql";
const GITHUB_USERNAME = "BabylooPro";

// CHECK FOR UPDATES
export async function checkForUpdates(
    fetchFn = fetch,
    cachedData: CachedGitHubData | null
): Promise<boolean> {
    // RETURN TRUE IF NO CACHED DATA
    if (!cachedData) return true;

    // TRY CATCH BLOCK
    try {
        const response = await fetchFn(GITHUB_API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.GIT_HUB_ACCESS_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: GITHUB_PROJECTS_QUERY,
                variables: { login: GITHUB_USERNAME, cursor: null },
            }),
        });

        // RETURN ERROR IF API RESPONSE IS NOT OK
        if (!response.ok) {
            throw new Error(`GitHub API responded with status ${response.status}`);
        }

        // GET NEW DATA
        const newData = await response.json();

        // CHECK IF DATA HAS CHANGED
        const hasChanges = JSON.stringify(newData.data) !== JSON.stringify(cachedData.data);

        // RETURN TRUE IF DATA HAS CHANGED
        return hasChanges;
    } catch (error) {
        // RETURN FALSE IF ERROR
        console.error("Error checking for updates:", error);
        return false;
    }
}

// FETCH GITHUB DATA
export async function fetchGitHubData(): Promise<GitHubData> {
    // INITIALIZE VARIABLES
    let allNodes: GitHubData["data"]["user"]["repositories"]["nodes"] = [];
    let pinnedItems: GitHubData["data"]["user"]["pinnedItems"]["edges"] = [];
    let hasNextPage = true;
    let cursor: string | null = null;

    // FETCH DATA WHILE THERE IS A NEXT PAGE
    while (hasNextPage) {
        const response = await fetch(GITHUB_API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.GIT_HUB_ACCESS_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: GITHUB_PROJECTS_QUERY,
                variables: { login: GITHUB_USERNAME, cursor },
            }),
        });

        // RETURN ERROR IF API RESPONSE IS NOT OK
        if (!response.ok) {
            throw new Error(`GitHub API responded with status ${response.status}`);
        }

        const data: GitHubData = await response.json(); // GET DATA

        // STORE REPOSITORIES
        if (data.data?.user?.repositories?.nodes) {
            allNodes = [...allNodes, ...data.data.user.repositories.nodes];
        }

        // STORE PINNED ITEMS
        if (data.data?.user?.pinnedItems?.edges) {
            pinnedItems = data.data.user.pinnedItems.edges;
        }

        // CHECK IF THERE IS A NEXT PAGE
        hasNextPage = data.data?.user?.repositories?.pageInfo?.hasNextPage ?? false;
        cursor = data.data?.user?.repositories?.pageInfo?.endCursor ?? null;
    }

    // RETURN GITHUB DATA
    return {
        data: {
            user: {
                pinnedItems: { edges: pinnedItems },
                repositories: {
                    nodes: allNodes,
                    pageInfo: { hasNextPage: false, endCursor: null },
                },
            },
        },
        updatedAt: new Date().toISOString(),
    };
}
