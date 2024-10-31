import { Calendar } from "../components/calendar";
import { Platform } from "../components/platform";
import { Duration } from "../components/duration";
import { DateValue, getWeeksInMonth } from "@internationalized/date";
import { CalendarData } from "../hooks/useCalendarData";
import { useEffect, useState, useCallback } from "react";
import type {
	DurationValues,
	PlatformValues,
	CalendarFormData,
} from "@/features/show-calendar/utils/schema";
import { useSearchParams, useRouter } from "next/navigation";

interface CenterPanelProps {
	readonly date: DateValue;
	readonly focusedDate: DateValue | undefined;
	readonly calendarData: CalendarData;
	readonly handleChangeDate: (newDate: DateValue) => void;
	readonly setFocusedDate: (date: DateValue | undefined) => void;
	readonly setSelectedPlatform: (platform: string, data?: Partial<PlatformValues>) => void;
	readonly setSelectedDuration?: (duration: DurationValues) => void;
	readonly currentView: string;
}

export function CenterPanel({
	date,
	focusedDate,
	calendarData,
	handleChangeDate,
	setFocusedDate,
	setSelectedPlatform,
	setSelectedDuration,
	currentView,
}: CenterPanelProps) {
	const [panelHeight, setPanelHeight] = useState("h-[400px]");

	// GET URL PARAMS
	const searchParams = useSearchParams();
	const router = useRouter();

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

	// HANDLE CALENDAR FORM SUBMIT
	const handleCalendarSubmit = (data: CalendarFormData) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("selectedDate", data.selectedDate);
		if (data.selectedTime) {
			params.set("selectedTime", data.selectedTime);
		}
		router.replace(`?${params.toString()}`);
	};

	// FUNCTION TO UPDATE DURATION URL PARAMS
	const updateDurationParams = useCallback(
		(values: DurationValues) => {
			const params = new URLSearchParams(searchParams.toString()); // GET URL PARAMS

			// UPDATE DURATION PARAM
			params.set("duration", values.duration);

			// BREAK PARAMS
			if (values.break.hasBreak) {
				params.set("hasBreak", "true");
				params.set("breakDuration", values.break.breakDuration.toString());
			} else {
				params.delete("hasBreak");
				params.delete("breakDuration");
			}

			// BUFFER PARAMS
			if (values.buffer.hasBuffer) {
				params.set("hasBuffer", "true");
				params.set("bufferDuration", values.buffer.bufferDuration.toString());
			} else {
				params.delete("hasBuffer");
				params.delete("bufferDuration");
			}

			// DELAY PARAMS
			if (values.delay.hasDelay) {
				params.set("hasDelay", "true");
				params.set("delayDuration", values.delay.delayDuration.toString());
			} else {
				params.delete("hasDelay");
				params.delete("delayDuration");
			}

			// FLEXIBLE PARAMS
			if (values.flexible.isFlexible) {
				params.set("isFlexible", "true");
			} else {
				params.delete("isFlexible");
			}

			router.replace(`?${params.toString()}`);
		},
		[searchParams, router]
	);

	// HANDLE DURATION CHANGE
	useEffect(() => {
		if (currentView === "duration") {
			const handleDurationChange = (event: Event) => {
				const customEvent = event as CustomEvent<DurationValues>;
				const values = customEvent.detail;
				setSelectedDuration?.(values);
				updateDurationParams(values);
			};

			window.addEventListener("durationChanged", handleDurationChange as EventListener);
			return () => {
				window.removeEventListener(
					"durationChanged",
					handleDurationChange as EventListener
				);
			};
		}
	}, [currentView, setSelectedDuration, updateDurationParams]);

	// HANDLE PLATFORM CHANGE
	useEffect(() => {
		if (currentView === "platform") {
			const platformFromUrl = searchParams.get("platform");
			if (platformFromUrl) {
				const platformData: Partial<PlatformValues> = {
					platform: platformFromUrl,
					customLink: searchParams.get("customLink") === "true",
					webcam: searchParams.get("webcam") === "true",
					isPhysical: searchParams.get("isPhysical") === "true",
				};
				setSelectedPlatform(platformFromUrl, platformData);
			}
		}
	}, [currentView, searchParams, setSelectedPlatform]);

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
						onSubmit={handleCalendarSubmit}
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
