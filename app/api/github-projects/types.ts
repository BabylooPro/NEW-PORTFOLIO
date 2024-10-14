// GITHUB DATA
export interface GitHubData {
	data: {
		user: {
			pinnedItems: { edges: Array<unknown> };
			repositories: {
				nodes: Array<{
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
				}>;
				pageInfo?: { hasNextPage: boolean; endCursor: string | null };
			};
		};
	};
	updatedAt: string;
}

// CACHED GITHUB DATA
export interface CachedGitHubData extends GitHubData {
	updatedAt: string;
}

// GITHUB VARIABLES
export interface GitHubVariables {
	login: string;
	cursor?: string;
}
