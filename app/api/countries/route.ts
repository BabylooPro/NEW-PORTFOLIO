import { NextResponse } from "next/server";

const API_KEY = process.env.COUNTRY_STATE_CITY_API_KEY;
const API_URL = "https://api.countrystatecity.in/v1/countries";

interface CountryApiResponse {
	id: number;
	name: string;
	iso3: string;
	iso2: string;
	numeric_code: string;
	phonecode: string;
	capital: string;
	currency: string;
	currency_name: string;
	currency_symbol: string;
	tld: string;
	native: string | null;
	region: string;
	subregion: string;
	timezones: Array<{
		zoneName: string;
		gmtOffset: number;
		gmtOffsetName: string;
		abbreviation: string;
		tzName: string;
	}>;
	translations: { [key: string]: string };
	latitude: string;
	longitude: string;
	emoji: string;
	emojiU: string;
}

export async function GET() {
	try {
		// FETCH DATA FROM API
		const response = await fetch(API_URL, {
			headers: {
				"X-CSCAPI-KEY": API_KEY ?? "",
			},
		});

		// CHECK IF RESPONSE IS OK
		if (!response.ok) {
			throw new Error(`API response error: ${response.status}`);
		}

		// GET DATA FROM API
		const data: CountryApiResponse[] = await response.json();

		// TRANSFORM DATA TO MATCH OUR EXISTING STRUCTURE
		const transformedData = data.map((country) => ({
			id: country.id,
			name: country.name,
			iso3: country.iso3,
			iso2: country.iso2,
			numeric_code: country.numeric_code,
			phone_code: country.phonecode,
			capital: country.capital,
			currency: country.currency,
			currency_name: country.currency_name,
			currency_symbol: country.currency_symbol,
			tld: country.tld,
			native: country.native,
			region: country.region,
			subregion: country.subregion,
			timezones: country.timezones,
			translations: country.translations,
			latitude: country.latitude,
			longitude: country.longitude,
			emoji: country.emoji,
			emojiU: country.emojiU,
		}));

		// RETURN DATA
		return process.env.NODE_ENV === "test"
			? new Response(JSON.stringify(transformedData), { status: 200 })
			: NextResponse.json(transformedData);
	} catch (error) {
		console.error("Error fetching country data:", error);
		return process.env.NODE_ENV === "test"
			? new Response(JSON.stringify({ error: "Failed to fetch country data" }), {
					status: 500,
			  })
			: NextResponse.json({ error: "Failed to fetch country data" }, { status: 500 });
	}
}
