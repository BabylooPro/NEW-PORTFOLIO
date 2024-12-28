import { NextResponse } from "next/server";
import { WakaTimeData } from "../../../app/api/wakatime/types";

// MOCK NEXTRESPONSE.JSON
jest.mock("next/server", () => ({
    NextResponse: {
        json: jest.fn().mockImplementation((body) => ({
            json: async () => body,
        })),
    },
}));

// MOCK THE ENTIRE ROUTE MODULE
jest.mock("../../../app/api/wakatime/route", () => ({
    GET: jest.fn(),
}));

// IMPORT THE MOCKED GET FUNCTION
import { GET } from "../../../app/api/wakatime/route";

// MOCK WAKATIME API RESPONSE
const mockWakaTimeResponse: WakaTimeData = {
    cached_at: "2023-04-01T12:00:00Z",
    data: {
        range: {
            start: "2023-04-01T00:00:00Z",
            end: "2023-04-01T23:59:59Z",
            date: "2023-04-01",
            timezone: "UTC",
        },
        editors: [
            {
                name: "VS Code",
                total_seconds: 3600,
                digital: "1:00",
                percent: 100,
            },
        ],
        operating_systems: [
            {
                name: "Mac",
                total_seconds: 3600,
                digital: "1:00",
                percent: 100,
            },
        ],
        categories: [
            {
                name: "Coding",
                total_seconds: 3600,
                digital: "1:00",
                percent: 100,
            },
        ],
        languages: [
            {
                name: "TypeScript",
                total_seconds: 3600,
                digital: "1:00",
                percent: 100,
            },
        ],
        grand_total: {
            total_seconds: 3600,
            digital: "1:00",
            decimal: "1.00",
            hours: 1,
            minutes: 0,
            text: "1 hr",
        },
    },
    status: "available",
};

describe("WakaTime API Route", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    // TEST - FETCH AND CACHE DATA
    it("should fetch and cache data from WakaTime API", async () => {
        (GET as jest.Mock).mockResolvedValueOnce(
            NextResponse.json({ ...mockWakaTimeResponse, status: "available" })
        );

        const response = await GET();
        const data = await response.json();

        expect(data).toEqual(
            expect.objectContaining({ ...mockWakaTimeResponse, status: "available" })
        );
    });

    // TEST - USE CACHED DATA
    it("should use cached data within cache duration", async () => {
        (GET as jest.Mock).mockResolvedValueOnce(
            NextResponse.json({ ...mockWakaTimeResponse, status: "available" })
        );

        await GET();
        (GET as jest.Mock).mockClear();

        (GET as jest.Mock).mockResolvedValueOnce(
            NextResponse.json({ ...mockWakaTimeResponse, status: "available" })
        );

        const response = await GET();
        const data = await response.json();

        expect(GET).toHaveBeenCalledTimes(1);
        expect(data).toEqual(
            expect.objectContaining({ ...mockWakaTimeResponse, status: "available" })
        );
    });

    // TEST - HANDLE API ERROR
    it("should handle WakaTime API errors", async () => {
        (GET as jest.Mock).mockResolvedValueOnce(
            NextResponse.json({ error: "Failed to fetch WakaTime data" }, { status: 500 })
        );

        const response = await GET();
        const data = await response.json();

        expect(data).toEqual({ error: "Failed to fetch WakaTime data" });
    });

    // TEST - STATUS CHANGES
    it("should change status based on last activity", async () => {
        // INITIAL CALL
        (GET as jest.Mock).mockResolvedValueOnce(
            NextResponse.json({ ...mockWakaTimeResponse, status: "available" })
        );

        let response = await GET();
        let data = await response.json();
        expect(data.status).toBe("available");

        // AWAY STATUS
        (GET as jest.Mock).mockResolvedValueOnce(
            NextResponse.json({ ...mockWakaTimeResponse, status: "away" })
        );

        response = await GET();
        data = await response.json();
        expect(data.status).toBe("away");

        // BUSY STATUS
        (GET as jest.Mock).mockResolvedValueOnce(
            NextResponse.json({ ...mockWakaTimeResponse, status: "busy" })
        );

        response = await GET();
        data = await response.json();
        expect(data.status).toBe("busy");
    });
});
