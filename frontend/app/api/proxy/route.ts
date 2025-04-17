import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get('url'); // GET THE URL FROM THE QUERY PARAMETER

    // IF NOT URL PROVIDED, RETURN ERROR
    if (!url) {
        return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    // FETCH THE URL
    try {
        const response = await fetch(url);

        // IF NOT OK, RETURN ERROR
        if (!response.ok) {
            return NextResponse.json(
                { error: `Failed to fetch: ${response.status} ${response.statusText}` },
                { status: response.status }
            );
        }

        const contentType = response.headers.get('content-type') || 'application/octet-stream'; // GET THE CONTENT TYPE
        const buffer = await response.arrayBuffer(); // GET THE BUFFER

        // RETURN THE BUFFER WITH THE CORRECT CONTENT TYPE AND CACHE CONTROL
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=3600'
            }
        });
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json({ error: 'Failed to proxy request' }, { status: 500 });
    }
} 
