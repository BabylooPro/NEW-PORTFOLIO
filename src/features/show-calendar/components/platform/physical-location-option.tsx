import React from "react";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { physicalLocationSchema, type PhysicalLocationValues } from "./schema";
import { useSearchParams, useRouter } from "next/navigation";

interface PhysicalLocationOptionProps {
	onLocationChange?: (values: PhysicalLocationValues) => void;
}

export function PhysicalLocationOption({ onLocationChange }: PhysicalLocationOptionProps) {
	// GET URL PARAMS
	const searchParams = useSearchParams();
	const router = useRouter();

	// INITIALIZE FORM WITH URL PARAMS
	const form = useForm<PhysicalLocationValues>({
		resolver: zodResolver(physicalLocationSchema),
		defaultValues: {
			location: searchParams.get("location") ?? "",
		},
	});

	// UPDATE URL PARAMS WHEN FORM VALUES CHANGE
	const updateUrlParams = React.useCallback(
		(values: PhysicalLocationValues) => {
			const params = new URLSearchParams(searchParams.toString());

			if (values.location) {
				params.set("location", values.location);
			} else {
				params.delete("location");
			}

			router.replace(`?${params.toString()}`);
		},
		[searchParams, router]
	);

	// WATCH FOR CHANGES AND UPDATE URL
	React.useEffect(() => {
		const subscription = form.watch((value) => {
			if (value.location) {
				updateUrlParams(value as PhysicalLocationValues);
				onLocationChange?.(value as PhysicalLocationValues);
			}
		});
		return () => subscription.unsubscribe();
	}, [form, form.watch, updateUrlParams, onLocationChange]);

	// RESTORE VALUES FROM URL PARAMS ON MOUNT
	React.useEffect(() => {
		const location = searchParams.get("location");
		if (location) {
			form.reset({ location });
		}
	}, [searchParams, form]);

	return (
		<Form {...form}>
			<form className="space-y-4">
				{/* LABEL */}
				<div className="flex items-center space-x-2">
					<MapPin className="w-4 h-4" />
					<Label className="text-sm font-medium">Physical Location</Label>
				</div>

				{/* INPUT */}
				<FormField
					control={form.control}
					name="location"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input
									{...field}
									type="text"
									placeholder="Enter meeting location"
									className="w-full bg-neutral-100 dark:bg-neutral-900"
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}
