import * as React from "react";
import { CalendarClock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { flexibleOptionSchema, type FlexibleOptionValues } from "./schema";

interface FlexibleOptionProps {
	value: FlexibleOptionValues;
	onFlexibleOptionChange?: (values: FlexibleOptionValues) => void;
}

export function FlexibleOption({ value, onFlexibleOptionChange }: FlexibleOptionProps) {
	// INITIALIZE FORM WITH ZOD SCHEMA
	const form = useForm<FlexibleOptionValues>({
		resolver: zodResolver(flexibleOptionSchema),
		defaultValues: value,
	});

	// UPDATE FORM WHEN EXTERNAL VALUES CHANGE
	React.useEffect(() => {
		form.reset(value);
	}, [value, form]);

	// WATCH FOR CHANGES AND NOTIFY PARENT
	React.useEffect(() => {
		const subscription = form.watch((value) => {
			onFlexibleOptionChange?.(value as FlexibleOptionValues);
		});
		return () => subscription.unsubscribe();
	}, [form, form.watch, onFlexibleOptionChange]);

	return (
		<Form {...form}>
			<form>
				{/* FLEXIBLE TOGGLE */}
				<FormField
					control={form.control}
					name="isFlexible"
					render={({ field }) => (
						<FormItem className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<CalendarClock className="w-4 h-4" />
								<FormLabel className="text-sm font-medium leading-none">
									Flexible duration
								</FormLabel>
							</div>
							<FormControl>
								<Switch checked={field.value} onCheckedChange={field.onChange} />
							</FormControl>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}
