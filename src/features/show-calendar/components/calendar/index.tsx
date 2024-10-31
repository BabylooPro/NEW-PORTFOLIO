"use client";

import { createCalendar } from "@internationalized/date";
import { type CalendarProps, type DateValue, useCalendar } from "@react-aria/calendar";
import { useCalendarState } from "@react-stately/calendar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarGrid } from "./calendar-grid";
import { CalendarHeader } from "./calendar-header";
import { CalendarData } from "../../hooks/useCalendarData";
import { Form } from "@/components/ui/form";
import { calendarSchema, type CalendarFormData } from "./schema";

interface ExtendedCalendarProps extends CalendarProps<DateValue> {
	calendarData: CalendarData;
	onMonthChange?: (date: DateValue) => void;
	onSubmit?: (data: CalendarFormData) => void;
}

export function Calendar(props: ExtendedCalendarProps) {
	// INITIALIZE FORM
	const form = useForm<CalendarFormData>({
		resolver: zodResolver(calendarSchema),
		defaultValues: {
			selectedDate: "",
			selectedTime: "",
		},
	});

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

	// HANDLE FORM SUBMIT
	const onSubmit = (data: CalendarFormData) => {
		props.onSubmit?.(data);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div
					{...calendarProps}
					className="inline-block text-neutral-900 dark:text-neutral-100"
				>
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
						<CalendarGrid state={state} calendarData={props.calendarData} form={form} />
					</div>
				</div>
			</form>
		</Form>
	);
}
