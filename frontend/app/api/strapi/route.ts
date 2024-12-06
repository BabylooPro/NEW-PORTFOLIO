import { NextResponse } from 'next/server';

// STRAPI BASE URL AND HEADERS
const STRAPI_URL = process.env.STRAPI_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

// HANDLE GET REQUESTS
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path') ?? '';

  try {
    // CLEAN THE PATH
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    
    // BUILD URL
    const populatedPath = cleanPath.includes('?') ? 
      `${cleanPath}&populate=*` : 
      `${cleanPath}?populate=*`;

    // FETCH DATA
    const response = await fetch(`${STRAPI_URL}/api/${populatedPath}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`
      },
    });

    // CHECK RESPONSE
    if (!response.ok) {
      throw new Error(`Strapi responded with status: ${response.status}`);
    }

    // RETURN DATA
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route Error:', error);
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

  try {
    const response = await fetch(`${STRAPI_URL}/api/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to post data' }, { status: 500 });
  }
}
