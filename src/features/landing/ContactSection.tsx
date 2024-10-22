"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Section } from "@/components/ui/section";
import { ShowInfo } from "@/components/ui/show-info";
import ProgressButton from "@/components/ui/progress-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, Send } from "lucide-react";
import {
	Form,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	FormDescription,
	FormField,
} from "@/components/ui/form";
import { ClipboardButton } from "@/components/ui/clipboard-button";

// ZOD SCHEMA FOR VALIDATION
const contactSchema = z.object({
	name: z.string().min(2, { message: "Name must be at least 2 characters." }),
	email: z.string().email({ message: "Invalid email address." }),
	message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const ContactSection: React.FC = () => {
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [progress, setProgress] = useState(0);
	const [hasError, setHasError] = useState(false);
	const [hasTemporaryError, setHasTemporaryError] = useState(false);
	const developerContact = "Please contact me at 'maxremy.dev@gmail.com'";

	const form = useForm<ContactFormValues>({
		resolver: zodResolver(contactSchema),
		defaultValues: {
			name: "",
			email: "",
			message: "",
		},
		mode: "onChange",
	});

	useEffect(() => {
		if (form.formState.isValid) {
			setHasError(false); // REMOVE ERROR WHEN FORM IS VALID
		}
	}, [form.formState.isValid]);

	const onSubmit = useCallback(
		async (data: ContactFormValues) => {
			setIsSubmitting(true); // START SUBMITTING
			setProgress(20); // START PROGRESS
			setHasError(false);
			setHasTemporaryError(false);

			try {
				const response = await fetch("/api/contact", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				});

				const result = await response.json();

				if (!response.ok) {
					setProgress(0);
					if (response.status === 403) {
						setHasError(true);
						toast({
							title: "Error: Email Domain Not Verified",
							description: developerContact,
							variant: "destructive",
						});
					} else {
						setHasTemporaryError(true);
						toast({
							title: "Error: Failed to send your message",
							description: result.message || developerContact,
							variant: "destructive",
						});
					}
				} else if (result.success) {
					setProgress(100); // COMPLETE PROGRESS
					toast({
						title: "Success",
						description: "Your message has been sent successfully.",
					});
					form.reset(); // RESET FORM AFTER SUCCESSFUL SUBMISSION
				} else {
					setProgress(0); // RESET PROGRESS IN CASE OF ERROR
					setHasTemporaryError(true);
					toast({
						title: "Error: An unexpected error occurred",
						description: result.message || developerContact,
						variant: "destructive",
					});
				}
			} catch (error) {
				console.error("Fetch error:", error);
				setProgress(0); // RESET PROGRESS IN CASE OF ERROR
				setHasTemporaryError(true);
				toast({
					title: "Error: An unexpected error occurred",
					description: developerContact,
					variant: "destructive",
				});
			} finally {
				setIsSubmitting(false);
			}
		},
		[toast, form]
	);

	const handleButtonClick = useCallback(() => {
		if (form.formState.isValid) {
			setHasError(false); // NO VALIDATION ERROR
			setHasTemporaryError(false);
			toast({
				title: "Sending message",
				description: "Your message is being sent...",
			});
			form.handleSubmit(onSubmit)(); // LAUNCH SUBMISSION
		} else {
			setHasError(true); // MARK VALIDATION ERROR
			form.trigger(); // TRIGGER MANUAL VALIDATION
			toast({
				title: "Validation Error",
				description: "Please fill in all the fields correctly.",
				variant: "destructive",
			});
		}
	}, [form, onSubmit, toast]);

	return (
		<Section>
			<h2 className="text-2xl font-bold flex items-center justify-between">
				<div className="flex flex-row gap-2">
					Contact me
					<ShowInfo
						title={"Contact"}
						description={
							"If you contact me, I will get back to you as soon as possible."
						}
					/>
				</div>
				<div className="flex flex-row gap-2">
					<ShowInfo wrapMode disableToast>
						<ShowInfo.Title>
							Email: <span className="font-extralight">maxremy.dev@gmail.com</span>
						</ShowInfo.Title>
						<ShowInfo.Description>Click to copy my email address</ShowInfo.Description>
						<ShowInfo.Content>
							<ClipboardButton
								text="maxremy.dev@gmail.com"
								title="my email address"
								variant="none"
								CopyIcon={Mail}
								iconOnly
								size="icon"
							/>
						</ShowInfo.Content>
					</ShowInfo>
					<ShowInfo wrapMode disableToast>
						<ShowInfo.Title>
							Phone: <span className="font-extralight">+41 79 873 06 05</span>
						</ShowInfo.Title>
						<ShowInfo.Description>Click to copy my phone number</ShowInfo.Description>
						<ShowInfo.Content>
							<ClipboardButton
								text="+41 79 873 06 05"
								title="my phone number"
								variant="none"
								CopyIcon={Phone}
								iconOnly
								size="icon"
							/>
						</ShowInfo.Content>
					</ShowInfo>
				</div>
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
										<Input
											{...field}
											placeholder="Your Name"
											className="w-full"
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
										<Input
											{...field}
											placeholder="Your Email"
											className="w-full"
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
									<Textarea {...field} placeholder="Your Message" rows={10} />
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
							progressType="manual"
							progress={progress}
							onClick={handleButtonClick}
							icon={Send}
							buttonText="Send Message"
							successColorClass="green-500"
							buttonVariant={["outline", "ringHover"]}
							disabled={isSubmitting}
							hasError={hasError}
							hasTemporaryError={hasTemporaryError}
						/>
					</div>
				</form>
			</Form>
		</Section>
	);
};

export default ContactSection;
