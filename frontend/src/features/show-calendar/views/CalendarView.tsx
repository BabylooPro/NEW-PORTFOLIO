import { Calendar } from "../components/calendar";
import { DateValue, CalendarDate } from "@internationalized/date";
import { CalendarData } from "../hooks/useCalendarData";

interface CalendarViewProps {
	readonly date: DateValue;
	readonly focusedDate: CalendarDate | null;
	readonly onChange: (date: DateValue) => void;
	readonly onFocusChange: (date: CalendarDate | null) => void;
	readonly calendarData: CalendarData;
}

export function CalendarView({
	date,
	focusedDate,
	onChange,
	onFocusChange,
	calendarData,
}: CalendarViewProps) {
	return (
		<Calendar
			aria-label="Appointment date"
			value={date}
			onChange={onChange}
			focusedValue={focusedDate || undefined}
			onFocusChange={onFocusChange}
			calendarData={calendarData}
		/>
	);
}
