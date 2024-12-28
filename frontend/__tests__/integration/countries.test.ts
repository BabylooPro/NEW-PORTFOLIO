import { GET } from "../../app/api/countries/route";

describe("GET /api/countries", () => {
    // RESTORE MOCKS
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    // TEST FOR DATA
    it("Should return a list of countries from the external API", async () => {
        // MOCK RESPONSE DATA
        const mockCountries = [
            {
                id: 1,
                name: "Test Country",
                iso3: "TST",
                iso2: "TS",
                capital: "Test Capital",
                currency: "TST",
                emoji: "🏳️",
                numeric_code: "123",
                phone_code: "+1",
            },
        ];

        // MOCK FETCH
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => mockCountries,
        });

        const response = await GET();
        const data = await response.json();

        // CHECK STATUS
        expect(response.status).toBe(200);

        // CHECK DATA
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThan(0);

        // CHECK PROPERTIES
        const country = data[0];
        expect(country).toHaveProperty("id");
        expect(country).toHaveProperty("name");
        expect(country).toHaveProperty("iso3");
        expect(country).toHaveProperty("iso2");
        expect(country).toHaveProperty("capital");
        expect(country).toHaveProperty("currency");
        expect(country).toHaveProperty("emoji");

        // CHECK TYPES
        if (country.numeric_code) expect(typeof country.numeric_code).toBe("string");
        if (country.phone_code) expect(typeof country.phone_code).toBe("string");
    });

    // TEST FOR AUTHENTICATION HEADER
    it("Should include the `X-CSCAPI-KEY` authentication header", async () => {
        // MOCK FETCH
        const mockFetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => [],
        });
        global.fetch = mockFetch;

        // GET DATA
        await GET();

        // CHECK CALL
        expect(mockFetch).toHaveBeenCalledWith(expect.any(String), {
            headers: {
                "X-CSCAPI-KEY": process.env.COUNTRY_STATE_CITY_API_KEY || "",
            },
        });
    });

    // TEST FOR 500 ERROR
    it("Should return a 500 error if the external API does not respond", async () => {
        // MOCK FETCH
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            status: 500,
            json: async () => ({ error: "Failed to fetch country data" }),
        });

        // GET DATA
        const response = await GET();
        const data = await response.json();

        // CHECK STATUS
        expect(response.status).toBe(500);

        // CHECK DATA
        expect(data).toEqual({ error: "Failed to fetch country data" });
    });
});
