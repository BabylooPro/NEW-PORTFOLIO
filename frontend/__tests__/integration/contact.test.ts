import 'isomorphic-fetch';

// MOCK ENVIRONMENT VARIABLES
process.env.CONTACTFORM_MINIMALAPI_URL = "https://api.example.com";
process.env.CONTACTFORM_MINIMALAPI_KEY = "test-api-key";

interface ContactFormResponse {
    success: boolean;
    message: string;
}

// MOCK FETCH FOR TESTS
const mockFetch = jest.fn();
global.fetch = mockFetch;

// TESTS - CONTACT API
describe("Contact API Integration", () => {
    beforeEach(() => {
        mockFetch.mockReset();
    });

    // TEST - SEND EMAIL VIA CONTACTFORM API
    it("should send an email successfully via ContactForm API", async () => {
        // MOCK RESPONSE FROM CONTACTFORM API
        const mockApiResponse = "Email sent successfully using SMTP_1 (sender@example.com -> recipient@example.com)";
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            text: async () => mockApiResponse
        });

        // TEST DATA
        const name = "Integration Test";
        const email = "test@example.com";
        const message = "This is a test email sent from the integration tests. If you receive this, the email sending functionality is working correctly.";

        // SEND REQUEST TO OUR API ROUTE
        const response = await fetch("http://localhost:3000/api/contact", {
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

        // ASSERTIONS
        const result = (await response.json()) as ContactFormResponse;
        expect(response.status).toBe(200);
        expect(result.success).toBe(true);
        expect(result.message).toBe(mockApiResponse);

        // VERIFY MOCK WAS CALLED CORRECTLY WITH CONTACTFORM API
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledWith(
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
