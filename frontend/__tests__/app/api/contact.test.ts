// MOCK NEXT SERVER BEFORE IMPORT
jest.mock("next/server", () => ({
	NextResponse: {
		json: jest.fn().mockImplementation((body, init) => ({
			json: () => Promise.resolve(body),
			status: init?.status || 200,
		})),
	},
}));

import { POST } from "../../../app/api/contact/route";

// MOCK FETCH
global.fetch = jest.fn();

// MOCK ENVIRONMENT VARIABLES
process.env.CONTACTFORM_MINIMALAPI_URL = "https://api.example.com";
process.env.CONTACTFORM_MINIMALAPI_KEY = "test-api-key";

// MOCK DATA
const mockName = "Test User";
const mockEmail = "test@example.com";
const mockMessage = "Test message";

// SETUP MOCKS
beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockImplementation(() => Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve("Email sent successfully using SMTP_1 (sender@example.com -> recipient@example.com)")
    }));
});

// TESTS - CONTACT API
describe("Contact API", () => {
    // TEST - SEND EMAIL SUCCESSFULLY
    it("should send an email successfully", async () => {
        // MOCK REQUEST
        const request = new Request("http://localhost:3000/api/contact", {
            method: "POST",
            body: JSON.stringify({
                name: mockName,
                email: mockEmail,
                message: mockMessage,
            }),
        });

        // SEND REQUEST
        const response = await POST(request);
        const responseData = await response.json();

        // ASSERTIONS
        expect(response.status).toBe(200);
        expect(responseData).toEqual({
            success: true,
            message: "Email sent successfully using SMTP_1 (sender@example.com -> recipient@example.com)"
        });

        // VERIFY FETCH WAS CALLED WITH CORRECT PARAMETERS
        expect(global.fetch).toHaveBeenCalledWith(
            "https://api.example.com/api/v1/email/1",
            expect.objectContaining({
                method: "POST",
                headers: expect.objectContaining({
                    "Content-Type": "application/json",
                    "X-Api-Key": "test-api-key"
                })
            })
        );
    });

    // TEST - HANDLE CONTACTFORM API ERRORS
    it("should handle ContactForm API errors", async () => {
        // MOCK FETCH ERROR
        (global.fetch as jest.Mock).mockImplementation(() => Promise.resolve({
            ok: false,
            status: 500,
            text: () => Promise.resolve("Failed to send email after trying all available SMTP configurations")
        }));

        // MOCK REQUEST
        const request = new Request("http://localhost:3000/api/contact", {
            method: "POST",
            body: JSON.stringify({
                name: mockName,
                email: mockEmail,
                message: mockMessage,
            }),
        });

        // SEND REQUEST
        const response = await POST(request);
        const responseData = await response.json();

        // ASSERTIONS
        expect(response.status).toBe(500);
        expect(responseData).toEqual({
            success: false,
            message: "Failed to send email after trying all available SMTP configurations"
        });
    });
});
