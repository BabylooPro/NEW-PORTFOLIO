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

const durations = Array.from({ length: 32 }, (_, i) => {
	const minutes = (i + 1) * 15; // CALCULATE MINUTES
	const hours = Math.floor(minutes / 60); // CALCULATE HOURS
	const remainingMinutes = minutes % 60; // CALCULATE REMAINING MINUTES
	const label = `${hours.toString().padStart(2, "0")}:${remainingMinutes
		.toString()
		.padStart(2, "0")}`; // FORMAT LABEL
	return {
		value: minutes.toString(), // VALUE
		label, // LABEL
	};
});

export function DurationSelect({
	value,
	setValue,
}: {
	value: string;
	setValue: (value: string) => void;
}) {
	const [open, setOpen] = React.useState(false); // STATE FOR POPOVER

	return (
		<div className="space-y-2">
			{/* LABEL */}
			<label htmlFor="duration-select" className="text-sm font-medium">
				Select duration
			</label>

			{/* POPOVER TRIGGER */}
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						id="duration-select"
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-full justify-between bg-neutral-100 dark:bg-neutral-900"
					>
						{/* DURATION LABEL */}
						{durations.find((duration) => duration.value === value)?.label ?? "00:15"}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>

				{/* POPOVER CONTENT WITH COMMAND */}
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
										onSelect={(currentValue) => {
											setValue(
												durations.find((d) => d.label === currentValue)
													?.value ?? "15"
											);
											setOpen(false);
										}}
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												value === duration.value
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
		</div>
	);
}
