// DEFINE STATUS TYPES
export type StatusType = "unavailable" | "limited" | "available";

// DEFINE STATUS COLORS
export const statusColors: Record<StatusType, string> = {
	unavailable: "bg-red-500 border-2 border-red-600",
	limited: "bg-yellow-500 border-2 border-yellow-600",
	available: "bg-green-500 border-2 border-green-600",
};

// FUNCTION TO GET STATUS BASED ON AVAILABLE TIMES COUNT
export function getStatus(availableTimesCount: number): StatusType {
	if (availableTimesCount === 0) return "unavailable";
	if (availableTimesCount <= 5) return "limited";
	return "available";
}

// FUNCTION TO GET STATUS COLOR
export function getStatusColor(status: StatusType): string {
	return statusColors[status];
}
