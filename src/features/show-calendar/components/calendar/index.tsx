"use client";

import { createCalendar } from "@internationalized/date";
import { type CalendarProps, type DateValue, useCalendar } from "@react-aria/calendar";
import { useCalendarState } from "@react-stately/calendar";
import { CalendarGrid } from "./calendar-grid";
import { CalendarHeader } from "./calendar-header";
import { CalendarData } from "../../hooks/useCalendarData";

interface ExtendedCalendarProps extends CalendarProps<DateValue> {
	calendarData: CalendarData;
	onMonthChange?: (date: DateValue) => void;
}

export function Calendar(props: ExtendedCalendarProps) {
	// GET CALENDAR STATE
	const state = useCalendarState({
		...props,
		visibleDuration: { months: 1 },
		locale: "en-CH",
		createCalendar,
	});

	// GET CALENDAR PROPS
	const { calendarProps, prevButtonProps, nextButtonProps } = useCalendar(props, state);

	// HANDLE MONTH CHANGE
	const handleMonthChange = (increment: number) => {
		const newDate = state.focusedDate.add({ months: increment });
		state.setFocusedDate(newDate);
		props.onMonthChange?.(newDate);
	};

	return (
		<div {...calendarProps} className="inline-block text-neutral-900 dark:text-neutral-100">
			{/* CALENDAR HEADER */}
			<CalendarHeader
				state={state}
				calendarProps={calendarProps}
				prevButtonProps={{
					...prevButtonProps,
					onPress: () => handleMonthChange(-1),
				}}
				nextButtonProps={{
					...nextButtonProps,
					onPress: () => handleMonthChange(1),
				}}
			/>

			{/* CALENDAR BODY */}
			<div className="flex gap-8">
				<CalendarGrid state={state} calendarData={props.calendarData} />
			</div>
		</div>
	);
}
