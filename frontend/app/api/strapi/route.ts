import { NextResponse } from 'next/server';

// STRAPI BASE URL AND HEADERS
const STRAPI_URL = process.env.STRAPI_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

// CACHE DURATION IN SECONDS
const CACHE_DURATION = {
    DEFAULT: 60 * 30, // 30 MINUTES
    HEADER: 60 * 60, // 1 HOUR
    LONG: 60 * 60 * 24, // 1 DAY
};

// HANDLE GET REQUESTS
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') ?? '';
    const noCache = searchParams.get('no-cache') === 'true';

    if (!STRAPI_URL || !STRAPI_TOKEN) {
        console.error('Missing Strapi configuration');
        return NextResponse.json(
            { error: 'Server configuration error' },
            { status: 500 }
        );
    }

    try {
        // CLEAN THE PATH
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;

        // DETERMINE CACHE DURATION BASED ON PATH
        let cacheDuration = CACHE_DURATION.DEFAULT;
        // HEADER SECTIONS GET SHORTER CACHE PERIOD TO FIX CHROME ISSUES
        if (cleanPath.includes('header-section')) {
            cacheDuration = noCache ? 0 : CACHE_DURATION.HEADER;
        } else if (
            cleanPath.includes('about-section') ||
            cleanPath.includes('expertise-section')
        ) {
            cacheDuration = CACHE_DURATION.LONG;
        }

        // PROPER POPULATION BASED ON PATH
        let populatedPath = cleanPath;
        if (['about-section', 'header-section'].includes(cleanPath)) {
            populatedPath = `${cleanPath}?populate=deep,10`;
        } else if (cleanPath.includes('projects')) {
            populatedPath = `${cleanPath}&populate=deep,10`;
        } else if (cleanPath.includes('portfolio')) {
            populatedPath = `${cleanPath}&populate=deep,10`;
        } else if (cleanPath.includes('expertise')) {
            populatedPath = `${cleanPath}&populate=deep,10`;
        }

        const url = `${STRAPI_URL}/api/${populatedPath}`;

        const fetchOptions: RequestInit = {
            headers: {
                'Authorization': `Bearer ${STRAPI_TOKEN}`,
                'Content-Type': 'application/json',
                'Cache-Control': noCache ? 'no-cache, no-store' : 'max-age=' + cacheDuration
            },
            next: noCache ? { revalidate: 0 } : { revalidate: cacheDuration }
        };

        console.log(`Fetching ${cleanPath} with cache duration: ${noCache ? 'no-cache' : cacheDuration}s`);
        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
            throw new Error(`Strapi responded with status: ${response.status}`);
        }

        const data = await response.json();

        // VALIDATE DATA FOR HEADER SECTION TO DEBUG CHROME ISSUES
        if (cleanPath === 'header-section' && (!data.data || !data.data.profile)) {
            console.error('Invalid header data received:', data);
        }

        // ENSURE CONSISTENT CACHE HEADERS
        const cacheControl = noCache
            ? 'no-cache, no-store, must-revalidate'
            : `public, max-age=${cacheDuration}, s-maxage=${cacheDuration}, stale-while-revalidate=${cacheDuration * 2}`;

        return new NextResponse(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': cacheControl,
                'Vary': 'Accept, User-Agent'  // IMPORTANT FOR CHROME CACHING
            }
        });
    } catch (error) {
        console.error('API Route Error:', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch data' },
            { status: 500 }
        );
    }
}

// HANDLE POST REQUESTS
export async function POST(request: Request) {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') ?? '';
    const body = await request.json();

    if (!STRAPI_URL || !STRAPI_TOKEN) {
        return NextResponse.json(
            { error: 'Server configuration error' },
            { status: 500 }
        );
    }

    try {
        const url = `${STRAPI_URL}/api/${path}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${STRAPI_TOKEN}`
            },
            body: JSON.stringify(body),
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to post data: ${errorText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

// HANDLE PUT REQUESTS
export async function PUT(request: Request) {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') ?? '';
    const body = await request.json();

    // CHECK IF STRAPI_URL AND STRAPI_TOKEN ARE SET
    if (!STRAPI_URL || !STRAPI_TOKEN) {
        return NextResponse.json(
            { error: 'Server configuration error' },
            { status: 500 }
        );
    }

    // TRY TO UPDATE DATA
    try {
        const response = await fetch(`${STRAPI_URL}/api/${path}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${STRAPI_TOKEN}`
            },
            body: JSON.stringify(body),
            cache: 'no-store'
        });

        // CHECK IF RESPONSE IS OK
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to update data: ${errorText}`);
        }

        const data = await response.json();
        return NextResponse.json(data); // RETURN UPDATED DATA
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
