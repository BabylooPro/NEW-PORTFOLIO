import { NextRequest, NextResponse } from "next/server";
import { checkForUpdates, fetchGitHubData } from "./utils";
import { inMemoryCache } from "./cache";

const CACHE_MAX_AGE = 3600000; // 1 HOUR IN MILLISECONDS

// GET GITHUB PROJECTS
export async function GET(request: NextRequest) {
	// TRY CATCH BLOCK
	try {
		// GET FORCE UPDATE PARAMETER
		const forceUpdate = request.nextUrl.searchParams.get("force") === "true";

		// CHECK IF CACHE IS VALID
		if (!forceUpdate && inMemoryCache.current) {
			const lastUpdate = new Date(inMemoryCache.current.updatedAt);
			const now = new Date();
			const timeDifference = now.getTime() - lastUpdate.getTime();
			const shouldUpdate = await checkForUpdates(fetch, inMemoryCache.current);

			if (timeDifference < CACHE_MAX_AGE && !shouldUpdate) {
				console.log("Using cached data");
				return NextResponse.json(inMemoryCache.current, {
					headers: {
						"Cache-Control": "public, max-age=3600, s-maxage=3600",
						Pragma: "no-cache",
						Expires: "0",
					},
				});
			}
		}

		// FETCH NEW DATA
		const newData = await fetchGitHubData();

		// UPDATE CACHE
		inMemoryCache.current = {
			...newData,
			updatedAt: new Date().toISOString(),
		};

		// RETURN CACHED DATA
		return NextResponse.json(inMemoryCache.current, {
			headers: {
				"Cache-Control": "public, max-age=3600, s-maxage=3600",
				Pragma: "no-cache",
				Expires: "0",
			},
		});
	} catch (error) {
		// RETURN CACHED DATA IF ERROR
		console.error("ERROR IN GET FUNCTION:", error);
		if (inMemoryCache.current) {
			return NextResponse.json(inMemoryCache.current, {
				headers: {
					"Cache-Control": "public, max-age=3600, s-maxage=3600",
					Pragma: "no-cache",
					Expires: "0",
				},
			});
		}

		// RETURN ERROR
		return NextResponse.json({ error: (error as Error).message }, { status: 500 });
	}
}
