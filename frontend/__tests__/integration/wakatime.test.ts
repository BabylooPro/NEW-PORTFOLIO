import { GET } from "../../app/api/wakatime/route";

// MOCK RESPONSES
const mockWakaTimeResponse = {
    data: [{
        range: {
            start: "2023-04-01T00:00:00Z",
            end: "2023-04-01T23:59:59Z",
            date: "2023-04-01",
            text: "Today",
            timezone: "UTC",
        },
        editors: [{
            name: "VS Code",
            total_seconds: 3600,
            digital: "1:00",
            decimal: "1.00",
            text: "1 hr",
            hours: 1,
            minutes: 0,
            seconds: 0,
            percent: 100,
        }],
        operating_systems: [{
            name: "Mac",
            total_seconds: 3600,
            digital: "1:00",
            decimal: "1.00",
            text: "1 hr",
            hours: 1,
            minutes: 0,
            seconds: 0,
            percent: 100,
        }],
        categories: [{
            name: "Coding",
            total_seconds: 3600,
            digital: "1:00",
            decimal: "1.00",
            text: "1 hr",
            hours: 1,
            minutes: 0,
            seconds: 0,
            percent: 100,
        }],
        languages: [{
            name: "TypeScript",
            total_seconds: 3600,
            digital: "1:00",
            decimal: "1.00",
            text: "1 hr",
            hours: 1,
            minutes: 0,
            seconds: 0,
            percent: 100,
        }],
        grand_total: {
            total_seconds: 3600,
            digital: "1:00",
            decimal: "1.00",
            hours: 1,
            minutes: 0,
            text: "1 hr",
        },
    }],
    cached_at: new Date().toISOString(),
    status: "available",
};

const mockStrapiResponse = {
    data: [{
        id: 1,
        attributes: {
            name: "TypeScript",
            publishedAt: "2023-01-01T00:00:00Z"
        }
    }]
};

// SETUP MOCKS
beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementation((url) => {
        if (url.toString().includes('wakatime.com')) {
            return Promise.resolve(
                new Response(JSON.stringify(mockWakaTimeResponse), {
                    headers: { 'Content-Type': 'application/json' }
                })
            );
        } else if (url.toString().includes('strapi')) {
            return Promise.resolve(
                new Response(JSON.stringify(mockStrapiResponse), {
                    headers: { 'Content-Type': 'application/json' }
                })
            );
        }
        return Promise.reject(new Error('Unknown URL'));
    });
});

// TESTS - WAKATIME API
describe("WakaTime API Integration", () => {
    // TEST - FETCH WAKATIME DATA
    it("should fetch WakaTime data successfully", async () => {
        const response = await GET();
        expect(response).toBeDefined();
        expect(response.status).toBe(200);

        const responseText = await response.text();
        const data = JSON.parse(responseText);

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
        expect(firstResponse).toBeDefined();
        expect(firstResponse.status).toBe(200);

        const firstResponseText = await firstResponse.text();
        const firstData = JSON.parse(firstResponseText);

        // WAIT FOR A SHORT PERIOD
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const secondResponse = await GET();
        expect(secondResponse).toBeDefined();
        expect(secondResponse.status).toBe(200);

        const secondResponseText = await secondResponse.text();
        const secondData = JSON.parse(secondResponseText);

        // ASSERTIONS
        expect(secondData.cached_at).toBe(firstData.cached_at);
    });
});
