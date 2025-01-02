import { Resend } from "resend";

// RESEND CLIENT - SEND EMAILS USING RESEND API
export const resend = new Resend(process.env.RESEND_API_KEY);

export const fromEmail = "portfolio@maxremy.dev";
export const toEmail = "maxremy.dev@gmail.com";

interface EmailParams {
    name: string;
    email: string;
    message: string;
    submissionId: string;
}

export function generateEmailHtml({ name, email, message, submissionId }: EmailParams): string {
    return `
        <h2>New Contact Form Submission</h2>
        <br />
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
        <br />
        <p style='color: gray; font-size: 0.8em;'>This is a copy of the message sent to the portfolio owner.</p>
        <p style='color: gray; font-size: 0.8em;'><strong>Submission ID:</strong> ${submissionId}</p>
    `;
}
