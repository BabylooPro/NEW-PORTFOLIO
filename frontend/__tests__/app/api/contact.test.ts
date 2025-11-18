import { POST } from "../../../app/api/contact/route";

// MOCK FETCH
global.fetch = jest.fn();

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
        json: () => Promise.resolve({
            id: "test-id",
            from: "portfolio@maxremy.dev",
            to: ["maxremy.dev@gmail.com", mockEmail],
            created_at: new Date().toISOString()
        })
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
        expect(responseData).toHaveProperty("id");
        expect(responseData).toHaveProperty("from");
        expect(responseData).toHaveProperty("to");
        expect(responseData).toHaveProperty("created_at");
    });

    // TEST - HANDLE RESEND API ERRORS
    it("should handle Resend API errors", async () => {
        // MOCK FETCH ERROR
        (global.fetch as jest.Mock).mockImplementation(() => Promise.resolve({
            ok: false,
            status: 500,
            json: () => Promise.resolve({ message: "Resend API Error" })
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
            error: "Resend API Error"
        });
    });

    // TEST - HANDLE MISSING FIELDS
    it("should handle missing required fields", async () => {
        // MOCK REQUEST WITH MISSING FIELDS
        const request = new Request("http://localhost:3000/api/contact", {
            method: "POST",
            body: JSON.stringify({
                name: mockName,
                // email missing
                message: mockMessage,
            }),
        });

        // SEND REQUEST
        const response = await POST(request);
        const responseData = await response.json();

        // ASSERTIONS
        expect(response.status).toBe(400);
        expect(responseData).toEqual({
            error: "Missing required fields"
        });
    });
});
