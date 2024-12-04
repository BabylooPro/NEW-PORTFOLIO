import { useState, useEffect } from "react";

// CUSTOM HOOK TO GET DURATION
export function useDuration() {
	const [selectedDuration, setSelectedDuration] = useState("15"); // STATE TO HOLD SELECTED DURATION

	// EFFECT TO HANDLE DURATION CHANGE
	useEffect(() => {
		const handleDurationChange = (event: CustomEvent) => {
			setSelectedDuration(event.detail.duration); // SET SELECTED DURATION
		};
		window.addEventListener("durationChanged", handleDurationChange as EventListener); // ADD EVENT LISTENER
		return () => {
			window.removeEventListener("durationChanged", handleDurationChange as EventListener); // REMOVE EVENT LISTENER
		};
	}, []);

	return selectedDuration; // RETURN SELECTED DURATION
}
