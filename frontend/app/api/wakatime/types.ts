export interface WakaTimeData {
    cached_at: string;
    data: {
        categories: Category[];
        editors: Editor[];
        operating_systems: OperatingSystem[];
        languages: Language[];
        grand_total: GrandTotal;
        range: Range;
    };
    status: "available" | "away" | "busy";
    lastCachedAt: number;
    lastActivityAt: number;
}

export interface CachedWakaTimeData {
    cached_at: string;
    data: {
        range: Range;
        editors: Editor[];
        operating_systems: OperatingSystem[];
        categories: Category[];
        languages: Language[];
        grand_total: GrandTotal;
    };
    status: string;
    lastCachedAt: number;
    lastActivityAt: number;
}

export interface Category {
    name: string;
    total_seconds: number;
    digital: string;
    decimal: string;
    text: string;
    hours: number;
    minutes: number;
    seconds: number;
    percent: number;
}

export interface Editor {
    name: string;
    total_seconds: number;
    digital: string;
    decimal: string;
    text: string;
    hours: number;
    minutes: number;
    seconds: number;
    percent: number;
}

export interface OperatingSystem {
    name: string;
    total_seconds: number;
    digital: string;
    decimal: string;
    text: string;
    hours: number;
    minutes: number;
    seconds: number;
    percent: number;
    last_used?: number;
}

export interface Language {
    name: string;
    total_seconds: number;
    digital: string;
    decimal: string;
    text: string;
    hours: number;
    minutes: number;
    seconds: number;
    percent: number;
}

export interface GrandTotal {
    hours: number;
    minutes: number;
    total_seconds: number;
    digital: string;
    decimal: string;
    text: string;
}

export interface Range {
    start: string;
    end: string;
    date: string;
    text: string;
    timezone: string;
}
