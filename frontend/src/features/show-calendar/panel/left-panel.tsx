import { ChevronLeft, ChevronRight, Clock4 } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { platforms } from "../components/platform/constants";

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

interface LeftPanelProps {
	showForm: boolean;
	currentView: string;
	onViewChange: (view: string) => void;
	selectedDateTime: Date;
}

export function LeftPanel({
	showForm,
	currentView,
	onViewChange,
	selectedDateTime,
}: LeftPanelProps) {
	const searchParams = useSearchParams(); // GET SEARCH PARAMS
	const [selectedDuration, setSelectedDuration] = useState(searchParams.get("duration") ?? "15"); // STATE FOR SELECTED DURATION
	const [selectedPlatform, setSelectedPlatform] = useState(
		searchParams.get("platform") ?? "phone"
	); // STATE FOR SELECTED PLATFORM

	// EFFECT TO LISTEN FOR CHANGES IN DURATION
	useEffect(() => {
		// UPDATE SELECTED
		const handleDurationChange = (event: CustomEvent) => {
			setSelectedDuration(event.detail.duration);
		};
		const handlePlatformChange = (event: CustomEvent) => {
			setSelectedPlatform(event.detail.platform);
		};

		// ADD EVENT LISTENER
		window.addEventListener("durationChanged", handleDurationChange as EventListener);
		window.addEventListener("platformChanged", handlePlatformChange as EventListener);

		return () => {
			// REMOVE EVENT LISTENER
			window.removeEventListener("durationChanged", handleDurationChange as EventListener);
			window.removeEventListener("platformChanged", handlePlatformChange as EventListener);
		};
	}, []);

	// EFFECT TO UPDATE DURATION FROM URL PARAMS
	useEffect(() => {
		// GET VALUES FROM URL PARAMS
		const durationFromParams = searchParams.get("duration");
		const platformFromParams = searchParams.get("platform");

		// UPDATE SELECTED
		if (durationFromParams) {
			setSelectedDuration(durationFromParams);
		}
		if (platformFromParams) {
			setSelectedPlatform(platformFromParams);
		}
	}, [searchParams]);

	// CAPITALIZE FIRST LETTER OF CURRENT VIEW
	const capitalizedView = currentView.charAt(0).toUpperCase() + currentView.slice(1);

	// GET PLATFORM ICON
	const PlatformIcon = platforms.find((p) => p.value === selectedPlatform)?.icon;

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
							{PlatformIcon && <PlatformIcon className="size-5" />}
							<div>
								<span>
									{platforms.find((p) => p.value === selectedPlatform)?.label}
								</span>
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
