import React from "react";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { phoneOptionSchema, type PhoneOptionValues } from "./schema";
import { useSearchParams, useRouter } from "next/navigation";

interface PhoneOptionProps {
	onPhoneOptionChange?: (values: PhoneOptionValues) => void;
}

export function PhoneOption({ onPhoneOptionChange }: PhoneOptionProps) {
	// GET URL PARAMS
	const searchParams = useSearchParams();
	const router = useRouter();

	// INITIALIZE FORM WITH URL PARAMS
	const form = useForm<PhoneOptionValues>({
		resolver: zodResolver(phoneOptionSchema),
		defaultValues: {
			phoneNumber: searchParams.get("phoneNumber") ?? "",
		},
	});

	// UPDATE URL PARAMS WHEN FORM VALUES CHANGE
	const updateUrlParams = React.useCallback(
		(values: PhoneOptionValues) => {
			const params = new URLSearchParams(searchParams.toString());

			if (values.phoneNumber) {
				params.set("phoneNumber", values.phoneNumber);
			} else {
				params.delete("phoneNumber");
			}

			router.replace(`?${params.toString()}`);
		},
		[searchParams, router]
	);

	// WATCH FOR CHANGES AND UPDATE URL
	React.useEffect(() => {
		const subscription = form.watch((value) => {
			if (value.phoneNumber) {
				updateUrlParams(value as PhoneOptionValues);
				onPhoneOptionChange?.(value as PhoneOptionValues);
			}
		});
		return () => subscription.unsubscribe();
	}, [form, form.watch, updateUrlParams, onPhoneOptionChange]);

	// RESTORE VALUES FROM URL PARAMS ON MOUNT
	React.useEffect(() => {
		const phoneNumber = searchParams.get("phoneNumber");
		if (phoneNumber) {
			form.reset({ phoneNumber });
		}
	}, [searchParams, form]);

	return (
		<Form {...form}>
			<form className="space-y-2">
				{/* PHONE NUMBER FIELD */}
				<FormField
					control={form.control}
					name="phoneNumber"
					render={({ field }) => (
						<FormItem>
							<Label className="text-sm font-medium">Phone Number</Label>
							<FormControl>
								<PhoneInput
									{...field}
									placeholder="Enter phone number"
									defaultCountry="CH"
									value={field.value}
									onChange={(e) => field.onChange(e.target.value)}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}
