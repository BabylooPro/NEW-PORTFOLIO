import fetch from "node-fetch";

const fromEmail = "portfolio@maxremy.dev";
const toEmail = "maxremy.dev@gmail.com";

// TESTS - CONTACT API
describe("Contact API Integration", () => {
	// TEST - SEND EMAIL VIA RESEND API
	it("should send an email successfully via Resend API", async () => {
		// MOCK DATA
		const name = "Test User";
		const email = "test@example.com";
		const message = "This is a test message from the integration test.";
		const submissionId = Date.now().toString(36) + Math.random().toString(36).slice(2);

		// MOCK REQUEST
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
				html: `
					<h2>New Contact Form Submission</h2>
					<br />
					<p><strong>Name:</strong> ${name}</p>
					<p><strong>Email:</strong> ${email}</p>
					<p><strong>Message:</strong> ${message}</p>
					<br />
					<p style='color: gray; font-size: 0.8em;'>This is a copy of the message sent to the portfolio owner.</p>
					<p style='color: gray; font-size: 0.8em;'><strong>Submission ID:</strong> ${submissionId}</p>
				`,
			}),
		});

		// ASSERTIONS
		const result = await response.json();
		expect(response.status).toBe(200);
		expect(result.id).toBeTruthy();
	}, 10000); // 10 SECONDS TIMEOUT
});
