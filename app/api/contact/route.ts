import { NextResponse } from "next/server";
import { Resend } from "resend";

// INITIALIZING RESEND WITH API KEY AND SETTING EMAIL ADDRESSES
const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = "portfolio@maxremy.dev";
const toEmail = "maxremy.dev@gmail.com";

// EXPORTING ASYNC FUNCTION TO HANDLE POST REQUEST
export async function POST(req: Request) {
	const { name, email, message } = await req.json();

	// TRYING TO SEND EMAIL USING RESEND API
	try {
		const result = await resend.emails.send({
			from: fromEmail,
			to: toEmail,
			replyTo: email,
			subject: `New Contact from ${name} in Portfolio`,
			html: `
				<h1>New Contact Form Submission in Portfolio</h1>
				<p><strong>Name:</strong> ${name}</p>
				<p><strong>Email:</strong> ${email}</p>
				<p><strong>Message:</strong> ${message}</p>
			`,
		});

		console.log("RESEND API response:", result);

		// CHECKING FOR ERROR IN RESPONSE
		if ("error" in result) {
			throw result.error;
		}

		// RETURNING SUCCESS RESPONSE WITH SUCCESS MESSAGE
		return NextResponse.json({
			success: true,
			message: `RESEND: Email sent successfully to ${toEmail} from ${name}.`,
		});
	} catch (error: unknown) {
		console.error("RESEND: Error sending email:", error);

		// CHECKING FOR 403 ERROR - RESEND API ERROR - DOMAIN NOT VERIFIED
		if (typeof error === "object" && error !== null) {
			const resendError = error as { name?: string; message?: string; statusCode?: number };

			if (resendError.statusCode === 403) {
				console.error("RESEND API 403 error:", resendError.message);
				return new NextResponse(
					JSON.stringify({
						success: false,
						message:
							"RESEND: Forbidden. The domain is not verified. Please verify domain on https://resend.com/domains",
					}),
					{ status: 403, headers: { "Content-Type": "application/json" } }
				);
			}
		}

		// RETURNING ERROR RESPONSE
		return new NextResponse(
			JSON.stringify({
				success: false,
				message: `RESEND: Error sending email to ${toEmail}`,
			}),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}
}
