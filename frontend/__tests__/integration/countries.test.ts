import { GET } from "../../app/api/countries/route";

describe("GET /api/countries", () => {
	// RESTORE MOCKS
	beforeEach(() => {
		jest.restoreAllMocks();
	});

	// TEST FOR DATA
	it("Should return a list of countries from the external API", async () => {
		const response = await GET(); // GET DATA

		// CHECK STATUS
		expect(response.status).toBe(200);

		// CHECK DATA
		const jsonResponse = await response.json();
		expect(Array.isArray(jsonResponse)).toBe(true);
		expect(jsonResponse.length).toBeGreaterThan(0);

		// CHECK PROPERTIES
		const country = jsonResponse[0];
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
		// SIMULATE API RESPONSE
		const mockFetch = jest.spyOn(global, "fetch").mockResolvedValue({
			ok: true,
			json: async () => [],
		} as Response);

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
		// SIMULATE API RESPONSE
		jest.spyOn(global, "fetch").mockResolvedValue({
			ok: false,
			status: 500,
			json: async () => ({ error: "Failed to fetch country data" }),
		} as Response);

		// GET DATA
		const response = await GET();

		// CHECK STATUS
		expect(response.status).toBe(500);

		// CHECK DATA
		const jsonResponse = await response.json();
		expect(jsonResponse).toEqual({ error: "Failed to fetch country data" });
	});
});
