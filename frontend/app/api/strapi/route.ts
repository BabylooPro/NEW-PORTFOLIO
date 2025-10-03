import { NextResponse } from 'next/server';

// STRAPI BASE URL AND HEADERS
const STRAPI_URL = process.env.STRAPI_API_URL || process.env.NEXT_PUBLIC_STRAPI_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

// HANDLE GET REQUESTS
export async function GET(request: Request) {
    if (!STRAPI_URL) {
        console.error('Missing Strapi URL');
        return NextResponse.json(
            { error: 'Server configuration error' },
            { status: 500 }
        );
    }

    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') ?? '';
    const noCache = searchParams.get('no-cache') === 'true';

    try {
        // CLEAN THE PATH
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;

        // PROPER POPULATION BASED ON PATH
        let populatedPath = cleanPath;
        if (['about-section', 'header-section'].includes(cleanPath)) {
            populatedPath = cleanPath.includes('?') ?
                `${cleanPath}&populate[0]=audioFile` :
                `${cleanPath}?populate[0]=audioFile`;
        } else if (cleanPath === 'expertise-section') {
            populatedPath = `${cleanPath}?populate[0]=expertises`;
        } else if (cleanPath === 'soft-skills-section') {
            populatedPath = `${cleanPath}?populate[0]=softSkills`;
        } else if (cleanPath === 'development-methodologies-section') {
            populatedPath = `${cleanPath}?populate[0]=methodologies`;
        } else if (cleanPath === 'skills') {
            populatedPath = `${cleanPath}?populate[0]=skillYear`;
        } else if (cleanPath === 'projects-section') {
            populatedPath = `${cleanPath}?populate[projects][populate]=*&populate[projects][populate][tags][populate]=*&populate[projects][populate][icon][populate]=*&populate[projects][fields][0]=title&populate[projects][fields][1]=description&populate[projects][fields][2]=builtWith&populate[projects][fields][3]=status&populate[projects][fields][4]=tags&populate[projects][fields][5]=githubUrl&populate[projects][fields][6]=demoUrl&populate[projects][fields][7]=icon&populate[projects][fields][8]=featured&populate[projects][fields][9]=online&populate[projects][fields][10]=wip&populate[projects][fields][11]=name&populate[projects][fields][12]=url&populate[projects][fields][13]=notes&populate[projects][fields][14]=technologies&populate[projects][fields][15]=deployDate&populate[projects][fields][16]=isPrivate&populate[projects][fields][17]=language&populate[projects][fields][18]=stargazers_count&populate[projects][fields][19]=forks_count&populate[projects][fields][20]=languages&populate[projects][fields][21]=topics&populate[projects][fields][22]=created_at&populate[projects][fields][23]=updated_at&populate[projects][fields][24]=license&populate[projects][fields][25]=default_branch&populate[projects][fields][26]=homepage`;
        } else if (cleanPath === 'live-projects') {
            populatedPath = `${cleanPath}?populate=*&fields[0]=name&fields[1]=url&fields[2]=isOnline&fields[3]=isWip&fields[4]=notes&fields[5]=technologies&fields[6]=deployDate&fields[7]=publishedAt`;
        } else if (cleanPath.includes('projects')) {
            populatedPath = `${cleanPath}?populate[0]=*&populate[1]=tags&populate[2]=icon&populate[3]=technologies`;
        } else if (cleanPath === 'showcase-videos') {
            populatedPath = `${cleanPath}?populate=src`;
        } else if (cleanPath.includes('showcase-video')) {
            populatedPath = `${cleanPath}?populate=src`;
        }

        const url = `${STRAPI_URL}/api/${populatedPath}`;

        // FETCH DATA FROM STRAPI
        const requestHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(noCache && {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            })
        };

        // ADD AUTHORIZATION HEADER IF TOKEN IS SET
        if (STRAPI_TOKEN) {
            requestHeaders['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
        }

        // FETCH DATA FROM STRAPI
        const response = await fetch(url, {
            headers: requestHeaders,
            cache: noCache ? 'no-store' : 'default',
            next: noCache ? { revalidate: 0 } : undefined
        });

        // CHECK IF RESPONSE IS OK
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Strapi error response:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            return new NextResponse(errorText, {
                status: response.status,
                headers: {
                    'Content-Type': response.headers.get('content-type') ?? 'text/plain'
                }
            });
        }

        const data = await response.json();

        // FOR HEADER SECTION, ADD STRICT CACHE CONTROL HEADERS TO THE RESPONSE
        const responseHeaders = new Headers();
        if (cleanPath === 'header-section') {
            responseHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');
            responseHeaders.set('Pragma', 'no-cache');
            responseHeaders.set('Expires', '0');
        }

        return NextResponse.json(data, { headers: responseHeaders });
    } catch (error) {
        console.error('API Route Error:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            error
        });
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
