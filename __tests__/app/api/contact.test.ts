import { POST } from "../../../app/api/contact/route";
import { resend } from "../../../app/api/contact/utils";

// MOCK NEXT REQUEST
class MockNextRequest {
	private body: string;

	constructor(url: string, options: { method: string; body: string }) {
		this.body = options.body;
	}

	async json() {
		return JSON.parse(this.body);
	}
}

// MOCK RESEND
jest.mock("../../../app/api/contact/utils", () => ({
	resend: {
		emails: {
			send: jest.fn(),
		},
	},
}));

// MOCK NEXT RESPONSE
jest.mock("next/server", () => ({
	NextResponse: {
		json: jest.fn().mockImplementation((body, init) => ({
			status: init?.status || 200,
			json: async () => body,
		})),
	},
}));

// SUPPRESS CONSOLE ERRORS
beforeAll(() => {
	jest.spyOn(console, "error").mockImplementation(() => {});
});

// RESTORE CONSOLE ERROR
afterAll(() => {
	(console.error as jest.Mock).mockRestore();
});

// TESTS - CONTACT API
describe("Contact API", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	// TEST - SEND EMAIL SUCCESSFULLY
	it("should send an email successfully", async () => {
		(resend.emails.send as jest.Mock).mockResolvedValue({ data: { id: "123" }, error: null });

		// MOCK REQUEST
		const req = new MockNextRequest("http://localhost:3000/api/contact", {
			method: "POST",
			body: JSON.stringify({
				name: "Test User",
				email: "test@example.com",
				message: "Hello, this is a test message",
			}),
		});

		// MOCK RESPONSE
		const response = await POST(req as unknown as Request);
		const responseData = await response.json();

		// ASSERTIONS
		expect(response.status).toBe(200);
		expect(responseData).toEqual({
			success: true,
			message: expect.stringContaining("Email sent successfully"),
		});

		// CHECK IF RESEND WAS CALLED
		expect(resend.emails.send).toHaveBeenCalledTimes(1);
		expect(resend.emails.send).toHaveBeenCalledWith(
			expect.objectContaining({
				from: "portfolio@maxremy.dev",
				to: ["maxremy.dev@gmail.com", "test@example.com"],
				subject: expect.stringContaining("New Contact from Test User"),
				html: expect.stringContaining("Hello, this is a test message"),
			})
		);
	});

	// TEST - HANDLE RESEND API ERRORS
	it("should handle Resend API errors", async () => {
		(resend.emails.send as jest.Mock).mockRejectedValue(new Error("Resend API Error"));

		// MOCK REQUEST
		const req = new MockNextRequest("http://localhost:3000/api/contact", {
			method: "POST",
			body: JSON.stringify({
				name: "Test User",
				email: "test@example.com",
				message: "Hello, this is a test message",
			}),
		});

		// MOCK RESPONSE
		const response = await POST(req as unknown as Request);
		const responseData = await response.json();

		// ASSERTIONS
		expect(response.status).toBe(500);
		expect(responseData).toEqual({
			success: false,
			message: "Resend API Error",
		});
	});

	// TEST - HANDLE UNEXPECTED RESEND API RESPONSE
	it("should handle unexpected Resend API response", async () => {
		(resend.emails.send as jest.Mock).mockResolvedValue({ data: null, error: null });

		// MOCK REQUEST
		const req = new MockNextRequest("http://localhost:3000/api/contact", {
			method: "POST",
			body: JSON.stringify({
				name: "Test User",
				email: "test@example.com",
				message: "Hello, this is a test message",
			}),
		});

		// MOCK RESPONSE
		const response = await POST(req as unknown as Request);
		const responseData = await response.json();

		// ASSERTIONS
		expect(response.status).toBe(500);
		expect(responseData).toEqual({
			success: false,
			message: "RESEND: Unexpected response from Resend API",
		});
	});
});
