import { Calendar } from "../components/calendar";
import { Platform } from "../components/platform";
import { Duration } from "../components/duration";
import { DateValue, getWeeksInMonth } from "@internationalized/date";
import { CalendarData } from "../hooks/useCalendarData";
import { useEffect, useState, useCallback } from "react";

interface CenterPanelProps {
	readonly date: DateValue;
	readonly focusedDate: DateValue | undefined;
	readonly calendarData: CalendarData;
	readonly handleChangeDate: (newDate: DateValue) => void;
	readonly setFocusedDate: (date: DateValue | undefined) => void;
	readonly setSelectedPlatform: (platform: string) => void;
	readonly currentView: string;
}

export function CenterPanel({
	date,
	focusedDate,
	calendarData,
	handleChangeDate,
	setFocusedDate,
	setSelectedPlatform,
	currentView,
}: CenterPanelProps) {
	const [panelHeight, setPanelHeight] = useState("h-[400px]"); // STATE TO HOLD PANEL HEIGHT

	// CUSTOM HOOK TO UPDATE PANEL HEIGHT
	const updatePanelHeight = useCallback((currentDate: DateValue) => {
		const weeksInMonth = getWeeksInMonth(currentDate, "en-CH");
		const newHeight = weeksInMonth > 5 ? "h-[450px]" : "h-[400px]";
		setPanelHeight(newHeight);
	}, []);

	// EFFECT TO UPDATE PANEL HEIGHT
	useEffect(() => {
		updatePanelHeight(date);
	}, [date, updatePanelHeight]);

	// HANDLE DATE CHANGE
	const handleDateChange = (newDate: DateValue) => {
		handleChangeDate(newDate);
		updatePanelHeight(newDate);
	};

	// HANDLE MONTH CHANGE
	const handleMonthChange = (newDate: DateValue) => {
		updatePanelHeight(newDate);
	};

	return (
		<div className={`flex-1 flex flex-col ${panelHeight}`}>
			{/* PANEL CONTENT */}
			<div className="flex-grow overflow-y-auto">
				{/* CALENDAR */}
				{currentView === "calendar" && (
					<Calendar
						value={date}
						onChange={handleDateChange}
						onMonthChange={handleMonthChange}
						calendarData={calendarData}
						focusedValue={focusedDate}
						onFocusChange={setFocusedDate}
					/>
				)}

				{/* PLATFORM */}
				{currentView === "platform" && <Platform onPlatformChange={setSelectedPlatform} />}

				{/* DURATION */}
				{currentView === "duration" && <Duration />}
			</div>
		</div>
	);
}
