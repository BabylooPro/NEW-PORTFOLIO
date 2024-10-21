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

export interface WakaTimeData {
	cached_at: string;
	data: {
		range: Range;
		editors: Editor[];
		operating_systems: OperatingSystem[];
		categories: Category[];
		grand_total: GrandTotal;
	};
	status: "available" | "away" | "busy"; //! IF STATUS DOES NOT CHANGE, DELETE THIS LINE
}
