import useSWR from "swr";

interface GitHubRepo {
	name: string;
	description: string;
	html_url: string;
	language: string;
	stargazers_count: number;
	forks_count: number;
	pinned?: boolean;
}

interface PinnedRepo {
	name: string;
	description: string;
	url: string;
	primaryLanguage: {
		name: string;
	};
	stargazers: {
		totalCount: number;
	};
	forks: {
		totalCount: number;
	};
}

interface AllRepo {
	name: string;
	description: string;
	url: string;
	primaryLanguage: {
		name: string;
	};
	stargazers: {
		totalCount: number;
	};
	forks: {
		totalCount: number;
	};
}

// DEFINE A GENERIC FETCHER TO GET DATA
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useGitHubProjects = () => {
	// USE SWR TO FETCH PROJECTS FROM NEXT.JS API
	const { data, error } = useSWR("/api/github-projects", fetcher);

	// DEFINE REPOS TO EXCLUDE
	const excludedRepos = ["BabylooPro", "CUSTOM-ONE-DARK-PRO-THEME"];

	// IF AN ERROR OCCURS
	if (error) {
		return {
			projects: [],
			error: "Failed to fetch GitHub projects",
			loading: false,
		};
	}

	// IF DATA IS NOT LOADED YET
	if (!data) {
		return {
			projects: [],
			error: null,
			loading: true,
		};
	}

	// CHECK IF DATA EXISTS
	if (!data.data || !data.data.user) {
		return {
			projects: [],
			error: "Invalid response from GitHub API",
			loading: false,
		};
	}

	// TRANSFORM DATA FROM SWR
	const pinnedRepos: GitHubRepo[] = data.data.user.pinnedItems.edges.map(
		(edge: { node: PinnedRepo }) => ({
			name: edge.node.name,
			description: edge.node.description,
			html_url: edge.node.url,
			language: edge.node.primaryLanguage?.name || "Unknown",
			stargazers_count: edge.node.stargazers.totalCount,
			forks_count: edge.node.forks.totalCount,
			pinned: true,
		})
	);

	// GET ALL REPOS FROM GITHUB
	const allRepos: GitHubRepo[] = data.data.user.repositories.nodes.map((node: AllRepo) => ({
		name: node.name,
		description: node.description,
		html_url: node.url,
		language: node.primaryLanguage?.name || "Unknown",
		stargazers_count: node.stargazers.totalCount,
		forks_count: node.forks.totalCount,
	}));

	// FILTER REPOS FOR EXCLUDED REPOS
	const filteredRepos = allRepos.filter(
		(repo: GitHubRepo) =>
			!excludedRepos.includes(repo.name) &&
			!pinnedRepos.some((pinned) => pinned.name === repo.name)
	);

	// MERGE PINNED PROJECTS WITH OTHER FILTERED PROJECTS
	const allProjects = [...pinnedRepos, ...filteredRepos];

	return {
		projects: allProjects,
		error: null,
		loading: false,
	};
};
