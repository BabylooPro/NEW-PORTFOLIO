import { type DateDuration, endOfMonth, getWeeksInMonth } from "@internationalized/date";
import { useCalendarGrid } from "@react-aria/calendar";
import type { CalendarState } from "@react-stately/calendar";
import { CalendarCell } from "./calendar-cell";
import { CalendarData } from "../../hooks/useCalendarData";
import { UseFormReturn } from "react-hook-form";
import { CalendarFormData } from "./schema";

interface CalendarGridProps {
	state: CalendarState;
	offset?: DateDuration;
	calendarData: CalendarData;
	form: UseFormReturn<CalendarFormData>;
}

export function CalendarGrid({ state, offset = {}, calendarData, form }: CalendarGridProps) {
	const startDate = state.visibleRange.start.add(offset); // GET START DATE
	const endDate = endOfMonth(startDate); // GET END DATE

	// GET GRID PROPS AND HEADER PROPS
	const { gridProps, headerProps } = useCalendarGrid(
		{
			startDate,
			endDate,
			weekdayStyle: "short",
		},
		state
	);

	// GET NUMBER OF WEEKS IN MONTH SO WE CAN RENDER PROPER NUMBER OF ROWS
	const weeksInMonth = getWeeksInMonth(startDate, "en-CH");

	// DEFINE WEEKDAYS
	const englishWeekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

	return (
		<table {...gridProps} cellPadding="0" className="flex-1">
			{/* HEADER */}
			<thead {...headerProps}>
				<tr>
					{/* LOOP THROUGH WEEKDAYS */}
					{englishWeekDays.map((day, index) => (
						<th
							key={index}
							className="uppercase text-xs text-neutral-500 dark:text-neutral-400 pb-4"
						>
							{day}
						</th>
					))}
				</tr>
			</thead>

			{/* BODY */}
			<tbody>
				{/* LOOP THROUGH NUMBER OF WEEKS IN MONTH */}
				{Array.from({ length: weeksInMonth }).map((_, weekIndex) => (
					<tr key={weekIndex}>
						{/* LOOP THROUGH DATES IN WEEK */}
						{state.getDatesInWeek(weekIndex, startDate).map((date, index) => {
							// IF DATE IS EMPTY, RETURN AN EMPTY CELL
							if (!date) {
								return <td key={index} />;
							}

							return (
								<CalendarCell
									key={index}
									state={state}
									date={date}
									currentMonth={startDate}
									availableTimesCount={calendarData[date.toString()] || 0}
									form={form}
								/>
							);
						})}
					</tr>
				))}
			</tbody>
		</table>
	);
}
