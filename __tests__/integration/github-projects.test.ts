import { checkForUpdates } from "../../app/api/github-projects/utils";
import { CachedGitHubData } from "../../app/api/github-projects/types";

// MOCK GLOBAL OBJECT
type GlobalWithCachedData = typeof globalThis & {
	cachedData: CachedGitHubData | null;
};

// MOCK NEXT SERVER
jest.mock("next/server", () => ({
	NextRequest: jest.fn().mockImplementation(() => ({
		nextUrl: {
			searchParams: new URLSearchParams(),
		},
	})),
	NextResponse: {
		json: jest.fn().mockImplementation((body) => ({ json: () => Promise.resolve(body) })),
	},
}));

// TESTS - GITHUB PROJECTS API
describe("GitHub Projects API", () => {
	beforeEach(() => {
		jest.resetAllMocks();
		(global as GlobalWithCachedData).cachedData = null;
	});

	// TEST - GET FUNCTION
	// describe("GET function", () => {
	// TODO: Add tests for the GET function
	// });

	// TEST - CHECK FOR UPDATES FUNCTION
	describe("checkForUpdates function", () => {
		// RESET CACHED DATA
		beforeEach(() => {
			(global as GlobalWithCachedData).cachedData = null;
		});

		// TEST - NO CACHED DATA
		it("should return true when there is no cached data", async () => {
			// MOCK FETCH
			const mockFetch = jest.fn().mockResolvedValue({
				ok: true,
				json: jest.fn().mockResolvedValue({
					data: {
						user: {
							repositories: {
								nodes: [
									{
										name: "new-repo",
										description: null,
										url: "https://github.com/test/new-repo",
										stargazers: { totalCount: 0 },
										forks: { totalCount: 0 },
										languages: { nodes: [] },
										repositoryTopics: { nodes: [] },
										createdAt: new Date().toISOString(),
										updatedAt: new Date().toISOString(),
										licenseInfo: null,
										isPrivate: false,
									},
								],
							},
						},
						updatedAt: new Date().toISOString(),
					},
				}),
			});

			// ASSERTIONS
			const result = await checkForUpdates(mockFetch, null);
			expect(result).toBe(true);
		});

		// TEST - DATA CHANGED
		it("should return true when there are changes in the data", async () => {
			// MOCK OLD DATA WITH COMPLETE TYPE STRUCTURE
			const oldData: CachedGitHubData = {
				data: {
					user: {
						pinnedItems: { edges: [] },
						repositories: {
							nodes: [{
								name: "old-repo",
								description: null,
								url: "https://github.com/test/old-repo",
								stargazers: { totalCount: 0 },
								forks: { totalCount: 0 },
								languages: { nodes: [] },
								repositoryTopics: { nodes: [] },
								createdAt: new Date(Date.now() - 3600000).toISOString(),
								updatedAt: new Date(Date.now() - 3600000).toISOString(),
								licenseInfo: null,
								isPrivate: false
							}],
							pageInfo: { hasNextPage: false, endCursor: null }
						}
					}
				},
				updatedAt: new Date(Date.now() - 3600000).toISOString()
			};

			// MOCK FETCH WITH MATCHING STRUCTURE
			const mockFetch = jest.fn().mockResolvedValue({
				ok: true,
				json: jest.fn().mockResolvedValue({
					data: {
						user: {
							pinnedItems: { edges: [] },
							repositories: {
								nodes: [{
									name: "new-repo",
									description: null,
									url: "https://github.com/test/new-repo",
									stargazers: { totalCount: 0 },
									forks: { totalCount: 0 },
									languages: { nodes: [] },
									repositoryTopics: { nodes: [] },
									createdAt: new Date().toISOString(),
									updatedAt: new Date().toISOString(),
									licenseInfo: null,
									isPrivate: false
								}],
								pageInfo: { hasNextPage: false, endCursor: null }
							}
						}
					}
				})
			});

			// ASSERTIONS
			const result = await checkForUpdates(mockFetch, oldData);
			expect(result).toBe(true);
		});

		// TEST - API ERRORS
		// it("should handle API errors gracefully", async () => {
		// TODO: ADD TESTS FOR CHECK FOR UPDATES FUNCTION
		// });
	});
});
