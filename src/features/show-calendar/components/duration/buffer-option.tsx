import * as React from "react";
import { ClockArrowUp } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { bufferOptionSchema, type BufferOptionValues } from "./schema";

interface BufferOptionProps {
	value: BufferOptionValues;
	onBufferOptionChange?: (values: BufferOptionValues) => void;
}

export function BufferOption({ value, onBufferOptionChange }: BufferOptionProps) {
	// INITIALIZE FORM WITH ZOD SCHEMA
	const form = useForm<BufferOptionValues>({
		resolver: zodResolver(bufferOptionSchema),
		defaultValues: value,
	});

	// UPDATE FORM WHEN EXTERNAL VALUES CHANGE
	React.useEffect(() => {
		form.reset(value);
	}, [value, form]);

	// WATCH FOR CHANGES AND NOTIFY PARENT
	React.useEffect(() => {
		const subscription = form.watch((value) => {
			onBufferOptionChange?.(value as BufferOptionValues);
		});
		return () => subscription.unsubscribe();
	}, [form, form.watch, onBufferOptionChange]);

	return (
		<Form {...form}>
			<form className="space-y-4">
				{/* BUFFER TOGGLE */}
				<FormField
					control={form.control}
					name="hasBuffer"
					render={({ field }) => (
						<FormItem className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<ClockArrowUp className="w-4 h-4" />
								<FormLabel className="text-sm font-medium leading-none">
									Add buffer time
								</FormLabel>
							</div>
							<FormControl>
								<Switch checked={field.value} onCheckedChange={field.onChange} />
							</FormControl>
						</FormItem>
					)}
				/>

				{/* BUFFER DURATION */}
				{form.watch("hasBuffer") && (
					<FormField
						control={form.control}
						name="bufferDuration"
						render={({ field }) => (
							<FormItem className="ml-6">
								<FormLabel className="text-sm font-medium mb-1 block">
									Buffer time
								</FormLabel>
								<div className="relative">
									<FormControl>
										<Input
											type="number"
											{...field}
											onChange={(e) => field.onChange(Number(e.target.value))}
											max={30}
											min={5}
											step={5}
											className="w-full pr-20 bg-neutral-100 dark:bg-neutral-900"
										/>
									</FormControl>
									<span className="absolute top-0 right-3 h-full flex items-center text-sm text-neutral-500">
										minutes
									</span>
								</div>
							</FormItem>
						)}
					/>
				)}
			</form>
		</Form>
	);
}
