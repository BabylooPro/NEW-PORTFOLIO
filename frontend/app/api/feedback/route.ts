import { fromEmail, toEmail } from "../contact/utils";

export async function POST(request: Request) {
    try {
        // VERIFY ENVIRONMENT VARIABLES
        if (!process.env.RESEND_API_KEY) {
            console.error("RESEND_API_KEY is not configured");
            throw new Error("Email service is not properly configured");
        }

        const body = await request.json();
        const { data } = body;
        const { rating, feedback } = data;

        // GENERATE SUBMISSION ID
        const submissionId = Date.now().toString(36) + Math.random().toString(36).slice(2);

        // SEND EMAIL NOTIFICATION
        const emailHtml = `
            <h2>New Portfolio Feedback Received</h2>
            <p><strong>Submission ID:</strong> ${submissionId}</p>
            <p><strong>Rating:</strong> ${rating} / 5</p>
            ${feedback ? `<p><strong>Feedback:</strong> ${feedback}</p>` : ''}
        `;

        // SEND EMAIL VIA RESEND API
        const emailResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: fromEmail,
                to: [toEmail],
                subject: `New Portfolio Feedback - Rating: ${rating}/5 (ID: ${submissionId})`,
                html: emailHtml,
            }),
        });

        const emailResult = await emailResponse.json(); // PARSE RESPONSE

        // HANDLE EMAIL FAILURE
        if (!emailResponse.ok) {
            throw new Error(emailResult.message || "Failed to send email");
        }

        // RETURN SUCCESS RESPONSE
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });

    } catch (error) {
        console.error("Error in feedback POST handler:", error);
        return new Response(JSON.stringify({
            error: error instanceof Error ? error.message : "Failed to send email"
        }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
}
