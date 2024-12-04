import { z } from "zod";

// MAIN SCHEMAS
export const formSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	phone: z.string().min(10, "Phone number is required"),
	notes: z.string().optional(),
	guests: z
		.array(
			z.object({
				email: z.string().email("Invalid guest email address"),
			})
		)
		.optional()
		.default([]),
});
export const calendarSchema = z.object({
	selectedDate: z.string().min(1, "Please select a date"),
	selectedTime: z.string().optional(),
});
export const timePickerSchema = z.object({
	selectedTime: z.string().min(1, "Please select a time"),
	timeFormat: z.enum(["12", "24"]).default("24"),
});

// INDIVIDUAL SCHEMAS FOR DURATION
export const durationSelectSchema = z.object({
	duration: z.string().default("15"),
});
export const breakOptionSchema = z.object({
	hasBreak: z.boolean().default(false),
	breakDuration: z.number().min(5).max(30).default(5),
});
export const bufferOptionSchema = z.object({
	hasBuffer: z.boolean().default(false),
	bufferDuration: z.number().min(5).max(30).default(15),
});
export const delayOptionSchema = z.object({
	hasDelay: z.boolean().default(false),
	delayDuration: z.number().min(5).max(30).default(10),
});
export const flexibleOptionSchema = z.object({
	isFlexible: z.boolean().default(false),
});

// PLATFORM RELATED SCHEMAS
export const phoneOptionSchema = z.object({
	phoneNumber: z.string().min(1, "Phone number is required"),
});
export const physicalLocationSchema = z.object({
	location: z.string().min(1, "Location is required"),
});
export const virtualMeetingSchema = z.object({
	customLink: z.boolean().default(false),
	meetingUrl: z.string().url().optional(),
	webcam: z.boolean().default(false),
});

// RELATED SCHEMAS
export const durationSchema = z.object({
	duration: durationSelectSchema.shape.duration,
	break: breakOptionSchema,
	buffer: bufferOptionSchema,
	delay: delayOptionSchema,
	flexible: flexibleOptionSchema,
});
export const platformSchema = z.object({
	platform: z.string().default("phone"),
	phone: phoneOptionSchema.optional(),
	location: physicalLocationSchema.optional(),
	customLink: z.boolean().default(false),
	webcam: z.boolean().default(false),
	isPhysical: z.boolean().default(false),
	meetingUrl: z.string().optional(),
});

// DEFAULT VALUES
export const defaultTimeAndDateValues = {
	selectedTime: "",
	timeFormat: "24" as const,
	selectedDate: "",
};
export const defaultDurationValues: DurationValues = {
	duration: "15",
	break: {
		hasBreak: false,
		breakDuration: 5,
	},
	buffer: {
		hasBuffer: false,
		bufferDuration: 15,
	},
	delay: {
		hasDelay: false,
		delayDuration: 10,
	},
	flexible: {
		isFlexible: false,
	},
};
export const defaultPlatformValues: PlatformValues = {
	platform: "phone",
	customLink: false,
	webcam: false,
	isPhysical: false,
};

// COMBINED SCHEMAS
export const combinedFormSchema = z
	.object({
		// TIME AND DATE - REQUIRED FIELDS
		selectedTime: z.string().min(1, "Please select a time"),
		timeFormat: z.enum(["12", "24"]).default("24"),
		selectedDate: z.string().min(1, "Please select a date"),

		// DURATION - OPTIONAL FIELDS WITH DEFAULTS
		...durationSchema.shape,

		// PLATFORM - OPTIONAL FIELDS WITH DEFAULTS
		platform: z.string().default("phone"),
		customLink: z.boolean().default(false),
		webcam: z.boolean().default(false),
		isPhysical: z.boolean().default(false),
		meetingUrl: z.string().optional(),
		phone: phoneOptionSchema.optional(),
		location: physicalLocationSchema.optional(),
	})
	.refine((data) => {
		if (data.platform === "phone" && !data.phone?.phoneNumber) {
			return false;
		}
		if (data.platform === "physical" && !data.location?.location) {
			return false;
		}
		if (data.customLink && !data.meetingUrl) {
			return false;
		}
		return true;
	}, "Required fields missing for selected platform");

// FINAL COMBINED DATA SCHEMA
export const finalSubmissionSchema = z.object({
	// FORM DATA
	...formSchema.shape,

	// SCHEDULING DATA
	scheduling: combinedFormSchema,
});

// TYPES FROM SCHEMAS
export type FormValues = z.infer<typeof formSchema>;
export type CalendarFormData = z.infer<typeof calendarSchema>;
export type TimePickerFormData = z.infer<typeof timePickerSchema>;
export type BreakOptionValues = z.infer<typeof breakOptionSchema>;
export type BufferOptionValues = z.infer<typeof bufferOptionSchema>;
export type DelayOptionValues = z.infer<typeof delayOptionSchema>;
export type FlexibleOptionValues = z.infer<typeof flexibleOptionSchema>;
export type DurationSelectValues = z.infer<typeof durationSelectSchema>;
export type DurationValues = z.infer<typeof durationSchema>;
export type PhoneOptionValues = z.infer<typeof phoneOptionSchema>;
export type PhysicalLocationValues = z.infer<typeof physicalLocationSchema>;
export type PlatformValues = z.infer<typeof platformSchema>;
export type VirtualMeetingValues = z.infer<typeof virtualMeetingSchema>;
export type CombinedFormValues = z.infer<typeof combinedFormSchema>;
export type FinalSubmissionData = z.infer<typeof finalSubmissionSchema>;
