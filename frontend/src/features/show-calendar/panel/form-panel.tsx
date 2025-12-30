import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRightIcon, Loader2, UserPlus, X } from "lucide-react";
import { PhoneInput } from "@/components/ui/phone-input";
import * as React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, type FormValues, CombinedFormValues } from "@/features/show-calendar/utils/schema";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type ContactFormInput = FormValues;

interface FormPanelProps {
	readonly onBack: () => void;
}

export function FormPanel({ onBack }: FormPanelProps) {
	const { toast } = useToast();
	const router = useRouter(); // NAVIGATE BETWEEN PAGES
	const [isLoading, setIsLoading] = useState(false); // STATE FOR LOADING
	const searchParams = useSearchParams(); // GET URL PARAMS

	// UPDATE URL PARAMS WHEN PHONE CHANGES
	const updatePhoneUrlParam = React.useCallback(
		(phone: string) => {
			const params = new URLSearchParams(searchParams.toString());

			if (phone) {
				params.set("phoneNumber", phone);
			} else {
				params.delete("phoneNumber");
			}

			router.replace(`?${params.toString()}`);
		},
		[searchParams, router]
	);

	// INITIALIZE FORM WITH PHONE FROM URL PARAMS
	const form = useForm<ContactFormInput>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			phone: searchParams.get("phoneNumber") ?? "", // GET PHONE FROM URL PARAMS
			notes: "",
			guests: [],
		},
	});

	// SYNC FORM WITH URL PARAMS WHEN THEY CHANGE
	React.useEffect(() => {
		const phoneNumber = searchParams.get("phoneNumber");
		if (phoneNumber) {
			form.setValue("phone", phoneNumber);
		}
	}, [searchParams, form]);

	// INITIALIZE FIELD ARRAY FOR GUESTS
	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "guests",
	});

	// LOAD PRE-FILLED DATA
	React.useEffect(() => {
		const storedData = sessionStorage.getItem("preFilledFormData");
		if (storedData) {
			const { formData } = JSON.parse(storedData);
			form.reset(formData);
		}
	}, [form]);

	React.useEffect(() => {
		toast({
			title: "Demo Version - Work in Progress",
			variant: "warning",
			showIcon: true,
			description:
				"This is a demonstration of how the booking system will work. Currently, no actual appointments are being processed.",
			duration: 60000, // 60 SECONDS
		});
	}, [toast]);

	// HANDLE FORM SUBMISSION
	const onSubmit = async (formData: ContactFormInput) => {
		const parsedFormData = formSchema.parse(formData);
		setIsLoading(true);
		try {
			const storedData = sessionStorage.getItem("preFilledFormData");
			const combinedData: CombinedFormValues = storedData
				? JSON.parse(storedData).combinedData
				: {};

			const finalData = {
				formData: parsedFormData,
				combinedData,
			};

			// STORE THE DATA FOR PROCESSING
			sessionStorage.setItem("preFilledFormData", JSON.stringify(finalData));

			// REDIRECT TO PROCESSING PAGE
			router.push("/showcalendar/process");
		} catch (error) {
			console.error(error);
			router.push("/showcalendar/error");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-screen">
				{/* NAME FIELD */}
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<Label>Your name</Label>
							<FormControl>
								<Input
									placeholder="Name"
									className="bg-neutral-100 dark:bg-neutral-900"
									{...field}
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
						<FormItem>
							<Label>Email address</Label>
							<FormControl>
								<Input
									type="email"
									placeholder="exemple@email.com"
									className="bg-neutral-100 dark:bg-neutral-900"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* PHONE FIELD */}
				<FormField
					control={form.control}
					name="phone"
					render={({ field }) => (
						<FormItem>
							<Label>Phone number</Label>
							<FormControl>
								<PhoneInput
									defaultCountry="CH"
									value={field.value}
									onChange={(e) => {
										const value = e.target.value;
										field.onChange(value);
										updatePhoneUrlParam(value);
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* NOTES FIELD */}
				<FormField
					control={form.control}
					name="notes"
					render={({ field }) => (
						<FormItem>
							<Label>
								Additional notes{" "}
								<span className="text-xs text-neutral-500 dark:text-neutral-400">
									(optional)
								</span>
							</Label>
							<FormControl>
								<Textarea
									placeholder="Please share anything that will help prepare for our meeting"
									className="bg-neutral-100 dark:bg-neutral-900"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* GUESTS SECTION */}
				{fields.length > 0 && (
					<div className="space-y-4">
						<Label>Add guests</Label>
						{fields.map((field, index) => (
							<div key={field.id} className="flex items-center space-x-2 relative">
								<FormField
									control={form.control}
									name={`guests.${index}.email`}
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormControl>
												<Input
													placeholder="guest@email.com"
													className="bg-neutral-100 dark:bg-neutral-900"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<X
									className="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 size-4 text-neutral-500 dark:text-neutral-400"
									onClick={() => remove(index)}
								/>
							</div>
						))}
					</div>
				)}

				{/* ADD GUEST BUTTON */}
				<Button
					type="button"
					variant="ghost"
					onClick={() => append({ email: "" })}
					className="w-fit"
				>
					<UserPlus className="mr-2 size-4" />
					Add guests
				</Button>

				{/* TERMS AND PRIVACY */}
				<p className="text-neutral-500 dark:text-neutral-400 text-xs my-4">
					By proceeding, you agree to our <span className="font-bold">Terms</span> and{" "}
					<span className="font-bold">Privacy Policy</span>.
				</p>

				{/* ACTIONS */}
				<div className="flex justify-end gap-2">
					<Button variant="ghost" onClick={onBack} disabled={isLoading}>
						Back
					</Button>
					<Button
						type="submit"
						variant={["default", "expandIcon"]}
						Icon={<ArrowRightIcon className="size-4" />}
						iconPlacement="right"
						disabled={isLoading}
					>
						{isLoading ? <Loader2 className="size-4 animate-spin" /> : "Continue"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
