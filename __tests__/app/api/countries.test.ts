import { GET } from "../../../app/api/countries/route";

global.fetch = jest.fn();

// MOCK CONSOLE.ERROR
const originalConsoleError = console.error;
beforeAll(() => {
	console.error = jest.fn();
});

describe("GET /api/countries", () => {
	afterAll(() => {
		console.error = originalConsoleError;
	});

	// TEST FOR TRANSFORMED DATA
	it("Should return transformed data correctly", async () => {
		// SIMULATE API RESPONSE
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: () =>
				Promise.resolve([
					{
						id: 1,
						name: "Switzerland",
						iso3: "CHE",
						iso2: "CH",
						numeric_code: "756",
						phonecode: "41",
						capital: "Bern",
						currency: "CHF",
						currency_name: "Swiss Franc",
						currency_symbol: "Fr",
						tld: ".ch",
						native: "Schweiz",
						region: "Europe",
						subregion: "Western Europe",
						timezones: [
							{ zoneName: "Europe/Zurich", gmtOffset: 3600, abbreviation: "CET" },
						],
						translations: { fr: "Suisse" },
						latitude: "46.8182",
						longitude: "8.2275",
						emoji: "🇨🇭",
						emojiU: "U+1F1E8 U+1F1ED",
					},
				]),
		});

		// GET DATA
		const response = await GET();
		expect(response.status).toBe(200);

		// CHECK DATA
		const jsonResponse = await response.json();
		expect(jsonResponse[0]).toMatchObject({
			id: 1,
			name: "Switzerland",
			iso3: "CHE",
			iso2: "CH",
			numeric_code: "756",
			phone_code: "41",
			capital: "Bern",
			currency: "CHF",
			currency_name: "Swiss Franc",
			currency_symbol: "Fr",
			tld: ".ch",
			native: "Schweiz",
			region: "Europe",
			subregion: "Western Europe",
			timezones: [{ zoneName: "Europe/Zurich", gmtOffset: 3600, abbreviation: "CET" }],
			translations: { fr: "Suisse" },
			latitude: "46.8182",
			longitude: "8.2275",
			emoji: "🇨🇭",
			emojiU: "U+1F1E8 U+1F1ED",
		});
	});

	// TEST FOR 500 ERROR
	it("Should return a 500 error if the API response is not OK", async () => {
		// SIMULATE API RESPONSE
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: false,
			status: 500,
		});

		// GET DATA
		const response = await GET();
		expect(response.status).toBe(500);

		// CHECK DATA
		const jsonResponse = await response.json();
		expect(jsonResponse).toEqual({ error: "Failed to fetch country data" });

		// VERIFY CONSOLE.ERROR WAS CALLED WITHOUT DISPLAYING THE MESSAGE
		expect(console.error).toHaveBeenCalledWith(
			"Error fetching country data:",
			expect.any(Error)
		);
	});

	it("Should return a 500 error if the JSON data is malformed", async () => {
		// SIMULATE API RESPONSE
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: () => Promise.reject(new SyntaxError("Unexpected token")),
		});

		// GET DATA
		const response = await GET();
		expect(response.status).toBe(500);

		// CHECK DATA
		const jsonResponse = await response.json();
		expect(jsonResponse).toEqual({ error: "Failed to fetch country data" });
	});
});
