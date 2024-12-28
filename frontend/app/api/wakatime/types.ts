export interface Range {
    start: string;
    end: string;
    date: string;
    timezone: string;
}

export interface Editor {
    name: string;
    total_seconds: number;
    digital: string;
    percent: number;
}

export interface OperatingSystem {
    name: string;
    total_seconds: number;
    digital: string;
    percent: number;
    last_used?: number;
}

export interface Category {
    name: string;
    total_seconds: number;
    digital: string;
    percent: number;
}

export interface GrandTotal {
    decimal: string;
    digital: string;
    hours: number;
    minutes: number;
    text: string;
    total_seconds: number;
}

export interface Language {
    name: string;
    total_seconds: number;
    digital: string;
    percent: number;
}

export interface WakaTimeData {
    cached_at: string;
    data: {
        range: Range;
        editors: Editor[];
        operating_systems: OperatingSystem[];
        categories: Category[];
        languages: Language[];
        grand_total: GrandTotal;
    };
    status: "available" | "away" | "busy";
}

export interface CachedWakaTimeData extends WakaTimeData {
    lastCachedAt: number;
}
