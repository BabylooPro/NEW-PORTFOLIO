import { useState, useEffect } from "react";
import {
	CalendarDate,
	DateValue,
	getLocalTimeZone,
	today,
	parseDate,
} from "@internationalized/date";
import { useCalendarData } from "./useCalendarData";
import { useRouter, useSearchParams } from "next/navigation";

export function useShowCalendar() {
	const router = useRouter(); // USE NEXT.JS ROUTER
	const searchParams = useSearchParams(); // USE NEXT.JS SEARCH PARAMS
	const dateParam = searchParams.get("date"); // GET DATE PARAMETER FROM URL
	const slotParam = searchParams.get("slot"); // GET SLOT PARAMETER FROM URL

	// PARSE DATE FROM URL PARAMETERS OR USE TODAY'S DATE
	const initialDate = dateParam ? parseDate(dateParam) : today(getLocalTimeZone());

	const [date, setDate] = useState<CalendarDate>(initialDate); // STATE TO HOLD SELECTED DATE
	const [focusedDate, setFocusedDate] = useState<DateValue | undefined>(initialDate);
	const [currentView, setCurrentView] = useState("calendar");
	const [selectedPlatform, setSelectedPlatform] = useState("Phone call");

	const calendarData = useCalendarData(); // CUSTOM HOOK TO GET CALENDAR DATA

	// UPDATE DATE WHEN URL PARAMETERS CHANGE
	useEffect(() => {
		if (dateParam) {
			const parsedDate = parseDate(dateParam); // PARSE DATE FROM URL PARAMETER
			setDate(parsedDate); // SET SELECTED DATE
			setFocusedDate(parsedDate); // SET FOCUSED DATE
		}
	}, [dateParam]);

	const handleChangeDate = (newDate: DateValue) => {
		setDate(newDate as CalendarDate); // SET SELECTED DATE
		const url = new URL(window.location.href); // CREATE URL OBJECT

		// UTILISER LA MÉTHODE TOSTRING() DE CALENDARDATE POUR FORMATER LA DATE
		url.searchParams.set("date", (newDate as CalendarDate).toString());

		router.push(url.toString()); // PUSH URL TO ROUTER
	};

	const handleChangeAvailableTime = (time: string) => {
		const timeRegex = /^(\d{1,2}):(\d{2})([ap]m)?$/i; // REGEX TO VALIDATE TIME FORMAT
		const match = timeRegex.exec(time); // MATCH TIME FORMAT
		if (!match) {
			console.error("Invalid time format");
			return;
		}

		let hours = Number.parseInt(match[1]);
		const minutes = Number.parseInt(match[2]); // GET MINUTES
		const isPM = match[3] && match[3].toLowerCase() === "pm"; // CHECK IF TIME IS IN PM

		if (isPM && hours !== 12) {
			hours += 12;
		} else if (!isPM && hours === 12) {
			hours = 0; // SET HOURS TO 0 IF TIME IS IN PM
		}

		const currentDate = date.toDate(getLocalTimeZone()); // GET CURRENT DATE
		currentDate.setHours(hours, minutes); // SET HOURS AND MINUTES

		const url = new URL(window.location.href); // CREATE URL OBJECT
		url.searchParams.set("slot", currentDate.toISOString()); // SET SLOT PARAMETER
		router.push(url.toString()); // PUSH URL TO ROUTER
	};

	const handleViewChange = (view: string) => {
		setCurrentView(view); // SET CURRENT VIEW
	};

	return {
		date,
		focusedDate,
		calendarData,
		currentView,
		selectedPlatform,
		setFocusedDate,
		setSelectedPlatform,
		handleChangeDate,
		handleChangeAvailableTime,
		handleViewChange,
		showForm: !!dateParam && !!slotParam, // CHECK IF DATE AND SLOT PARAMETERS ARE PRESENT
	};
}
