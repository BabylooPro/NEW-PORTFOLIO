import { NextResponse } from "next/server";
import { WakaTimeData, Editor, CachedWakaTimeData, OperatingSystem, Category, Language } from "./types";

const WAKATIME_API_KEY = process.env.WAKATIME_API_KEY;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;
const BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://maxremy.dev'
    : 'http://localhost:3000';

// CACHE SETTINGS
let cachedData: CachedWakaTimeData | null = null;

// THRESHOLD SETTINGS
const CACHE_DURATION_SECONDS = 300; // 5 MINUTES

// FETCH SKILL ID BY NAME
async function getSkillIdByName(name: string): Promise<number | null> {
    console.log(`Searching for skill with name: ${name}`);
    try {
        const path = `skills`;
        const params = new URLSearchParams({
            'filters[name][$eqi]': name,
            'populate': '*'
        });
        const url = `${BASE_URL}/api/strapi?path=${path}&${params.toString()}`;
        console.log(`Fetching from URL: ${url}`);

        const response = await fetch(url);
        console.log(`Response status for ${name}:`, response.status);

        if (!response.ok) {
            console.error(`Failed to fetch skill ID for ${name}: ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        console.log(`Data received for ${name}:`, JSON.stringify(data, null, 2));

        // FIND FIRST PUBLISHED SKILL WITH MATCHING NAME
        const skill = data.data?.find((s: { attributes: { name: string; publishedAt: string | null } }) =>
            s.attributes.name.toLowerCase() === name.toLowerCase() &&
            s.attributes.publishedAt !== null
        );

        if (skill) {
            console.log(`Found skill ID for ${name}:`, skill.id);
            return skill.id;
        }

        console.log(`No published skill found for ${name}`);
        return null;
    } catch (error) {
        console.error(`Error fetching skill ID for ${name}:`, error);
        return null;
    }
}

// UPDATE SKILL STATS IN CMS
async function updateSkillStats(skillId: number, seconds: number) {
    try {
        const today = new Date().toISOString().split('T')[0];
        const path = 'wakatime-stats';

        // FIRST GET EXISTING STATS FOR THIS SKILL AND DATE
        const getUrl = `${BASE_URL}/api/strapi?path=${path}&filters[skill][id][$eq]=${skillId}&filters[date][$eq]=${today}`;
        const existingResponse = await fetch(getUrl);
        const existingData = await existingResponse.json();

        // CALCULATE TOTAL SECONDS (EXISTING + NEW)
        let totalSeconds = Math.round(seconds);
        if (existingData.data && existingData.data.length > 0) {
            totalSeconds += existingData.data[0].attributes.seconds || 0;
        }

        // UPDATE OR CREATE STATS
        const updateUrl = `${BASE_URL}/api/strapi?path=${path}/upsert`;
        console.log("Updating skill stats:", { skillId, totalSeconds, date: today, url: updateUrl });

        const response = await fetch(updateUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${STRAPI_TOKEN}`
            },
            body: JSON.stringify({
                skillId,
                date: today,
                seconds: totalSeconds
            })
        });

        const responseText = await response.text();
        console.log("Raw response:", responseText);

        if (!response.ok) {
            console.error(`Failed to update skill stats: ${response.status} - ${responseText}`);
            throw new Error(`Failed to update skill stats: ${response.status}`);
        }

        const data = JSON.parse(responseText);
        console.log("Stats update response:", data);

        return data;
    } catch (error) {
        console.error("Error updating skill stats:", { skillId, error });
        throw error;
    }
}

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
    const today = new Date().toISOString().split('T')[0];
    const wakatimeApiUrl = `https://wakatime.com/api/v1/users/current/summaries?start=${today}&end=${today}`;

    // FETCH DATA FROM WAKATIME API
    try {
        const authHeader = `Basic ${Buffer.from(WAKATIME_API_KEY ?? "").toString("base64")}`;
        console.log('Authorization header length:', authHeader.length);

        const response = await fetch(wakatimeApiUrl, {
            headers: {
                Authorization: authHeader,
            },
            cache: "no-store", // DISABLE CACHING TO FORCE FRESH DATA FETCH
        });

        // CHECK IF RESPONSE IS OK
        if (!response.ok) {
            console.error(`WakaTime API responded with status: ${response.status}`);
            throw new Error(`WakaTime API responded with status: ${response.status}`);
        }

        const rawData = await response.json(); // PARSE JSON RESPONSE
        console.log('Raw data from WakaTime:', rawData);

        // TRANSFORM THE DATA TO MATCH OUR INTERFACE
        const data: WakaTimeData = {
            cached_at: new Date().toISOString(),
            data: {
                categories: rawData.data[0]?.categories || [],
                editors: rawData.data[0]?.editors || [],
                operating_systems: rawData.data[0]?.operating_systems || [],
                languages: rawData.data[0]?.languages || [],
                grand_total: rawData.data[0]?.grand_total || {
                    hours: 0,
                    minutes: 0,
                    total_seconds: 0,
                    digital: "0:00",
                    decimal: "0.00",
                    text: "0 mins"
                },
                range: rawData.data[0]?.range || {
                    start: new Date().toISOString(),
                    end: new Date().toISOString(),
                    date: new Date().toISOString().split('T')[0],
                    text: "Today",
                    timezone: "Unknown"
                }
            },
            status: "available",
            lastCachedAt: Date.now()
        };

        // ENSURE DEFAULT VALUES FOR EMPTY ARRAYS
        const categories: Category[] =
            data.data.categories.length > 0
                ? data.data.categories
                : [{
                    name: "No activity",
                    total_seconds: 0,
                    digital: "0:00",
                    decimal: "0.00",
                    text: "0 mins",
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    percent: 0
                }];
        const editors: Editor[] =
            data.data.editors.length > 0
                ? data.data.editors
                : [{
                    name: "None",
                    total_seconds: 0,
                    digital: "0:00",
                    decimal: "0.00",
                    text: "0 mins",
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    percent: 0
                }];
        const operating_systems: OperatingSystem[] =
            data.data.operating_systems.length > 0
                ? data.data.operating_systems
                : [{
                    name: "None",
                    total_seconds: 0,
                    digital: "0:00",
                    decimal: "0.00",
                    text: "0 mins",
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    percent: 0,
                    last_used: Date.now()
                }];
        const languages: Language[] =
            data.data.languages.length > 0
                ? data.data.languages
                : [{
                    name: "None",
                    total_seconds: 0,
                    digital: "0:00",
                    decimal: "0.00",
                    text: "0 mins",
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    percent: 0
                }];

        console.log('Processed languages:', languages);

        // UPDATE CMS FOR EACH LANGUAGE
        if (languages.length > 0) {
            console.log('Starting language updates...');

            // LOOP THROUGH EACH LANGUAGE
            for (const language of languages) {
                console.log(`Processing language: ${language.name}`);

                if (language.name.toLowerCase() === "other") {
                    console.log('Skipping "other" language');
                    continue;
                }

                const skillId = await getSkillIdByName(language.name);
                if (skillId) {
                    console.log(`Time for ${language.name}:`, {
                        total_seconds: language.total_seconds
                    });

                    await updateSkillStats(skillId, language.total_seconds);
                } else {
                    console.log(`No matching skill found for ${language.name}`);
                }
            }
            console.log('Finished processing all languages');
        }

        const filteredData: CachedWakaTimeData = {
            cached_at: data.cached_at,
            data: {
                range: data.data.range,
                editors: editors,
                operating_systems: operating_systems,
                categories: categories,
                languages: languages,
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
            // ACTIVITY DETECTED
            console.log('New activity detected');
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
        console.log("GET request received");
        console.log("Environment variables:", {
            WAKATIME_API_KEY: process.env.WAKATIME_API_KEY ? "Set" : "Not set",
            STRAPI_TOKEN: process.env.STRAPI_TOKEN ? "Set" : "Not set",
        });

        const data = await fetchDataWithCache();

        // HANDLE TEST ENVIRONMENT DIFFERENTLY
        if (process.env.NODE_ENV === 'test') {
            return new Response(JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json' },
                status: 200
            });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error in GET handler:", error);
        const errorResponse = {
            error: error instanceof Error ? error.message : "Failed to fetch WakaTime data"
        };

        // HANDLE TEST ENVIRONMENT DIFFERENTLY
        if (process.env.NODE_ENV === 'test') {
            return new Response(JSON.stringify(errorResponse), {
                headers: { 'Content-Type': 'application/json' },
                status: 500
            });
        }

        return NextResponse.json(errorResponse, { status: 500 });
    }
}
