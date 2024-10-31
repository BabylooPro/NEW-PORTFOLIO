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
import { useSearchParams, useRouter } from "next/navigation";
import type {
	PlatformValues,
	PhoneOptionValues,
	PhysicalLocationValues,
	VirtualMeetingValues,
} from "@/features/show-calendar/utils/schema";

interface PlatformProps {
	readonly onPlatformChange: (platform: string, data?: Partial<PlatformValues>) => void;
}

export function Platform({ onPlatformChange }: PlatformProps) {
	// GET URL PARAMS
	const searchParams = useSearchParams();
	const router = useRouter();

	// INITIALIZE STATES WITH URL PARAMS
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState(searchParams.get("platform") ?? "phone");
	const [isCustomLinkChecked, setIsCustomLinkChecked] = React.useState(
		searchParams.get("customLink") === "true"
	);
	const [isPhysicalLocationChecked, setIsPhysicalLocationChecked] = React.useState(
		searchParams.get("isPhysical") === "true"
	);
	const [isWebcamEnabled, setIsWebcamEnabled] = React.useState(
		searchParams.get("isWebcam") === "true"
	);

	// UPDATE URL PARAMS
	const updateUrlParams = React.useCallback(
		(updates: Partial<PlatformValues>) => {
			const params = new URLSearchParams(searchParams.toString());

			// UPDATE PLATFORM
			if (updates.platform) {
				params.set("platform", updates.platform);
			}

			// UPDATE WEBCAM
			if (updates.webcam !== undefined) {
				if (updates.webcam) {
					params.set("isWebcam", "true");
				} else {
					params.delete("isWebcam");
				}
			}

			// UPDATE CUSTOM LINK AND MEETING URL
			if (updates.customLink !== undefined) {
				if (updates.customLink) {
					params.set("customLink", "true");
					if (updates.meetingUrl) {
						params.set("meetingUrl", updates.meetingUrl);
					}
				} else {
					params.delete("customLink");
					params.delete("meetingUrl");
				}
			}

			// UPDATE PHONE NUMBER
			if (updates.phone?.phoneNumber) {
				params.set("phoneNumber", updates.phone.phoneNumber);
			}

			// UPDATE PHYSICAL LOCATION
			if (updates.location?.location) {
				params.set("location", updates.location.location);
			}

			// CLEAN UP PARAMS BASED ON PLATFORM TYPE
			if (updates.platform === "phone") {
				params.delete("customLink");
				params.delete("isWebcam");
				params.delete("location");
				params.delete("meetingUrl");
			} else if (updates.platform === "physical") {
				params.delete("customLink");
				params.delete("isWebcam");
				params.delete("phoneNumber");
				params.delete("meetingUrl");
			} else {
				params.delete("location");
				params.delete("phoneNumber");
			}

			router.replace(`?${params.toString()}`);
		},
		[searchParams, router]
	);

	// HANDLE PHONE OPTION CHANGE
	const handlePhoneOptionChange = (values: PhoneOptionValues) => {
		const platformData: Partial<PlatformValues> = {
			platform: "phone",
			phone: values,
		};
		onPlatformChange("Phone call", platformData);
		updateUrlParams(platformData);
	};

	// HANDLE PHYSICAL LOCATION CHANGE
	const handleLocationChange = (values: PhysicalLocationValues) => {
		const platformData: Partial<PlatformValues> = {
			platform: "physical",
			location: values,
			isPhysical: true,
		};
		onPlatformChange("Physical Location", platformData);
		updateUrlParams(platformData);
	};

	// HANDLE VIRTUAL MEETING CHANGE
	const handleVirtualMeetingChange = (values: VirtualMeetingValues) => {
		const platformData: Partial<PlatformValues> = {
			platform: value,
			customLink: values.customLink,
			webcam: values.webcam,
			meetingUrl: values.meetingUrl,
		};
		const platform = platforms.find((p) => p.value === value);
		onPlatformChange(platform?.label ?? "Other", platformData);
		updateUrlParams(platformData);
	};

	// FUNCTION TO UPDATE SELECTED PLATFORM
	const updateSelectedPlatform = (newValue: string) => {
		const platform = platforms.find((p) => p.value === newValue);
		setValue(newValue);
		setIsPhysicalLocationChecked(newValue === "physical");
		setOpen(false);

		const platformData: Partial<PlatformValues> = {
			platform: newValue,
			isPhysical: newValue === "physical",
		};
		onPlatformChange(platform?.label ?? "Phone call", platformData);
		updateUrlParams(platformData);
	};

	// RESTORE VALUES FROM URL PARAMS ON MOUNT
	React.useEffect(() => {
		const platformFromUrl = searchParams.get("platform");
		if (platformFromUrl) {
			const platform = platforms.find((p) => p.value === platformFromUrl);
			if (platform) {
				setValue(platformFromUrl);
				const platformData: Partial<PlatformValues> = {
					platform: platformFromUrl,
					customLink: searchParams.get("customLink") === "true",
					webcam: searchParams.get("webcam") === "true",
					isPhysical: platformFromUrl === "physical",
					meetingUrl: searchParams.get("meetingUrl") || undefined,
					phone: searchParams.get("phoneNumber")
						? { phoneNumber: searchParams.get("phoneNumber")! }
						: undefined,
					location: searchParams.get("location")
						? { location: searchParams.get("location")! }
						: undefined,
				};
				onPlatformChange(platform.label, platformData);
				setIsPhysicalLocationChecked(platformFromUrl === "physical");
			}
		}
	}, [searchParams, onPlatformChange]);

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
				{value === "phone" && <PhoneOption onPhoneOptionChange={handlePhoneOptionChange} />}

				{/* VIRTUAL MEETING OPTIONS */}
				{!isPhysicalLocationChecked && value !== "phone" && (
					<VirtualMeetingOptions
						isCustomLinkChecked={isCustomLinkChecked}
						setIsCustomLinkChecked={setIsCustomLinkChecked}
						isWebcamEnabled={isWebcamEnabled}
						setIsWebcamEnabled={setIsWebcamEnabled}
						isOtherPlatform={value === "other"}
						onVirtualMeetingChange={handleVirtualMeetingChange}
					/>
				)}

				{/* PHYSICAL LOCATION OPTION */}
				{isPhysicalLocationChecked && (
					<PhysicalLocationOption onLocationChange={handleLocationChange} />
				)}
			</CardContent>
		</Card>
	);
}
