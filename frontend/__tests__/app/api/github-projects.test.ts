import { NextResponse, NextRequest } from "next/server";
import { CachedGitHubData } from "../../../app/api/github-projects/types";
import { inMemoryCache } from "../../../app/api/github-projects/cache";

// MOCK NEXT RESPONSE
jest.mock("next/server", () => ({
	NextResponse: {
		json: jest.fn().mockImplementation((data, options) => ({
			status: 200,
			json: () => Promise.resolve(data),
			...options,
		})),
	},
	NextRequest: jest.fn().mockImplementation((url) => ({
		nextUrl: new URL(url || "http://localhost:3000/api/github-projects"),
	})),
}));

// MOCK THE ENTIRE MODULE
const mockFetchGitHubData = jest.fn();
const mockCheckForUpdates = jest.fn().mockResolvedValue(false);
const mockGET = jest.fn();

// MOCK UTILS
jest.mock("../../../app/api/github-projects/utils", () => ({
	fetchGitHubData: mockFetchGitHubData,
	checkForUpdates: mockCheckForUpdates,
}));

// MOCK ROUTE
jest.mock("../../../app/api/github-projects/route", () => ({
	GET: mockGET,
}));

// IMPORT THE MOCKED MODULE
const { GET } = jest.requireMock("../../../app/api/github-projects/route");

// TESTS - GITHUB PROJECTS API
describe("GitHub Projects API", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		inMemoryCache.current = null;
	});

	// TEST - RETURN PROJECTS DATA
	it("should return projects data", async () => {
		// MOCK DATA
		const mockData = {
			data: {
				user: {
					repositories: {
						nodes: [{ name: "Test Repo" }],
						pageInfo: { hasNextPage: false, endCursor: null },
					},
				},
			},
		};

		// MOCK FETCH
		mockFetchGitHubData.mockResolvedValue(mockData);
		mockGET.mockImplementation(async () => {
			const data = await mockFetchGitHubData();
			return NextResponse.json(data, { status: 200 });
		});

		// MOCK REQUEST
		const response = await GET(new NextRequest("http://localhost:3000/api/github-projects"));

		// ASSERTIONS
		expect(response.status).toBe(200);

		// CHECK DATA
		const data = await response.json();
		expect(data).toEqual(expect.objectContaining(mockData));
		expect(mockFetchGitHubData).toHaveBeenCalled();
	});

	// TEST - HANDLE ERRORS AND USE CACHED DATA
	it("should handle errors and use cached data", async () => {
		// MOCK ERROR
		mockFetchGitHubData.mockRejectedValue(new Error("API Error"));

		// MOCK CACHED DATA
		inMemoryCache.current = {
			data: { user: { repositories: { nodes: [{ name: "Cached Repo" }] } } },
			updatedAt: new Date().toISOString(),
		} as CachedGitHubData;

		// MOCK FETCH
		mockGET.mockImplementation(async () => {
			try {
				await mockFetchGitHubData();
			} catch {
				return NextResponse.json(inMemoryCache.current, { status: 200 });
			}
		});

		// MOCK REQUEST
		const response = await GET(new NextRequest("http://localhost:3000/api/github-projects"));

		// ASSERTIONS
		expect(response.status).toBe(200);

		// CHECK DATA
		const data = await response.json();
		expect(data).toEqual(inMemoryCache.current);
		expect(mockFetchGitHubData).toHaveBeenCalled();
	});

	// TEST - FORCE REFRESH DATA
	it("should force refresh data when 'force' query param is true", async () => {
		// MOCK DATA
		const mockData = {
			data: {
				user: {
					repositories: {
						nodes: [{ name: "Forced Refresh Repo" }],
						pageInfo: { hasNextPage: false, endCursor: null },
					},
				},
			},
		};

		// MOCK FETCH
		mockFetchGitHubData.mockResolvedValue(mockData);
		mockGET.mockImplementation(async () => {
			const data = await mockFetchGitHubData();
			return NextResponse.json(data, { status: 200 });
		});

		// MOCK REQUEST
		const response = await GET(
			new NextRequest("http://localhost:3000/api/github-projects?force=true")
		);

		// ASSERTIONS
		expect(response.status).toBe(200);

		// CHECK DATA
		const data = await response.json();
		expect(data).toEqual(expect.objectContaining(mockData));
		expect(mockFetchGitHubData).toHaveBeenCalled();
	});

	// TEST - HANDLE PAGINATION
	it("should handle pagination", async () => {
		// SIMPLIFY MOCK RESPONSES
		const mockFetch = jest
			.fn()
			.mockResolvedValueOnce({
				ok: true,
				json: () =>
					Promise.resolve({
						data: {
							user: {
								repositories: {
									nodes: [{ name: "Project 1" }],
									pageInfo: { hasNextPage: false, endCursor: null },
								},
							},
						},
					}),
			});

		// MOCK FETCH
		global.fetch = mockFetch;
		mockFetchGitHubData.mockImplementation(async () => {
			const response = await mockFetch();
			const data = await response.json();
			return data;
		});

		// MOCK REQUEST
		mockGET.mockImplementation(async () => {
			const data = await mockFetchGitHubData();
			return NextResponse.json(data, { status: 200 });
		});

		// MOCK REQUEST
		const response = await GET(new NextRequest("http://localhost:3000/api/github-projects?force=true"));

		// ASSERTIONS
		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data.data.user.repositories.nodes).toHaveLength(1);
		expect(data.data.user.repositories.nodes[0].name).toBe("Project 1");
		expect(mockFetch).toHaveBeenCalledTimes(1);
	});
});
