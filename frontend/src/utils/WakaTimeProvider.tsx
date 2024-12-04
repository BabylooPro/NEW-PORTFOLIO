/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useEffect, useState } from "react";

const WakaTimeContext = createContext<any>(null); // CREATE A CONTEXT TO HOLD WAKATIME DATA

// PROVIDER COMPONENT TO FETCH AND PROVIDE WAKATIME DATA
export const WakaTimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [wakaTimeData, setWakaTimeData] = useState<any>(null); // STATE TO HOLD WAKATIME DATA

	// FETCH WAKATIME DATA
	useEffect(() => {
		const fetchWakaTimeData = async () => {
			try {
				const response = await fetch("/api/wakatime");
				if (response.ok) {
					const data = await response.json();
					setWakaTimeData(data);
				} else {
					console.error(
						"Failed to fetch WakaTime data, response status:",
						response.status
					);
				}
			} catch (error) {
				console.error("Error fetching WakaTime data:", error);
			}
		};

		fetchWakaTimeData();
		const intervalId = setInterval(fetchWakaTimeData, 300000); // FETCH EVERY 5 MINUTES

		return () => clearInterval(intervalId);
	}, []);

	return <WakaTimeContext.Provider value={wakaTimeData}>{children}</WakaTimeContext.Provider>;
};

// CUSTOM HOOK TO USE WAKATIME DATA IN ANY COMPONENT
export const useWakaTimeData = () => {
	return useContext(WakaTimeContext);
};
