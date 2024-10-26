import { cn } from "@/lib/utils";
import {
	type CalendarDate,
	getLocalTimeZone,
	isSameMonth,
	isToday,
	today,
} from "@internationalized/date";
import { useCalendarCell } from "@react-aria/calendar";
import { useFocusRing } from "@react-aria/focus";
import { mergeProps } from "@react-aria/utils";
import type { CalendarState } from "@react-stately/calendar";
import { useRef } from "react";
import { getStatus, getStatusColor } from "@/features/show-calendar/utils/status";

interface CalendarCellProps {
	readonly state: CalendarState;
	readonly date: CalendarDate;
	readonly currentMonth: CalendarDate;
	readonly availableTimesCount: number;
}

export function CalendarCell({
	state,
	date,
	currentMonth,
	availableTimesCount,
}: CalendarCellProps) {
	const ref = useRef<HTMLDivElement>(null); // CREATE REF
	const isUnavailable = availableTimesCount === 0; // CHECK IF DATE IS UNAVAILABLE
	const isPastDate = date.compare(today(getLocalTimeZone())) < 0; // CHECK IF DATE IS IN PAST
	const {
		cellProps,
		buttonProps,
		isSelected,
		isDisabled: isDisabledByCalendar,
		formattedDate,
	} = useCalendarCell({ date, isDisabled: isUnavailable || isPastDate }, state, ref); // GET CELL PROPS
	const isDisabled = isDisabledByCalendar || isUnavailable || isPastDate; // CHECK IF DATE IS DISABLED
	const isOutsideMonth = !isSameMonth(currentMonth, date); // CHECK IF DATE IS OUTSIDE CURRENT MONTH
	const isDateToday = isToday(date, getLocalTimeZone()); // CHECK IF DATE IS TODAY
	const { focusProps, isFocusVisible } = useFocusRing(); // GET FOCUS PROPS

	// GET STATUS AND COLOR
	const status = getStatus(availableTimesCount);
	const statusColor = getStatusColor(status);

	return (
		<td
			{...cellProps}
			className={cn("py-0.5 relative px-0.5", isFocusVisible ? "z-10" : "z-0")}
		>
			{/* BUTTON DATE CONTAINER */}
			<div
				{...mergeProps(buttonProps, focusProps)}
				ref={ref}
				hidden={isOutsideMonth}
				className="size-14 outline-none group rounded-md"
			>
				{/* DATE CONTAINER */}
				<div
					className={cn(
						"size-full rounded-xl flex items-center justify-center",
						"text-neutral-900 dark:text-neutral-100 text-sm font-semibold",
						isDisabled
							? "cursor-not-allowed text-neutral-400 dark:text-neutral-600"
							: "cursor-pointer bg-neutral-200 dark:bg-neutral-800",
						isFocusVisible &&
							"ring-1 group-focus:z-2 ring-neutral-400 dark:ring-neutral-600 ring-offset-1",
						isSelected &&
							"bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900",
						!isSelected &&
							!isDisabled &&
							"hover:ring-2 hover:ring-neutral-400 dark:hover:ring-neutral-600",
						"transition-colors duration-200"
					)}
				>
					{/* FORMATTED DATE */}
					{formattedDate}

					{/* TODAY DATE */}
					{isDateToday && (
						<div
							className={cn(
								"absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-1/2 size-1.5 bg-neutral-900 dark:bg-neutral-100 rounded-full",
								isSelected && "bg-neutral-100 dark:bg-neutral-900"
							)}
						/>
					)}

					{/* STATUS */}
					{!isPastDate && (
						<div
							className={cn(
								"absolute top-0 right-0 size-3 rounded-full border-2",
								statusColor
							)}
						/>
					)}
				</div>
			</div>
		</td>
	);
}
