import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { durationSelectSchema, type DurationSelectValues } from "@/features/show-calendar/utils/schema";
import { z } from "zod";

// GENERATE DURATIONS ARRAY
const durations = Array.from({ length: 32 }, (_, i) => {
	const minutes = (i + 1) * 15;
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;
	const label = `${hours.toString().padStart(2, "0")}:${remainingMinutes
		.toString()
		.padStart(2, "0")}`;
	return {
		value: minutes.toString(),
		label,
	};
});

type DurationSelectFormValues = z.input<typeof durationSelectSchema>;

interface DurationSelectProps {
	value: string;
	setValue: (value: string) => void;
}

export function DurationSelect({ value, setValue }: DurationSelectProps) {
	const [open, setOpen] = React.useState(false);

	// INITIALIZE FORM WITH ZOD SCHEMA
	const form = useForm<DurationSelectFormValues, undefined, DurationSelectValues>({
		resolver: zodResolver(durationSelectSchema),
		defaultValues: {
			duration: value,
		},
	});

	// UPDATE PARENT WHEN FORM VALUE CHANGES
	React.useEffect(() => {
		const subscription = form.watch((values) => {
			if (values.duration) {
				setValue(values.duration);
			}
		});
		return () => subscription.unsubscribe();
	}, [form, setValue]);

	return (
		<Form {...form}>
			<form>
				{/* DURATION SELECT */}
				<FormField
					control={form.control}
					name="duration"
					render={({ field }) => (
						<FormItem className="space-y-2">
							<FormLabel className="text-sm font-medium">Select duration</FormLabel>
							<Popover open={open} onOpenChange={setOpen}>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant="outline"
											role="combobox"
											aria-expanded={open}
											className="w-full justify-between bg-neutral-100 dark:bg-neutral-900"
										>
											{durations.find(
												(duration) => duration.value === field.value
											)?.label ?? "00:15"}
											<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>

								{/* DURATION OPTIONS */}
								<PopoverContent className="w-full p-0">
									<Command>
										<CommandInput placeholder="Search duration..." />
										<CommandList>
											<CommandEmpty>No duration found.</CommandEmpty>
											<CommandGroup>
												{durations.map((duration) => (
													<CommandItem
														key={duration.value}
														value={duration.label}
														onSelect={() => {
															form.setValue(
																"duration",
																duration.value
															);
															setOpen(false);
														}}
													>
														<Check
															className={cn(
																"mr-2 h-4 w-4",
																field.value === duration.value
																	? "opacity-100"
																	: "opacity-0"
															)}
														/>
														{duration.label}
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}
