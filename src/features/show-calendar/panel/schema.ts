import { z } from "zod";

// FORM SCHEMA FOR BOOKING FORM DATA
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

export type FormValues = z.infer<typeof formSchema>;
