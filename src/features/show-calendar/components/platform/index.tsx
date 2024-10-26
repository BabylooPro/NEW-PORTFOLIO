"use client";

import * as React from "react";
import { Presentation } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlatformSelector } from "./platform-selector";
import { PhoneOption } from "./phone-option";
import { VirtualMeetingOptions } from "./virtual-meeting-options";
import { PhysicalLocationOption } from "./physical-location-option";
import { platforms } from "./constants";
import { Label } from "@/components/ui/label";

interface PlatformProps {
	readonly onPlatformChange: (platform: string) => void;
}

export function Platform({ onPlatformChange }: PlatformProps) {
	const [open, setOpen] = React.useState(false); // STATE FOR POPOVER
	const [value, setValue] = React.useState("phone"); // STATE FOR SELECTED PLATFORM
	const [isCustomLinkChecked, setIsCustomLinkChecked] = React.useState(false); // STATE FOR CUSTOM LINK CHECKBOX
	const [isPhysicalLocationChecked, setIsPhysicalLocationChecked] = React.useState(false); // STATE FOR PHYSICAL LOCATION CHECKBOX
	const [isWebcamEnabled, setIsWebcamEnabled] = React.useState(false); // STATE FOR WEBCAM CHECKBOX

	// FUNCTION TO UPDATE SELECTED PLATFORM
	const updateSelectedPlatform = (newValue: string) => {
		const platform = platforms.find((p: { value: string }) => p.value === newValue); // FIND PLATFORM
		onPlatformChange(platform?.label ?? "Phone call"); // UPDATE SELECTED PLATFORM
		setValue(newValue); // UPDATE SELECTED PLATFORM
		setIsPhysicalLocationChecked(newValue === "physical"); // UPDATE PHYSICAL LOCATION CHECKBOX
		setOpen(false); // CLOSE POPOVER
	};

	return (
		<Card className="w-[420px] bg-transparent border-none shadow-none">
			{/* CARD HEADER */}
			<CardHeader>
				<CardTitle className="text-lg font-semibold flex items-center gap-2">
					<Presentation className="w-5 h-5" />
					Meeting Platform
				</CardTitle>
			</CardHeader>

			{/* CARD CONTENT */}
			<CardContent className="space-y-6">
				<div className="space-y-2">
					<Label htmlFor="platform-selector" className="text-sm font-medium">
						Select Platform
					</Label>
					<PlatformSelector
						id="platform-selector"
						value={value}
						onValueChange={updateSelectedPlatform}
						onOpenChange={setOpen}
						open={open}
					/>
				</div>

				{/* PHONE OPTION */}
				{value === "phone" && <PhoneOption />}

				{/* VIRTUAL MEETING OPTIONS */}
				{!isPhysicalLocationChecked && value !== "phone" && (
					<VirtualMeetingOptions
						isCustomLinkChecked={isCustomLinkChecked}
						setIsCustomLinkChecked={setIsCustomLinkChecked}
						isWebcamEnabled={isWebcamEnabled}
						setIsWebcamEnabled={setIsWebcamEnabled}
						isOtherPlatform={value === "other"}
					/>
				)}

				{/* PHYSICAL LOCATION OPTION */}
				{isPhysicalLocationChecked && <PhysicalLocationOption />}
			</CardContent>
		</Card>
	);
}
