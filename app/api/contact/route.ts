import { NextResponse } from "next/server";
import { resend } from "./utils";

const fromEmail = "portfolio@maxremy.dev";
const toEmail = "maxremy.dev@gmail.com";

// EXPORTING ASYNC FUNCTION TO HANDLE POST REQUEST
export async function POST(req: Request) {
	const { name, email, message } = await req.json();

	// GENERATE A UNIQUE IDENTIFIER FOR ONE SUBMISSION
	const submissionId = Date.now().toString(36) + Math.random().toString(36).substr(2);

	// TRYING TO SEND EMAIL USING RESEND API
	try {
		const result = await resend.emails.send({
			from: fromEmail,
			to: [toEmail, email], // SEND TO BOTH DEV AND VISITOR
			subject: `New Contact from ${name} in Portfolio (ID: ${submissionId})`,
			html: `
				<h2>New Contact Form Submission</h2>
            <br />
				<p><strong>Name:</strong> ${name}</p>
				<p><strong>Email:</strong> ${email}</p>
				<p><strong>Message:</strong> ${message}</p>
				<br />
				${
					email === toEmail
						? ""
						: "<p style='color: gray; font-size: 0.8em;'>This is a copy of the message sent to the portfolio owner.</p>"
				}
            <p style='color: gray; font-size: 0.8em;'><strong>Submission ID:</strong> ${submissionId}</p>
         `,
		});

		// CHECK IF EMAIL WAS SENT AND RETURN SUCCESS RESPONSE
		if (result && result.data && result.data.id) {
			return NextResponse.json({
				success: true,
				message: `Email sent successfully to ${toEmail} from ${name}.`,
			});
		} else {
			throw new Error("RESEND: Unexpected response from Resend API");
		}
	} catch (error: unknown) {
		console.error("RESEND Error sending email:", error);

		// RETURN ERROR RESPONSE
		return NextResponse.json(
			{
				success: false,
				message: error instanceof Error ? error.message : "Unknown error occurred",
			},
			{ status: 500 }
		);
	}
}
