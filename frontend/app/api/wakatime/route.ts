import { NextResponse } from "next/server";
import { WakaTimeData, Editor, CachedWakaTimeData, OperatingSystem, Category } from "./types";

const WAKATIME_API_KEY = process.env.WAKATIME_API_KEY;

// CACHE SETTINGS
let cachedData: CachedWakaTimeData | null = null;
let lastActivityAt: number | null = null;

// THRESHOLD SETTINGS
const CACHE_DURATION_SECONDS = 300; // 5 MINUTES
const AWAY_THRESHOLD_SECONDS = 900; // 15 MINUTES
const BUSY_THRESHOLD_SECONDS = 3600; // 1 HOUR

// FETCH DATA WITH CACHE
async function fetchDataWithCache(revalidate: boolean = false) {
	const now = Date.now(); // GET CURRENT TIME

	// CHECK IF CACHE IS VALID
	if (cachedData && !revalidate) {
		const cacheAge = now - cachedData.lastCachedAt;
		if (cacheAge < CACHE_DURATION_SECONDS * 1000) {
			return cachedData; // RETURN CACHED DATA IF STILL VALID
		}
	}

	// FETCH FRESH DATA FROM WAKATIME API
	const wakatimeApiUrl =
		"https://wakatime.com/api/v1/users/current/status_bar/today?scope=read_summaries";

	// FETCH DATA FROM WAKATIME API
	try {
		const response = await fetch(wakatimeApiUrl, {
			headers: {
				Authorization: `Basic ${Buffer.from(WAKATIME_API_KEY ?? "").toString("base64")}`,
			},
			cache: "no-store", // DISABLE CACHING TO FORCE FRESH DATA FETCH
		});

		// CHECK IF RESPONSE IS OK
		if (!response.ok) {
			console.error(`WakaTime API responded with status: ${response.status}`);
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

		const filteredData: CachedWakaTimeData = {
			cached_at: data.cached_at,
			data: {
				range: data.data.range,
				editors: editors,
				operating_systems: operating_systems,
				categories: categories,
				grand_total: data.data.grand_total,
			},
			status: data.status,
			lastCachedAt: now,
		};

		// UPDATE LAST_USED FOR OPERATING SYSTEMS
		filteredData.data.operating_systems = updateOperatingSystemsLastUsed(
			filteredData.data.operating_systems,
			cachedData?.data.operating_systems
		);

		// UPDATE LAST ACTIVITY TIME IF NEW ACTIVITY DETECTED
		if (
			!cachedData ||
			filteredData.data.grand_total.total_seconds > cachedData.data.grand_total.total_seconds
		) {
			lastActivityAt = now;
		}

		cachedData = filteredData; // UPDATE CACHED DATA
		return cachedData; // RETURN CACHED DATA
	} catch (error) {
		console.error("Error during WakaTime API fetch:", error);
		throw error;
	}
}

function updateOperatingSystemsLastUsed(
	newOS: OperatingSystem[],
	oldOS?: OperatingSystem[]
): OperatingSystem[] {
	const now = Date.now();
	return newOS
		.map((os) => {
			const oldOSData = oldOS?.find((old) => old.name === os.name);
			if (oldOSData && os.total_seconds > oldOSData.total_seconds) {
				return { ...os, last_used: now };
			} else if (oldOSData) {
				return { ...os, last_used: oldOSData.last_used };
			} else {
				return { ...os, last_used: now };
			}
		})
		.sort((a, b) => (b.last_used ?? 0) - (a.last_used ?? 0));
}

// API ROUTE TO GET WAKATIME DATA
export async function GET() {
	try {
		const data = await fetchDataWithCache(); // FETCH DATA WITH CACHE
		let status: "available" | "away" | "busy" = "available"; // SET STATUS TO AVAILABLE

		// IF LAST ACTIVITY TIME IS SET, CHECK IF STATUS SHOULD BE AWAY OR BUSY
		if (lastActivityAt) {
			const now = Date.now(); // GET CURRENT TIME
			const timeSinceLastActivity = (now - lastActivityAt) / 1000; // TIME IN SECONDS

			if (timeSinceLastActivity > BUSY_THRESHOLD_SECONDS) {
				status = "busy"; // SET STATUS TO BUSY IF INACTIVE FOR MORE THAN 1 HOUR
			} else if (timeSinceLastActivity > AWAY_THRESHOLD_SECONDS) {
				status = "away"; // SET STATUS TO AWAY IF INACTIVE FOR MORE THAN 15 MINUTES
			} else {
				status = "available"; // SET STATUS TO AVAILABLE IF ACTIVITY DETECTED
			}
		}

		return NextResponse.json({ ...data, status }); // RETURN WAKATIME DATA AND STATUS
	} catch (error) {
		console.error("Error fetching WakaTime data:", error);
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ error: "Failed to fetch WakaTime data" }, { status: 500 });
	}
}
