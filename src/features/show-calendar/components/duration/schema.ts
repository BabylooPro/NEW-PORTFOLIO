import * as z from "zod";

// INDIVIDUAL SCHEMAS
const durationSelectSchema = z.object({
	duration: z.string().default("15"),
});
const breakOptionSchema = z.object({
	hasBreak: z.boolean().default(false),
	breakDuration: z.number().min(5).max(30).default(5),
});
const bufferOptionSchema = z.object({
	hasBuffer: z.boolean().default(false),
	bufferDuration: z.number().min(5).max(30).default(15),
});
const delayOptionSchema = z.object({
	hasDelay: z.boolean().default(false),
	delayDuration: z.number().min(5).max(30).default(10),
});
const flexibleOptionSchema = z.object({
	isFlexible: z.boolean().default(false),
});

// COMBINED DURATION SCHEMA
export const durationSchema = z.object({
	duration: durationSelectSchema.shape.duration,
	break: breakOptionSchema,
	buffer: bufferOptionSchema,
	delay: delayOptionSchema,
	flexible: flexibleOptionSchema,
});

// EXPORT INDIVIDUAL SCHEMAS
export {
	breakOptionSchema,
	bufferOptionSchema,
	delayOptionSchema,
	flexibleOptionSchema,
	durationSelectSchema,
};

// TYPES FOR EACH OPTION
export type BreakOptionValues = z.infer<typeof breakOptionSchema>;
export type BufferOptionValues = z.infer<typeof bufferOptionSchema>;
export type DelayOptionValues = z.infer<typeof delayOptionSchema>;
export type FlexibleOptionValues = z.infer<typeof flexibleOptionSchema>;
export type DurationSelectValues = z.infer<typeof durationSelectSchema>;
export type DurationValues = z.infer<typeof durationSchema>;

// DEFAULT VALUES
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
