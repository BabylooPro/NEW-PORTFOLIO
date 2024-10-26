import { Tabs, TabsContent } from "@/components/ui/tabs";
import type { DateValue } from "@internationalized/date";
import { availableTimes } from "../data/available-times";
import { useMemo, useState, useEffect } from "react";
import { CalendarData } from "../hooks/useCalendarData";
import PickerWheel from "../components/right-panel/picker-wheel";
import { Skeleton } from "@/components/ui/skeleton";

interface RightPanelProps {
	readonly timeZone: string;
	readonly date: DateValue;
	readonly calendarData: CalendarData;
	readonly onTimeSelect: () => void;
	readonly onDateTimeChange: (date: Date) => void;
}

export function RightPanel({
	timeZone,
	date,
	calendarData,
	onTimeSelect,
	onDateTimeChange,
}: RightPanelProps) {
	// GET DATE PARTS
	const [dayName, monthName, dayNumber, yearNumber] = date
		.toDate(timeZone)
		.toLocaleDateString("en-CH", {
			weekday: "long",
			day: "numeric",
			month: "short",
			year: "numeric",
		})
		.split(" ");

	const dateString = date.toString(); // GET DATE STRING
	const availableTimesCount = calendarData[dateString] || 0; // GET AVAILABLE TIMES COUNT
	const [selectedTimeFormat, setSelectedTimeFormat] = useState<"12" | "24">("24"); // STATE FOR SELECTED TIME FORMAT
	const [resetKey, setResetKey] = useState(0); // STATE FOR RESET KEY
	const [isLoading, setIsLoading] = useState(false); // STATE FOR LOADING

	const filteredAvailableTimes = useMemo(() => {
		// IF NO AVAILABLE TIMES, RETURN EMPTY ARRAY
		if (availableTimesCount === 0) return [];

		// IF AVAILABLE TIMES COUNT IS GREATER THAN OR EQUAL TO AVAILABLE TIMES, RETURN AVAILABLE TIMES
		if (availableTimesCount >= availableTimes.length) return availableTimes;

		const timesCopy = [...availableTimes]; // COPY AVAILABLE TIMES
		const result = []; // RESULT ARRAY

		// LOOP THROUGH AVAILABLE TIMES COUNT
		for (let i = 0; i < availableTimesCount; i++) {
			if (timesCopy.length > 0) {
				const randomIndex = Math.floor(Math.random() * timesCopy.length); // GET RANDOM INDEX
				result.push(timesCopy[randomIndex]); // PUSH RANDOM TIME TO RESULT
				timesCopy.splice(randomIndex, 1); // REMOVE RANDOM TIME FROM TIMES COPY
			}
		}

		// SORT RESULT BY TIME
		return result.sort((a, b) => {
			return a["24"].localeCompare(b["24"]); // SORT BY TIME
		});
	}, [availableTimesCount]);

	// HANDLE DATE CHANGE
	useEffect(() => {
		setIsLoading(true); // ACTIVATE LOADING
		setResetKey((prev) => prev + 1);
		console.log("Date changed, resetting PickerWheel with resetKey:", resetKey + 1);

		// SIMULATE LOADING DELAY
		const loadingTimeout = setTimeout(() => {
			setIsLoading(false); // DISABLE LOADING AFTER DELAY
		}, 500);

		return () => clearTimeout(loadingTimeout);
	}, [date, availableTimesCount]);

	const [selectedTime, setSelectedTime] = useState<string | null>(null); // STATE FOR SELECTED TIME

	// HANDLE TIME SELECT
	const handleTimeSelect = (newSelectedTime: string) => {
		setSelectedTime(newSelectedTime); // SET SELECTED TIME

		const [hours, minutes] = newSelectedTime.split(":").map(Number); // SPLIT TIME AND CONVERT TO NUMBER
		const newDate = new Date(date.toDate(timeZone));
		newDate.setHours(hours, minutes); // SET NEW DATE
		onDateTimeChange(newDate); // CALL ON DATE TIME CHANGE

		// IF SELECTED TIME IS THE SAME AS NEW SELECTED TIME, CALL ON TIME SELECT
		if (selectedTime === newSelectedTime) {
			onTimeSelect();
		}
	};

	return (
		<Tabs
			defaultValue="24"
			className="flex flex-col w-[280px] border-l border-neutral-200 dark:border-neutral-800 pl-6"
			onValueChange={(value) => setSelectedTimeFormat(value as "12" | "24")}
		>
			{/* DATE */}
			<div className="flex justify-between items-center mb-2">
				<p
					aria-hidden
					className="flex-1 align-center font-bold text-md text-neutral-900 dark:text-neutral-100"
				>
					{dayName}{" "}
					<span className="text-neutral-500 dark:text-neutral-400">
						{dayNumber} {monthName} {yearNumber}
					</span>
				</p>
			</div>

			{/* PICKER WHEEL */}
			<TabsContent value={selectedTimeFormat} className="flex-grow flex flex-col mt-10">
				{/* LOADING SKELETON */}
				{isLoading ? (
					<div className="flex flex-col items-center space-y-2">
						<Skeleton className="h-12 w-32" />
						<Skeleton className="h-12 w-36" />
						<Skeleton className="h-12 w-44 bg-red-500" />
						<Skeleton className="h-12 w-36" />
						<Skeleton className="h-12 w-32" />
					</div>
				) : (
					// PICKER WHEEL
					<PickerWheel
						key={resetKey}
						items={filteredAvailableTimes.map((time) => ({
							value: time[selectedTimeFormat],
							isFavorite: time.preferedTime,
						}))}
						onChange={handleTimeSelect}
						onItemClick={handleTimeSelect}
						initialSelectedItem={selectedTime || undefined}
					/>
				)}
			</TabsContent>
		</Tabs>
	);
}
