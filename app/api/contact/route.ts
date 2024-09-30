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

		// CHECK IF RESULT HAS A 'DATA' PROPERTY WITH AN 'ID'
		if (result.data && "id" in result.data) {
			return NextResponse.json({
				success: true,
				message: `Email sent successfully to ${toEmail} from ${name}.`,
			});
		} else {
			throw new Error("RESEND: Unexpected response from Resend API");
		}
	} catch (error: unknown) {
		console.error("RESEND Error sending email:", error);

		// CHECKING FOR 403 ERROR - RESEND API ERROR - DOMAIN NOT VERIFIED
		if (error instanceof Error) {
			return NextResponse.json(
				{
					success: false,
					message: error.message,
				},
				{ status: 500 }
			);
		}

		// RETURNING ERROR RESPONSE
		return NextResponse.json(
			{
				success: false,
				message: `RESEND: Error sending email to ${toEmail}`,
			},
			{ status: 500 }
		);
	}
}
