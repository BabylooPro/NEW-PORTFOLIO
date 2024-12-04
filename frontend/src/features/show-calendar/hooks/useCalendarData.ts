import { useState, useEffect } from "react";
import { fakeCalendarData, FakeCalendarData } from "../data/fake-user-data";

// CUSTOM HOOK TO GET CALENDAR DATA
export function useCalendarData() {
	const [calendarData, setCalendarData] = useState<FakeCalendarData>({}); // STATE TO HOLD CALENDAR DATA

	// EFFECT TO SET CALENDAR DATA
	useEffect(() => {
		setCalendarData(fakeCalendarData); // SET CALENDAR DATA
	}, []);

	return calendarData; // RETURN CALENDAR DATA
}

export type CalendarData = FakeCalendarData; // TYPE FOR CALENDAR DATA
