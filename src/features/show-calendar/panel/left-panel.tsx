import { ChevronLeft, ChevronRight, Clock4, Phone, MapPin, Monitor } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { FaDiscord, FaMicrosoft } from "react-icons/fa";
import { SiGooglemeet, SiZoom } from "react-icons/si";
import { useState, useEffect } from "react";

function formatDuration(minutes: number): string {
	const hours = Math.floor(minutes / 60); // GET HOURS
	const remainingMinutes = minutes % 60; // GET REMAINING MINUTES

	// FORMAT DURATION
	if (hours === 0) {
		return `${minutes} mins`; // IF NO HOURS, RETURN MINUTES
	} else if (remainingMinutes === 0) {
		return `${hours}h`; // IF NO MINUTES, RETURN HOURS
	} else {
		return `${hours}h ${remainingMinutes} mins`; // RETURN HOURS AND MINUTES
	}
}

// MAP PLATFORMS TO THEIR ICONS
const platformIcons = {
	"Phone call": Phone,
	"Microsoft Teams": FaMicrosoft,
	"Google Meet": SiGooglemeet,
	Zoom: SiZoom,
	Discord: FaDiscord,
	Other: Monitor,
	"Physical Location": MapPin,
};

export function LeftPanel({
	showForm,
	currentView,
	onViewChange,
	selectedPlatform,
	selectedDateTime,
}: {
	showForm: boolean;
	currentView: string;
	onViewChange: (view: string) => void;
	selectedPlatform: string;
	selectedDateTime: Date;
}) {
	const [selectedDuration, setSelectedDuration] = useState("15"); // STATE FOR SELECTED DURATION

	// EFFECT TO LISTEN FOR CHANGES IN DURATION
	useEffect(() => {
		const handleDurationChange = (event: CustomEvent) => {
			setSelectedDuration(event.detail.duration); // UPDATE SELECTED DURATION
		};
		window.addEventListener("durationChanged", handleDurationChange as EventListener); // ADD EVENT LISTENER
		return () => {
			window.removeEventListener("durationChanged", handleDurationChange as EventListener); // REMOVE EVENT LISTENER
		};
	}, []);

	// CAPITALIZE FIRST LETTER OF CURRENT VIEW
	const capitalizedView = currentView.charAt(0).toUpperCase() + currentView.slice(1);

	// GET PLATFORM ICON
	const PlatformIcon = platformIcons[selectedPlatform as keyof typeof platformIcons] || Monitor;

	return (
		<div className="flex flex-col gap-4 w-[280px] border-r border-neutral-200 dark:border-neutral-800 pr-6">
			{/* LEFT PANEL CONTENT */}
			<div className="grid gap-3">
				{/* TITLE */}
				<p className="text-neutral-900 dark:text-neutral-100 text-2xl font-bold">
					{capitalizedView}
				</p>

				{/* DATE AND TIME */}
				<div className="flex text-neutral-900 dark:text-neutral-100">
					<div className="flex flex-col text-sm font-semibold">
						{/* DATE */}
						<p>
							{selectedDateTime.toLocaleDateString("en-CH", {
								weekday: "long",
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</p>

						{/* TIME */}
						<p>
							{selectedDateTime.toLocaleTimeString("en-CH", {
								hour: "numeric",
								minute: "numeric",
							})}
						</p>
					</div>
				</div>

				{/* TABS */}
				<TabsList className="grid w-full justify-start gap-3 bg-transparent p-0">
					{/* DURATION VIEW */}
					<TabsTrigger
						value="duration"
						onClick={() => onViewChange("duration")}
						className={cn(
							buttonVariants({ variant: "ghost" }),
							"w-[200px] justify-between px-4 py-3 h-auto text-base font-normal hover:bg-neutral-200 dark:hover:bg-neutral-800",
							currentView === "duration" && "pointer-events-none"
						)}
						disabled={showForm}
					>
						{/* DURATION */}
						<div className="flex items-center gap-3">
							<Clock4 className="size-5" />
							<span>{formatDuration(parseInt(selectedDuration))}</span>
						</div>

						{/* CHEVRON RIGHT */}
						{!showForm && currentView !== "duration" && (
							<ChevronRight className="size-5" />
						)}
					</TabsTrigger>

					{/* PLATFORM VIEW */}
					<TabsTrigger
						value="platform"
						onClick={() => onViewChange("platform")}
						className={cn(
							buttonVariants({ variant: "ghost" }),
							"w-[200px] justify-between px-4 py-3 h-auto text-base font-normal hover:bg-neutral-200 dark:hover:bg-neutral-800",
							currentView === "platform" && "pointer-events-none"
						)}
						disabled={showForm}
					>
						{/* PLATFORM */}
						<div className="flex items-center gap-3">
							<PlatformIcon className="size-5" />
							<div>
								<span>{selectedPlatform}</span>
								<div className="text-xs text-muted-foreground hidden">
									(Platform)
								</div>
							</div>
						</div>

						{/* CHEVRON RIGHT */}
						{!showForm && currentView !== "platform" && (
							<ChevronRight className="size-5" />
						)}
					</TabsTrigger>

					{/* CALENDAR VIEW */}
					{!showForm && currentView !== "calendar" && (
						<TabsTrigger
							value="calendar"
							onClick={() => onViewChange("calendar")}
							className={cn(
								buttonVariants({ variant: "ghost" }),
								"w-[200px] justify-between px-4 py-3 h-auto text-base font-normal hover:bg-neutral-200 dark:hover:bg-neutral-800",
								currentView === "calendar" && "pointer-events-none"
							)}
						>
							{/* CHEVRON LEFT */}
							<div className="flex items-center gap-3">
								<ChevronLeft className="size-5" />
								<span>Back to Calendar</span>
							</div>
						</TabsTrigger>
					)}
				</TabsList>
			</div>
		</div>
	);
}
