/*
	INFO: THIS COMPONENT IS USED TO DISPLAY STATUS OF MY AVAILABILITY VIA WAKATIME API
 	Available: Active in the last 15 minutes
 	Away: Inactive for 15 to 60 minutes
 	Busy: Inactive for more than an hour
*/

import { useWakaTimeData } from "@/utils/WakaTimeProvider";
import React from "react";

type StatusType = "available" | "away" | "busy" | "null"; // DEFINE STATUS TYPES

// PROPS FOR AVATAR STATUS
interface AvatarStatusProps {
	size?: number;
}

// COLORS FOR STATUS
const statusColors: Record<StatusType, string> = {
	null: "",
	available: "bg-green-500 border-green-700",
	away: "bg-orange-500 border-orange-700",
	busy: "bg-red-500 border-red-700",
};

// TITLES FOR STATUS
const statusTitles: Record<StatusType, string> = {
	null: "No Status",
	available: "Available",
	away: "Away",
	busy: "Busy",
};

// AVATAR STATUS COMPONENT
const AvatarStatus: React.FC<AvatarStatusProps> = ({ size = 12 }) => {
	const wakaTimeData = useWakaTimeData(); // GET WAKATIME DATA

	const status: StatusType = wakaTimeData?.status ?? "null"; // GET STATUS FROM WAKATIME DATA OR DEFAULT TO "null"

	return (
		<div
			className={`absolute -top-0 -left-0 rounded-full border-2 ${statusColors[status]}`}
			style={{ width: size, height: size }}
			title={statusTitles[status]}
		/>
	);
};

export default AvatarStatus;
