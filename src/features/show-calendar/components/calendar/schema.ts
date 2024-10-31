import { z } from "zod";

// DEFINE CALENDAR SCHEMA
export const calendarSchema = z.object({
	selectedDate: z.string().min(1, "Please select a date"),
	selectedTime: z.string().optional(),
});

// DEFINE TYPESCRIPT TYPE FROM SCHEMA
export type CalendarFormData = z.infer<typeof calendarSchema>;
