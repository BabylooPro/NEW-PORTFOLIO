import { NextResponse } from "next/server";
import { WakaTimeData, Editor, CachedWakaTimeData, OperatingSystem, Category, Language } from "./types";

const WAKATIME_API_KEY = process.env.WAKATIME_API_KEY;
const CMS_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

// BASE URL FOR API CALLS (ABSOLUTE URL BETWEEN WAKATIME AND STRAPI)
const BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://maxremy.dev'
    : 'http://localhost:3000';

// CACHE SETTINGS
let cachedData: CachedWakaTimeData | null = null;
let lastActivityAt: number | null = null;

// THRESHOLD SETTINGS
const CACHE_DURATION_SECONDS = 300; // 5 MINUTES
const AWAY_THRESHOLD_SECONDS = 900; // 15 MINUTES
const BUSY_THRESHOLD_SECONDS = 3600; // 1 HOUR

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

// UPDATE CMS SKILL HOURS
async function updateSkillHours(skillId: number, hours: number, minutes: number) {
    console.log(`Setting hours for skill ${skillId} to: ${hours}h ${minutes}m`);
    try {
        const path = `skills/${skillId}/update-hours`;
        const url = `${BASE_URL}/api/strapi?path=${path}`;
        console.log(`Sending PUT request to: ${url}`);

        // SEND TOTAL HOURS AND MINUTES FOR DAY
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                hours: Math.floor(hours),
                minutes: Math.floor(minutes)
            }),
        });

        console.log(`Update response status:`, response.status);

        if (!response.ok) {
            console.error(`Failed to update skill hours: ${response.statusText}`);
            const errorData = await response.text();
            console.error(`Error details:`, errorData);
        } else {
            const successData = await response.json();
            console.log(`Update successful:`, successData);
        }
    } catch (error) {
        console.error('Error updating skill hours:', error);
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
    const wakatimeApiUrl = "https://wakatime.com/api/v1/users/current/status_bar/today?scope=read_summaries";

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

        const data: WakaTimeData = await response.json(); // PARSE JSON RESPONSE
        console.log('Raw data from WakaTime:', {
            categories: data.data.categories,
            languages: data.data.languages,
            grand_total: data.data.grand_total
        });

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
        const languages: Language[] =
            data.data.languages.length > 0
                ? data.data.languages
                : [{ name: "None", total_seconds: 0, digital: "0:00", percent: 0 }];

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
                    // CALCULATE HOURS AND MINUTES DIRECTLY FROM TOTAL_SECONDS
                    const hours = Math.floor(language.total_seconds / 3600);
                    const minutes = Math.floor((language.total_seconds % 3600) / 60);

                    console.log(`Time for ${language.name}:`, {
                        total_seconds: language.total_seconds,
                        hours,
                        minutes
                    });

                    // UPDATE SKILL HOURS IF THERE IS SIGNIFICANT TIME
                    if (hours > 0 || minutes > 0) {
                        await updateSkillHours(skillId, hours, minutes);
                    } else {
                        console.log(`No significant time for ${language.name}`);
                    }
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
    console.log('GET request received');
    console.log('Environment variables:', {
        CMS_URL: CMS_URL,
        WAKATIME_API_KEY: WAKATIME_API_KEY ? 'Set' : 'Not set',
        STRAPI_TOKEN: STRAPI_TOKEN ? 'Set' : 'Not set'
    });

    try {
        const data = await fetchDataWithCache(); // FETCH DATA WITH CACHE
        let status: "available" | "away" | "busy" = "available"; // SET STATUS TO AVAILABLE

        // IF LAST ACTIVITY TIME IS SET, CHECK IF STATUS SHOULD BE AWAY OR BUSY
        if (lastActivityAt) {
            const now = Date.now(); // GET CURRENT TIME
            const timeSinceLastActivity = (now - lastActivityAt) / 1000; // TIME IN SECONDS

            console.log('Time since last activity:', {
                timeSinceLastActivity,
                BUSY_THRESHOLD_SECONDS,
                AWAY_THRESHOLD_SECONDS
            });

            if (timeSinceLastActivity > BUSY_THRESHOLD_SECONDS) {
                status = "busy"; // SET STATUS TO BUSY IF INACTIVE FOR MORE THAN 1 HOUR
            } else if (timeSinceLastActivity > AWAY_THRESHOLD_SECONDS) {
                status = "away"; // SET STATUS TO AWAY IF INACTIVE FOR MORE THAN 15 MINUTES
            } else {
                status = "available"; // SET STATUS TO AVAILABLE IF ACTIVITY DETECTED
            }
        }

        console.log('Returning response with status:', status);
        return NextResponse.json({ ...data, status }); // RETURN WAKATIME DATA AND STATUS
    } catch (error) {
        console.error("Error in GET handler:", error);
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Failed to fetch WakaTime data" }, { status: 500 });
    }
}
