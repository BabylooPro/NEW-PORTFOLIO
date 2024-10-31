import { z } from "zod";

// TIME PICKER SCHEMA
export const timePickerSchema = z.object({
	selectedTime: z.string().min(1, "Please select a time"),
	timeFormat: z.enum(["12", "24"]).default("24"),
});

export type TimePickerFormData = z.infer<typeof timePickerSchema>;
