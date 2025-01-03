import { generateEmailHtml, fromEmail, toEmail } from "./utils";

// EXPORTING ASYNC FUNCTION TO HANDLE POST REQUEST
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, message } = body;

        // VALIDATE REQUIRED FIELDS
        if (!name || !email || !message) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                headers: { 'Content-Type': 'application/json' },
                status: 400
            });
        }

        // GENERATE SUBMISSION ID
        const submissionId = Date.now().toString(36) + Math.random().toString(36).slice(2);

        // SEND EMAIL VIA RESEND API
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: fromEmail,
                to: [toEmail, email],
                subject: `New Contact from ${name} in Portfolio (ID: ${submissionId})`,
                html: generateEmailHtml({ name, email, message, submissionId }),
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            return new Response(JSON.stringify({ error: result.message || "Failed to send email" }), {
                headers: { 'Content-Type': 'application/json' },
                status: response.status
            });
        }

        return new Response(JSON.stringify({ success: true, ...result }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });
    } catch (error) {
        console.error("Error in POST handler:", error);
        if (error instanceof Error) {
            return new Response(JSON.stringify({ error: error.message }), {
                headers: { 'Content-Type': 'application/json' },
                status: 500
            });
        }
        return new Response(JSON.stringify({ error: "Failed to send email" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
}
