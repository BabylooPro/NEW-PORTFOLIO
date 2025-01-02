import { NextResponse } from 'next/server';

// STRAPI BASE URL AND HEADERS
const STRAPI_URL = process.env.STRAPI_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

// HANDLE GET REQUESTS
export async function GET(request: Request) {
    // DEBUG LOGS
    console.log('ENV Variables:', {
        STRAPI_URL,
        STRAPI_TOKEN_EXISTS: !!STRAPI_TOKEN
    });

    if (!STRAPI_URL || !STRAPI_TOKEN) {
        console.error('Missing Strapi configuration');
        return NextResponse.json(
            { error: 'Server configuration error' },
            { status: 500 }
        );
    }

    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') ?? '';

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
        }

        const url = `${STRAPI_URL}/api/${populatedPath}`;
        console.log('Request details:', {
            url,
            headers: {
                'Authorization': 'Bearer [hidden]',
                'Content-Type': 'application/json'
            }
        });

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${STRAPI_TOKEN}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Strapi error response:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`Strapi responded with status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
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

    console.log('POST request:', { path, body });

    try {
        const url = `${STRAPI_URL}/api/${path}`;
        console.log('Making request to:', url);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${STRAPI_TOKEN}`
            },
            body: JSON.stringify(body),
        });

        const responseText = await response.text();
        console.log('Raw response:', responseText);

        if (!response.ok) {
            console.error(`Error response: ${response.status} - ${responseText}`);
            return NextResponse.json(
                { error: `Failed to post data: ${responseText}` },
                { status: response.status }
            );
        }

        const data = JSON.parse(responseText);
        console.log('Parsed response:', data);
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in POST handler:', error);
        return NextResponse.json(
            { error: `Failed to post data: ${error instanceof Error ? error.message : String(error)}` },
            { status: 500 }
        );
    }
}

// HANDLE PUT REQUESTS
export async function PUT(request: Request) {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') ?? '';
    const body = await request.json();

    // TRY TO UPDATE DATA
    try {
        const response = await fetch(`${STRAPI_URL}/api/${path}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${STRAPI_TOKEN}`
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data); // RETURN UPDATED DATA
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update data: ' + error }, { status: 500 });
    }
}
