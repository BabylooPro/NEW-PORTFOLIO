import { GET } from "../../app/api/wakatime/route";

// MOCK NEXTRESPONSE.JSON
jest.mock("next/server", () => ({
    NextResponse: {
        json: jest.fn().mockImplementation((body) => ({
            json: async () => body,
        })),
    },
}));

// TESTS - WAKATIME API
describe("WakaTime API Integration", () => {
    // TEST - FETCH WAKATIME DATA
    it("should fetch WakaTime data successfully", async () => {
        const response = await GET();
        const data = await response.json();

        // ASSERTIONS
        expect(data).toBeDefined();
        expect(data.error).toBeUndefined();
        expect(data.cached_at).toBeDefined();
        expect(data.data).toBeDefined();
        expect(data.data.range).toBeDefined();
        expect(data.data.editors).toBeDefined();
        expect(data.data.operating_systems).toBeDefined();
        expect(data.data.categories).toBeDefined();
        expect(data.data.languages).toBeDefined();
        expect(data.data.grand_total).toBeDefined();
        expect(data.status).toMatch(/^(available|away|busy)$/);

        // VALIDATE LANGUAGES DATA STRUCTURE
        expect(Array.isArray(data.data.languages)).toBe(true);
        if (data.data.languages.length > 0) {
            const language = data.data.languages[0];
            expect(language).toHaveProperty('name');
            expect(language).toHaveProperty('total_seconds');
            expect(language).toHaveProperty('digital');
            expect(language).toHaveProperty('percent');
        }
    });

    // TEST - CACHE FUNCTIONALITY
    it("should use cached data on subsequent calls within cache duration", async () => {
        const firstResponse = await GET();
        const firstData = await firstResponse.json();

        // WAIT FOR A SHORT PERIOD
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const secondResponse = await GET();
        const secondData = await secondResponse.json();

        // ASSERTIONS
        expect(secondData.cached_at).toBe(firstData.cached_at);
    });

    // TEST - STATUS CHANGES

    // TEST - ERROR HANDLING
});
