import { NextResponse } from "next/server";
import { GITHUB_PROJECTS_QUERY } from "@/lib/githubQueries";

export async function GET() {
	// FETCH GITHUB PROJECTS DATA
	try {
		// SEND POST REQUEST TO GITHUB GRAPHQL API
		const response = await fetch("https://api.github.com/graphql", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.GIT_HUB_ACCESS_TOKEN}`,
			},
			body: JSON.stringify({
				query: GITHUB_PROJECTS_QUERY,
				variables: { login: "babyloopro" },
			}),
		});

		// CHECK IF RESPONSE IS SUCCESSFUL
		if (!response.ok) {
			throw new Error(`GitHub API error: ${response.statusText}`);
		}

		// PARSE AND RETURN JSON RESPONSE
		const data = await response.json();
		return NextResponse.json(data);
	} catch (error: unknown) {
		// ERROR HANDLING
		if (error instanceof Error) {
			console.error("Error fetching GitHub projects:", error.message);
		} else {
			console.error("Error fetching GitHub projects:", error);
		}
		// RETURN ERROR RESPONSE
		return NextResponse.json({ error: "Failed to fetch GitHub projects" }, { status: 500 });
	}
}
