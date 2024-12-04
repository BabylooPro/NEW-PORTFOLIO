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
import { useSearchParams, useRouter } from "next/navigation";

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
	// GET URL PARAMS
	const searchParams = useSearchParams();
	const router = useRouter();

	const isInitialMount = React.useRef(true); // CHECK IF IT'S THE FIRST MOUNT

	// UPDATE URL PARAMS WHEN PLATFORM CHANGES
	const updateUrlParams = React.useCallback(
		(newValue: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set("platform", newValue);

			// CLEAN UP RELATED PARAMS WHEN PLATFORM CHANGES
			if (newValue === "phone") {
				params.delete("customLink");
				params.delete("webcam");
				params.delete("location");
			} else if (newValue === "physical") {
				params.delete("customLink");
				params.delete("webcam");
				params.delete("phoneNumber");
			} else {
				params.delete("location");
				params.delete("phoneNumber");
			}

			router.replace(`?${params.toString()}`);
		},
		[searchParams, router]
	);

	// HANDLE PLATFORM SELECTION
	const handlePlatformSelect = (currentValue: string) => {
		const platform = platforms.find(
			(p) => p.label.toLowerCase() === currentValue.toLowerCase()
		);
		const newValue = platform?.value ?? "phone";
		onValueChange(newValue);
		updateUrlParams(newValue);
	};

	// RESTORE VALUE FROM URL PARAMS ONLY ON INITIAL MOUNT
	React.useEffect(() => {
		if (isInitialMount.current) {
			const platformFromUrl = searchParams.get("platform");
			if (platformFromUrl && platformFromUrl !== value) {
				onValueChange(platformFromUrl);
			}
			isInitialMount.current = false;
		}
	}, [searchParams, value, onValueChange]);

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
									onSelect={handlePlatformSelect}
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
