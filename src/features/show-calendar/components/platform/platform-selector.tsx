"use client";

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
import { platforms } from "./constants";

interface PlatformSelectorProps {
	id?: string;
	value: string;
	onValueChange: (value: string) => void;
	onOpenChange: (open: boolean) => void;
	open: boolean;
}

export function PlatformSelector({
	id,
	value,
	onValueChange,
	onOpenChange,
	open,
}: PlatformSelectorProps) {
	return (
		<Popover open={open} onOpenChange={onOpenChange}>
			{/* POPOVER TRIGGER */}
			<PopoverTrigger asChild>
				<Button
					id={id}
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between bg-neutral-100 dark:bg-neutral-900"
				>
					{(() => {
						const platform = platforms.find((p) => p.value === value); // FIND PLATFORM FROM VALUE
						const Icon = platform?.icon;
						return (
							<div className="flex items-center gap-2">
								{Icon && (
									<Icon className="mr-2 h-4 w-4 text-neutral-600 dark:text-neutral-400" />
								)}
								{platform?.label ?? "Phone call"}
							</div>
						);
					})()}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>

			{/* POPOVER CONTENT */}
			<PopoverContent className="w-full p-0">
				<Command>
					<CommandInput placeholder="Search platform..." />
					<CommandList>
						<CommandEmpty>No platform found.</CommandEmpty>
						<CommandGroup>
							{platforms.map((platform) => (
								<CommandItem
									key={platform.value}
									value={platform.label}
									onSelect={(currentValue) => {
										onValueChange(
											platforms.find(
												(p) =>
													p.label.toLowerCase() ===
													currentValue.toLowerCase()
											)?.value ?? "phone"
										);
									}}
								>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											value === platform.value ? "opacity-100" : "opacity-0"
										)}
									/>
									{platform.icon && (
										<platform.icon className="mr-2 h-4 w-4 text-neutral-600 dark:text-neutral-400" />
									)}
									{platform.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
