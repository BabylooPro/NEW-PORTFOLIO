// MOCK NEXT SERVER BEFORE IMPORT
jest.mock("next/server", () => ({
    NextResponse: {
        json: jest.fn().mockImplementation((body, init) => ({
            json: () => Promise.resolve(body),
            status: init?.status || 200,
        })),
    },
}));

import { POST } from "../../app/api/contact/route";

// MOCK ENVIRONMENT VARIABLES
process.env.CONTACTFORM_MINIMALAPI_URL = "https://api.example.com";
process.env.CONTACTFORM_MINIMALAPI_KEY = "test-api-key";

interface ContactFormResponse {
    success: boolean;
    message: string;
}

// TESTS - CONTACT API
describe("Contact API Integration", () => {
    // RESET MOCKS
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // TEST - SEND EMAIL VIA CONTACTFORM API
    it("should send an email successfully via ContactForm API", async () => {
        // MOCK RESPONSE FROM CONTACTFORM API
        const mockApiResponse = "Email sent successfully using SMTP_1 (sender@example.com -> recipient@example.com)";
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            text: async () => mockApiResponse
        });

        // TEST DATA
        const name = "Integration Test";
        const email = "test@example.com";
        const message = "This is a test email sent from the integration tests. If you receive this, the email sending functionality is working correctly.";

        // CREATE MOCK REQUEST
        const mockRequest = new Request("http://localhost:3000/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email,
                message,
            }),
        });

        // CALL POST FUNCTION
        const response = await POST(mockRequest);
        const result = (await response.json()) as ContactFormResponse;

        // ASSERTIONS
        expect(response.status).toBe(200);
        expect(result.success).toBe(true);
        expect(result.message).toBe(mockApiResponse);

        // VERIFY MOCK WAS CALLED CORRECTLY WITH CONTACTFORM API
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith(
            "https://api.example.com/api/v1/email/1",
            expect.objectContaining({
                method: "POST",
                headers: expect.objectContaining({
                    "Content-Type": "application/json",
                    "X-Api-Key": "test-api-key"
                }),
                body: JSON.stringify({
                    name,
                    email,
                    message,
                })
            })
        );
    }, 10000);
});
