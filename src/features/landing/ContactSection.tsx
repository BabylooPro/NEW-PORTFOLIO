"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Section } from "@/components/ui/section";
import {
	Form,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	FormDescription,
	FormField,
} from "@/components/ui/form";
import InfoSection from "@/components/ui/info-section";
import ProgressButton from "@/components/ui/progress-button";

// ZOD SCHEMA FOR VALIDATION
const contactSchema = z.object({
	name: z.string().min(2, { message: "Name must be at least 2 characters." }),
	email: z.string().email({ message: "Invalid email address." }),
	message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export const ContactSection = () => {
	const form = useForm<ContactFormValues>({
		resolver: zodResolver(contactSchema),
		defaultValues: {
			name: "",
			email: "",
			message: "",
		},
	});

	const onSubmit = async (data: ContactFormValues) => {
		// GENERATE RANDOM DELAY BETWEEN 1 AND 30 SECONDS
		const delay = Math.floor(Math.random() * 30000) + 1000; // GENERATE A NUMBER BETWEEN 1000MS (1S) AND 30000MS (30S)

		console.log(`Simulating email send delay: ${delay / 1000} seconds`);

		// SIMULATE EMAIL SEND DELAY
		await new Promise((resolve) => setTimeout(resolve, delay));

		// ONCE THE DELAY IS FINISHED, DISPLAY THE RESULT
		console.log("Form Submitted", data);
	};

	return (
		<Section>
			<h2 className="text-2xl font-bold flex items-center gap-2">
				Contact
				<InfoSection mode={"tooltip"} />
			</h2>
			<p className="flex items-center gap-2 text-neutral-500 mb-8">
				Please fill in the form below to get in touch.
			</p>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="">
					<div className="flex flex-col md:flex-row justify-between gap-4">
						{/* NAME FIELD */}
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormLabel className="text-neutral-900 dark:text-neutral-100">
										Name
									</FormLabel>
									<FormControl>
										<input
											{...field}
											placeholder="Your Name"
											className="input w-full border border-neutral-300 rounded-lg p-3 text-neutral-700 dark:text-neutral-300 dark:bg-neutral-700"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* EMAIL FIELD */}
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormLabel className="text-neutral-900 dark:text-neutral-100">
										Email
									</FormLabel>
									<FormControl>
										<input
											{...field}
											placeholder="Your Email"
											className="input w-full border border-neutral-300 rounded-lg p-3 text-neutral-700 dark:text-neutral-300 dark:bg-neutral-700"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* MESSAGE FIELD */}
					<FormField
						control={form.control}
						name="message"
						render={({ field }) => (
							<FormItem className="mt-6">
								<FormLabel className="text-neutral-900 dark:text-neutral-100">
									Message
								</FormLabel>
								<FormControl>
									<textarea
										{...field}
										placeholder="Your Message"
										className="textarea w-full border border-neutral-300 rounded-lg p-3 text-neutral-700 dark:text-neutral-300 dark:bg-neutral-700"
										rows={6}
									/>
								</FormControl>
								<FormDescription className="text-neutral-500 dark:text-neutral-400">
									Describe your project or inquiry in detail.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* SUBMIT BUTTON */}
					<div className="flex justify-end mt-6">
						<ProgressButton
							progressType="automatic"
							onClick={() => form.handleSubmit(onSubmit)()}
							buttonText="Send Message"
							successColorClass="green-500"
							buttonVariant="outline"
						/>
					</div>
				</form>
			</Form>
		</Section>
	);
};
