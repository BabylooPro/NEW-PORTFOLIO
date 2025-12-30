import React from "react";
import { Link, Webcam } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
	virtualMeetingSchema,
	type VirtualMeetingValues,
} from "@/features/show-calendar/utils/schema";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { z } from "zod";

type VirtualMeetingFormValues = z.input<typeof virtualMeetingSchema>;

interface VirtualMeetingOptionsProps {
	isCustomLinkChecked: boolean;
	setIsCustomLinkChecked: (checked: boolean) => void;
	isWebcamEnabled: boolean;
	setIsWebcamEnabled: (enabled: boolean) => void;
	isOtherPlatform: boolean;
	onVirtualMeetingChange?: (values: VirtualMeetingValues) => void;
}

export function VirtualMeetingOptions({
	isCustomLinkChecked,
	setIsCustomLinkChecked,
	isWebcamEnabled,
	setIsWebcamEnabled,
	isOtherPlatform,
	onVirtualMeetingChange,
}: VirtualMeetingOptionsProps) {
	// GET URL PARAMS
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	// INITIALIZE FORM WITH URL PARAMS AND PROPS
	const form = useForm<VirtualMeetingFormValues, undefined, VirtualMeetingValues>({
		resolver: zodResolver(virtualMeetingSchema),
		defaultValues: {
			customLink: isCustomLinkChecked,
			meetingUrl: searchParams.get("meetingUrl") ?? "",
			webcam: isWebcamEnabled,
		},
	});

	// UPDATE URL PARAMS WHEN FORM VALUES CHANGE
	const updateUrlParams = React.useCallback(
		(values: VirtualMeetingValues) => {
			const params = new URLSearchParams(searchParams.toString());

			// UPDATE CUSTOM LINK PARAMS
			if (values.customLink) {
				params.set("customLink", "true");
			} else {
				params.delete("customLink");
			}

			// UPDATE MEETING URL PARAM ONLY IF CUSTOMLINK IS TRUE
			if (values.customLink && values.meetingUrl) {
				params.set("meetingUrl", values.meetingUrl);
			} else {
				params.delete("meetingUrl");
			}

			// UPDATE WEBCAM PARAM
			if (values.webcam) {
				params.set("webcam", "true");
			} else {
				params.delete("webcam");
			}

			router.replace(`${pathname}?${params.toString()}`);
		},
		[searchParams, router, pathname]
	);

	// WATCH FOR CHANGES AND UPDATE URL AND PARENT STATE
	React.useEffect(() => {
		const subscription = form.watch((value) => {
			if (value) {
				const normalizedValues: VirtualMeetingValues = {
					customLink: value.customLink ?? false,
					meetingUrl: value.meetingUrl,
					webcam: value.webcam ?? false,
				};

				updateUrlParams(normalizedValues);
				onVirtualMeetingChange?.(normalizedValues);

				// UPDATE PARENT STATE
				setIsCustomLinkChecked(normalizedValues.customLink);
				setIsWebcamEnabled(normalizedValues.webcam);
			}
		});
		return () => subscription.unsubscribe();
	}, [form, updateUrlParams, onVirtualMeetingChange, setIsCustomLinkChecked, setIsWebcamEnabled]);

	// SYNC FORM WITH PROPS WHEN THEY CHANGE
	React.useEffect(() => {
		form.setValue("customLink", isCustomLinkChecked);
		form.setValue("webcam", isWebcamEnabled);
	}, [form, isCustomLinkChecked, isWebcamEnabled]);

	return (
		<Form {...form}>
			<form className="space-y-6">
				{/* VIRTUAL MEETING OPTIONS */}
				{isOtherPlatform ? (
					<div className="space-y-2">
						<Label className="text-sm font-medium mb-1 block">
							Custom Meeting Link
						</Label>
						<FormField
							control={form.control}
							name="meetingUrl"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											{...field}
											type="url"
											placeholder="https://..."
											className="w-full bg-neutral-100 dark:bg-neutral-900"
											onChange={(e) => {
												field.onChange(e);
												// SET CUSTOMLINK TO TRUE WHEN USER STARTS TYPING
												if (
													e.target.value &&
													!form.getValues("customLink")
												) {
													form.setValue("customLink", true);
												}
												// SET CUSTOMLINK TO FALSE WHEN INPUT IS EMPTY
												if (!e.target.value) {
													form.setValue("customLink", false);
												}
											}}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
				) : (
					<>
						{/* CUSTOM LINK */}
						<FormField
							control={form.control}
							name="customLink"
							render={({ field }) => (
								<FormItem className="flex items-center justify-between mb-2">
									<div className="flex items-center space-x-2">
										<Link className="w-4 h-4" />
										<Label
											htmlFor="custom-link"
											className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
										>
											Use Custom Link
										</Label>
									</div>
									<FormControl>
										<Switch
											id="custom-link"
											checked={field.value ?? false}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						{/* CUSTOM LINK INPUT */}
						{(form.watch("customLink") ?? false) && (
							<FormField
								control={form.control}
								name="meetingUrl"
								render={({ field }) => (
									<FormItem className="ml-6 mb-4">
										<Label className="text-sm font-medium mb-1 block">
											Custom Meeting Link
										</Label>
										<FormControl>
											<Input
												{...field}
												type="url"
												placeholder="https://..."
												className="w-full bg-neutral-100 dark:bg-neutral-900"
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						)}
					</>
				)}

				{/* ENABLE/DISABLE WEBCAM */}
				<FormField
					control={form.control}
					name="webcam"
					render={({ field }) => (
						<FormItem className="flex items-center space-x-2 justify-between">
							<div className="flex items-center space-x-2">
								<Webcam className="w-4 h-4" />
								<Label
									htmlFor="webcam"
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								>
									Webcam
								</Label>
							</div>
							<FormControl>
								<Checkbox
									id="webcam"
									checked={field.value ?? false}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}
