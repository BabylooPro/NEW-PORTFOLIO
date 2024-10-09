import { NextResponse } from "next/server";
import { GITHUB_PROJECTS_QUERY } from "@/lib/githubQueries";

// DEFINE STRUCTURE OF A GITHUB REPOSITORY
interface Repository {
	name: string;
	description: string | null;
	url: string;
	stargazers: { totalCount: number };
	forks: { totalCount: number };
	languages: { nodes: Array<{ name: string }> };
	repositoryTopics: { nodes: Array<{ topic: { name: string } }> };
	createdAt: string;
	updatedAt: string;
	licenseInfo: { name: string } | null;
	isPrivate: boolean;
}

// DEFINE STRUCTURE OF GITHUB API RESPONSE
interface GitHubApiResponse {
	data: {
		user: {
			pinnedItems: {
				edges: Array<{ node: Repository }>;
			};
			repositories: {
				nodes: Repository[];
				pageInfo: {
					hasNextPage: boolean;
					endCursor: string | null;
				};
			};
		};
	};
}

// CACHE DATA
let cachedData: (GitHubApiResponse & { lastUpdate: string }) | null = null;
let lastCheckTime = 0;

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const forceRefresh = searchParams.get("force") === "true";

	const now = Date.now();

	// CHECK IF NEED TO REFRESH DATA
	const shouldRefresh = forceRefresh || !cachedData || now - lastCheckTime >= 3600000;

	if (shouldRefresh) {
		const hasUpdates = await checkForUpdates();

		if (hasUpdates || !cachedData) {
			// FETCH GITHUB PROJECTS DATA
			try {
				// INITIALIZE DATA STRUCTURE TO STORE ALL FETCHED REPOSITORIES
				const allData: GitHubApiResponse = {
					data: {
						user: {
							pinnedItems: { edges: [] },
							repositories: {
								nodes: [],
								pageInfo: { hasNextPage: false, endCursor: null },
							},
						},
					},
				};

				// INITIALIZE PAGINATION VARIABLES
				let hasNextPage = true;
				let cursor: string | null = null;

				// LOOP THROUGH ALL PAGES OF REPOSITORY DATA
				while (hasNextPage) {
					// SEND POST REQUEST TO GITHUB GRAPHQL API
					const response: Response = await fetch("https://api.github.com/graphql", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${process.env.GIT_HUB_ACCESS_TOKEN}`,
						},
						body: JSON.stringify({
							query: GITHUB_PROJECTS_QUERY,
							variables: { login: "babyloopro", cursor: cursor },
						}),
					});

					// CHECK IF RESPONSE IS SUCCESSFUL
					if (!response.ok) {
						console.error(
							`GitHub API error: ${response.status} ${response.statusText}`
						);
						const errorText = await response.text();
						console.error(`Error response body: ${errorText}`);
						throw new Error(`GitHub API error: ${response.statusText}`);
					}

					// PARSE JSON RESPONSE
					const data: GitHubApiResponse = await response.json();

					// VALIDATE RESPONSE STRUCTURE
					if (!data.data?.user?.repositories?.pageInfo) {
						console.error("Unexpected data structure:", data);
						throw new Error("Unexpected data structure from GitHub API");
					}

					// STORE PINNED ITEMS (ONLY ON FIRST ITERATION)
					if (
						allData.data.user.pinnedItems.edges.length === 0 &&
						data.data.user.pinnedItems
					) {
						allData.data.user.pinnedItems = data.data.user.pinnedItems;
					}

					// APPEND NEW REPOSITORIES TO EXISTING LIST
					if (data.data.user.repositories.nodes) {
						allData.data.user.repositories.nodes = [
							...allData.data.user.repositories.nodes,
							...data.data.user.repositories.nodes,
						];
					}

					// UPDATE PAGINATION VARIABLES FOR NEXT ITERATION
					hasNextPage = data.data.user.repositories.pageInfo.hasNextPage;
					cursor = data.data.user.repositories.pageInfo.endCursor;
				}

				// UPDATE TIMESTAMP OF LAST UPDATE AND CACHE ONLY IF DATA HAS CHANGED
				if (hasUpdates || !cachedData) {
					const lastUpdateTime = new Date().toISOString();
					cachedData = { ...allData, lastUpdate: lastUpdateTime };
					console.log("Cache updated with new data:", lastUpdateTime);
				}
			} catch (error: unknown) {
				// ERROR HANDLING
				console.error("Error in GET function:");
				if (error instanceof Error) {
					console.error(error.message);
					console.error(error.stack);
				} else {
					console.error(String(error));
				}
				// RETURN ERROR RESPONSE
				return NextResponse.json(
					{ error: "Failed to fetch GitHub projects" },
					{ status: 500 }
				);
			}
		} else {
			console.log("No updates found, using cached data");
		}
		lastCheckTime = now;
	}

	// RETURN CACHED DATA AS JSON RESPONSE
	return NextResponse.json(cachedData, {
		headers: {
			"Cache-Control": "public, max-age=3600, s-maxage=3600",
			Pragma: "no-cache",
			Expires: "0",
		},
	});
}

async function checkForUpdates(): Promise<boolean> {
	if (!cachedData) return true;

	const response = await fetch("https://api.github.com/graphql", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.GIT_HUB_ACCESS_TOKEN}`,
		},
		body: JSON.stringify({
			query: GITHUB_PROJECTS_QUERY,
			variables: { login: "babyloopro", cursor: null },
		}),
	});

	if (!response.ok) {
		console.error(`GitHub API error: ${response.status} ${response.statusText}`);
		return false;
	}

	const newData = await response.json();

	// COMPARE NEW DATA WITH CACHED DATA
	const hasChanges = JSON.stringify(newData.data) !== JSON.stringify(cachedData.data);

	if (hasChanges) {
		console.log("Changes detected in GitHub data");
	} else {
		console.log("No changes detected in GitHub data");
	}

	return hasChanges;
}
