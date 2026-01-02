export async function POST(request: Request) {
    const apiUrl = process.env.CONTACTFORM_MINIMALAPI_URL?.replace(/\/$/, '') as string;
    const endpoint = `${apiUrl}/api/v1/email/1`;

    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Api-Key": process.env.CONTACTFORM_MINIMALAPI_KEY as string,
        },
        body: JSON.stringify(await request.json()),
    });

    const result = await response.text();

    return new Response(JSON.stringify({ success: response.ok, message: result }), {
        headers: { 'Content-Type': 'application/json' },
        status: response.status
    });
}
