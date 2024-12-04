import type { AriaButtonProps } from "@react-aria/button";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import type { CalendarState } from "@react-stately/calendar";
import type { DOMAttributes, FocusableElement } from "@react-types/shared";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "./calendar-button";
import { today, getLocalTimeZone } from "@internationalized/date";

// FUNCTION TO FORMAT DATE
function formatDateToEnglish(date: Date): string {
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function CalendarHeader({
	state,
	calendarProps,
	prevButtonProps,
	nextButtonProps,
}: {
	state: CalendarState;
	calendarProps: DOMAttributes<FocusableElement>;
	prevButtonProps: AriaButtonProps<"button">;
	nextButtonProps: AriaButtonProps<"button">;
}) {
	const currentDate = today(getLocalTimeZone()); // GET CURRENT DATE
	const isCurrentMonthOrFuture = state.visibleRange.start.compare(currentDate) >= 0; // CHECK IF DATE IS IN CURRENT MONTH OR FUTURE
	const formattedDate = formatDateToEnglish(state.visibleRange.start.toDate(state.timeZone)); // FORMAT DATE

	return (
		<div className="flex items-center pb-4">
			{/* VISUALLY HIDDEN */}
			<VisuallyHidden>
				<h2>{calendarProps["aria-label"]}</h2>
			</VisuallyHidden>

			{/* FORMATTED DATE */}
			<h2
				aria-hidden
				className="flex-1 align-center font-bold text-md text-neutral-900 dark:text-neutral-100"
			>
				{formattedDate}
			</h2>

			{/* PREVIOUS BUTTON */}
			<Button {...prevButtonProps} isDisabled={!isCurrentMonthOrFuture}>
				<ChevronLeftIcon className="size-4 text-neutral-900 dark:text-neutral-100" />
			</Button>

			{/* NEXT BUTTON */}
			<Button {...nextButtonProps}>
				<ChevronRightIcon className="size-4 text-neutral-900 dark:text-neutral-100" />
			</Button>
		</div>
	);
}
