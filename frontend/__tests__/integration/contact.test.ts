import 'isomorphic-fetch';

const fromEmail = "portfolio@maxremy.dev";
const toEmail = "maxremy.dev@gmail.com";

interface ResendResponse {
    id: string;
    from: string;
    to: string[];
    created_at: string;
}

// MOCK FETCH FOR TESTS
const mockFetch = jest.fn();
global.fetch = mockFetch;

// TESTS - CONTACT API
describe("Contact API Integration", () => {
    beforeEach(() => {
        mockFetch.mockReset();
    });

    // TEST - SEND EMAIL VIA RESEND API
    it("should send an email successfully via Resend API", async () => {
        // MOCK RESPONSE
        const mockResponse: ResendResponse = {
            id: "mock-email-id",
            from: fromEmail,
            to: [toEmail],
            created_at: new Date().toISOString()
        };
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => mockResponse
        });

        // TEST DATA
        const name = "Integration Test";
        const email = fromEmail;
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
        const result = (await response.json()) as ResendResponse;
        expect(response.status).toBe(200);
        expect(result.id).toBeTruthy();

        // VERIFY MOCK WAS CALLED CORRECTLY
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledWith(
            "http://localhost:3000/api/contact",
            expect.objectContaining({
                method: "POST",
                headers: expect.objectContaining({
                    "Content-Type": "application/json"
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
