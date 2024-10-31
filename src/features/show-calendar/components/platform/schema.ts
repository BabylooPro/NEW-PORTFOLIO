import * as z from "zod";

// PHONE OPTION SCHEMA
export const phoneOptionSchema = z.object({
	phoneNumber: z.string().min(1, "Phone number is required"),
});

// PHYSICAL LOCATION SCHEMA
export const physicalLocationSchema = z.object({
	location: z.string().min(1, "Location is required"),
});

// PLATFORM SCHEMA
export const platformSchema = z.object({
	platform: z.string().default("phone"),
	phone: phoneOptionSchema.optional(),
	location: physicalLocationSchema.optional(),
	customLink: z.boolean().default(false),
	webcam: z.boolean().default(false),
	isPhysical: z.boolean().default(false),
	meetingUrl: z.string().optional(),
});

// TYPES FOR EACH OPTION
export type PhoneOptionValues = z.infer<typeof phoneOptionSchema>;
export type PhysicalLocationValues = z.infer<typeof physicalLocationSchema>;
export type PlatformValues = z.infer<typeof platformSchema>;

// DEFAULT VALUES
export const defaultPlatformValues: PlatformValues = {
	platform: "phone",
	customLink: false,
	webcam: false,
	isPhysical: false,
};

// VIRTUAL MEETING SCHEMA
export const virtualMeetingSchema = z.object({
	customLink: z.boolean().default(false),
	meetingUrl: z.string().url().optional(),
	webcam: z.boolean().default(false),
});

export type VirtualMeetingValues = z.infer<typeof virtualMeetingSchema>;
