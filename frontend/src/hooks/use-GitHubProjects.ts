import useSWR from "swr";
import { formatDistanceToNow } from "date-fns";
import { useRef, useEffect, useState } from "react";

interface GitHubRepo {
	name: string;
	description: string;
	html_url: string;
	language: string;
	stargazers_count: number;
	forks_count: number;
	pinned?: boolean;
	languages: string[];
	topics: string[];
	created_at: string;
	updated_at: string;
	license: string | null;
	default_branch: string;
	homepage?: string | null;
	isPrivate: boolean;
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
	languages: {
		nodes: { name: string }[];
	};
	repositoryTopics: {
		nodes: { topic: { name: string } }[];
	};
	createdAt: string;
	updatedAt: string;
	licenseInfo: { name: string } | null;
	defaultBranchRef: { name: string };
	homepage: string | null;
	homepageUrl?: string;
	isPrivate: boolean;
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
	languages: {
		nodes: { name: string }[];
	};
	repositoryTopics: {
		nodes: { topic: { name: string } }[];
	};
	createdAt: string;
	updatedAt: string;
	licenseInfo: { name: string } | null;
	defaultBranchRef: { name: string };
	homepage: string | null;
	homepageUrl?: string;
	isPrivate: boolean;
}

// DEFINE A GENERIC FETCHER TO GET DATA
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useGitHubProjects = (): {
	projects: GitHubRepo[];
	error: string | null;
	loading: boolean;
	lastUpdate: string;
} => {
	const lastUpdateRef = useRef<string | null>(null);
	const [lastUpdateFormatted, setLastUpdateFormatted] = useState<string>("");

	// USE SWR TO FETCH PROJECTS FROM NEXT.JS API
	const { data, error, mutate } = useSWR("/api/github-projects", fetcher, {
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
		refreshInterval: 0,
		dedupingInterval: 3600000, // 1 HOURS IN MS
		onSuccess: (newData) => {
			if (
				newData.lastUpdate &&
				(!lastUpdateRef.current ||
					new Date(newData.lastUpdate) > new Date(lastUpdateRef.current))
			) {
				console.log(
					"Updating lastUpdate from",
					lastUpdateRef.current,
					"to",
					newData.lastUpdate
				);
				lastUpdateRef.current = newData.lastUpdate;
				setLastUpdateFormatted(
					formatDistanceToNow(new Date(newData.lastUpdate), { addSuffix: true })
				);
			}
		},
	});

	useEffect(() => {
		const checkForUpdates = async () => {
			const response = await fetch("/api/github-projects?force=true");
			if (response.ok) {
				const newData = await response.json();
				if (
					newData.lastUpdate &&
					(!lastUpdateRef.current ||
						new Date(newData.lastUpdate) > new Date(lastUpdateRef.current))
				) {
					mutate(newData, false);
				}
			}
		};

		// CHECK FOR UPDATES IMMEDIATELY WHEN COMPONENT IS MOUNTED
		checkForUpdates();

		// CHECK FOR UPDATES EVERY HOUR
		const intervalId = setInterval(checkForUpdates, 3600000);

		return () => clearInterval(intervalId);
	}, [mutate]);

	// UPDATE LAST UPDATE FORMAT EVERY HOUR
	useEffect(() => {
		const updateFormattedTime = () => {
			if (lastUpdateRef.current) {
				setLastUpdateFormatted(
					formatDistanceToNow(new Date(lastUpdateRef.current), { addSuffix: true })
				);
			}
		};

		const intervalId = setInterval(updateFormattedTime, 3600000);

		// EXECUTE ONCE WHEN MOUNTED
		updateFormattedTime();

		return () => clearInterval(intervalId);
	}, []);

	// DEFINE REPOS TO EXCLUDE
	const excludedRepos = ["BabylooPro", "CUSTOM-ONE-DARK-PRO-THEME"];

	// IF AN ERROR OCCURS
	if (error) {
		return {
			projects: [],
			error: "Failed to fetch GitHub projects",
			loading: false,
			lastUpdate: "",
		};
	}

	// IF DATA IS NOT LOADED YET
	if (!data) {
		return {
			projects: [],
			error: null,
			loading: true,
			lastUpdate: "",
		};
	}

	// CHECK IF DATA EXISTS
	if (!data.data || !data.data.user) {
		return {
			projects: [],
			error: "Invalid response from GitHub API",
			loading: false,
			lastUpdate: "",
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
			languages: edge.node.languages.nodes.map((lang) => lang.name),
			topics: edge.node.repositoryTopics.nodes.map((topic) => topic.topic.name),
			pinned: true,
			created_at: edge.node.createdAt,
			updated_at: edge.node.updatedAt,
			license: edge.node.licenseInfo?.name || null,
			default_branch: edge.node.defaultBranchRef.name,
			homepage: edge.node.homepageUrl || null,
			isPrivate: edge.node.isPrivate,
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
		languages: node.languages.nodes.map((lang) => lang.name),
		topics: node.repositoryTopics.nodes.map((topic) => topic.topic.name),
		created_at: node.createdAt,
		updated_at: node.updatedAt,
		license: node.licenseInfo?.name || null,
		default_branch: node.defaultBranchRef.name,
		homepage: node.homepageUrl || null,
		isPrivate: node.isPrivate,
	}));

	// FILTER REPOS FOR EXCLUDED REPOS AND PRIVATE REPOS
	const filteredRepos = allRepos
		.filter(
			(repo: GitHubRepo) =>
				!excludedRepos.includes(repo.name) &&
				!pinnedRepos.some((pinned) => pinned.name === repo.name) &&
				!repo.isPrivate
		)
		.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

	// SORT PINNED PROJECTS BY STAR COUNT
	const sortedPinnedRepos = pinnedRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);

	// MERGE SORTED PINNED PROJECTS WITH OTHER FILTERED PROJECTS
	const allProjects = [...sortedPinnedRepos, ...filteredRepos];

	return {
		projects: allProjects,
		error: null,
		loading: !data && !error,
		lastUpdate: lastUpdateFormatted,
	};
};
