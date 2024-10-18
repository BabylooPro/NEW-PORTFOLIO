import { NextResponse } from "next/server";
import { WakaTimeData, Editor, OperatingSystem, Category } from "./types";

const WAKATIME_API_KEY = process.env.WAKATIME_API_KEY;

// CACHE SETTINGS
let cachedData: WakaTimeData | null = null;
let lastCachedAt: number | null = null;
let lastActivityAt: string | null = null;

// THRESHOLD SETTINGS
const CACHE_DURATION_SECONDS = 300; // 5 MINUTES
const AWAY_THRESHOLD_SECONDS = 900; // 15 MINUTES
const BUSY_THRESHOLD_SECONDS = 3600; // 1 HOUR

// FETCH DATA WITH CACHE
async function fetchDataWithCache(revalidate: boolean = false) {
	const now = Date.now(); // GET CURRENT TIME

	// CHECK IF CACHE IS VALID
	if (cachedData && lastCachedAt && !revalidate) {
		const cacheAge = now - lastCachedAt;
		if (cacheAge < CACHE_DURATION_SECONDS * 1000) {
			return cachedData;
		}
	}

	// FETCH FRESH DATA FROM WAKATIME API
	const wakatimeApiUrl =
		"https://wakatime.com/api/v1/users/current/status_bar/today?scope=read_summaries";

	// FETCH DATA FROM WAKATIME API
	const response = await fetch(wakatimeApiUrl, {
		headers: {
			Authorization: `Basic ${Buffer.from(WAKATIME_API_KEY ?? "").toString("base64")}`,
		},
		cache: "no-store", // DISABLE CACHING TO FORCE FRESH DATA FETCH
	});

	// CHECK IF RESPONSE IS OK
	if (!response.ok) {
		throw new Error(`WakaTime API responded with status: ${response.status}`);
	}

	const data: WakaTimeData = await response.json(); // PARSE JSON RESPONSE

	// ENSURE DEFAULT VALUES FOR EMPTY ARRAYS
	const categories: Category[] =
		data.data.categories.length > 0
			? data.data.categories
			: [{ name: "No activity", total_seconds: 0, digital: "0:00", percent: 0 }];

	const editors: Editor[] =
		data.data.editors.length > 0
			? data.data.editors
			: [{ name: "None", total_seconds: 0, digital: "0:00", percent: 0 }];

	const operating_systems: OperatingSystem[] =
		data.data.operating_systems.length > 0
			? data.data.operating_systems
			: [{ name: "None", total_seconds: 0, digital: "0:00", percent: 0 }];

	// STORE DATA IN CACHE
	cachedData = {
		cached_at: data.cached_at,
		data: {
			range: data.data.range,
			editors: editors,
			operating_systems: operating_systems,
			categories: categories,
			grand_total: data.data.grand_total,
		},
	};

	lastCachedAt = Date.now(); // UPDATE CACHE TIME

	const totalSeconds = data.data.grand_total.total_seconds; // GET TOTAL SECONDS

	// IF TOTAL SECONDS IS GREATER THAN 0, UPDATE LAST ACTIVITY TIME
	if (totalSeconds > 0) {
		lastActivityAt = new Date(lastCachedAt).toISOString(); // UPDATE LAST ACTIVITY TIME
	}

	return cachedData; // RETURN CACHED DATA
}

// API ROUTE TO GET WAKATIME DATA
export async function GET() {
	try {
		const data = await fetchDataWithCache(); // FETCH DATA WITH CACHE
		let status: "available" | "away" | "busy" = "available"; // SET STATUS TO AVAILABLE

		// IF LAST ACTIVITY TIME IS SET, CHECK IF STATUS SHOULD BE AWAY OR BUSY
		if (lastActivityAt) {
			const now = new Date().getTime(); // GET CURRENT TIME
			const timeSinceLastActivity = (now - new Date(lastActivityAt).getTime()) / 1000; // GET TIME SINCE LAST ACTIVITY

			if (timeSinceLastActivity > BUSY_THRESHOLD_SECONDS) {
				status = "busy"; // SET STATUS TO BUSY
			} else if (timeSinceLastActivity > AWAY_THRESHOLD_SECONDS) {
				status = "away"; // SET STATUS TO AWAY
			}
		}

		return NextResponse.json({ ...data, status });
	} catch (error) {
		console.error("Error fetching WakaTime data:", error);
		return NextResponse.json({ error: "Failed to fetch WakaTime data" }, { status: 500 });
	}
}
