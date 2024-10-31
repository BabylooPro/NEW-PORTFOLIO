"use client";

import { useShowCalendar } from "./hooks/useShowCalendar";
import { CenterPanel } from "./panel/center-panel";
import { FormPanel } from "./panel/form-panel";
import { LeftPanel } from "./panel/left-panel";
import { Section } from "../../components/ui/section";
import { Tabs } from "@/components/ui/tabs";
import { ShowInfo } from "@/components/ui/show-info";
import { getLocalTimeZone } from "@internationalized/date";
import { useCalendarData } from "./hooks/useCalendarData";
import { RightPanel } from "./panel/right-panel";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { CombinedFormValues, FormValues } from "@/features/show-calendar/utils/schema";
import { useQueryParams } from "./hooks/useQueryParams";

export function ShowCalendarIndex() {
	const { setQueryParams } = useQueryParams();

	const calendarData = useCalendarData();
	const {
		date,
		focusedDate,
		currentView,
		handleChangeDate,
		setFocusedDate,
		setSelectedPlatform,
		handleViewChange,
	} = useShowCalendar();

	// STATE FOR SHOW FORM
	const [showFormState, setShowFormState] = useState(false);

	// STATE FOR SELECTED DATE TIME
	const [selectedDateTime, setSelectedDateTime] = useState(() => {
		const now = new Date();
		now.setMinutes(Math.round(now.getMinutes() / 30) * 30);
		now.setSeconds(0);
		now.setMilliseconds(0);
		return now;
	});

	// STATE FOR SELECTED TIME
	const [selectedTime, setSelectedTime] = useState<string | null>(null);

	// HANDLE TIME SELECTION - MODIFIED TO HANDLE PRESELECTED TIME
	const handleTimeSelection = (data: CombinedFormValues) => {
		const [hours, minutes] = data.selectedTime.split(":").map(Number);
		const newDateTime = new Date(date.toDate(getLocalTimeZone()));
		newDateTime.setHours(hours, minutes);
		setSelectedDateTime(newDateTime);

		// UPDATE URL WITH ALL FORM VALUES
		const updates: Record<string, string> = {
			date: data.selectedDate,
			timeFormat: data.timeFormat,
			duration: data.duration,
		};

		// ONLY ADD PARAMETERS IF THEY ARE TRUE OR HAVE A VALUE
		if (data.break.hasBreak) {
			updates.breakDuration = data.break.breakDuration.toString();
		}
		if (data.buffer.hasBuffer) {
			updates.bufferDuration = data.buffer.bufferDuration.toString();
		}
		if (data.delay.hasDelay) {
			updates.delayDuration = data.delay.delayDuration.toString();
		}
		if (data.flexible.isFlexible) {
			updates.isFlexible = "true";
		}

		// PLATFORM AND MEETING DETAILS
		updates.platform = data.platform;
		if (data.customLink && data.meetingUrl) {
			updates.meetingUrl = data.meetingUrl;
		}
		if (data.webcam) {
			updates.isWebcam = "true";
		}
		if (data.isPhysical) {
			updates.isPhysical = "true";
		}
		if (data.phone?.phoneNumber) {
			updates.phoneNumber = data.phone.phoneNumber;
		}
		if (data.location?.location) {
			updates.location = data.location.location;
		}

		setQueryParams(updates);

		if (selectedTime === data.selectedTime) {
			setShowFormState(true);

			// PRE-FILL FORM DATA
			const formData: FormValues = {
				name: "",
				email: "",
				phone: data.phone?.phoneNumber ?? "",
				notes: "",
				guests: [],
			};

			// STORE FORM DATA IN SESSION STORAGE
			sessionStorage.setItem(
				"preFilledFormData",
				JSON.stringify({
					formData,
					combinedData: data,
				})
			);
		}
		setSelectedTime(data.selectedTime);
	};

	// FUNCTION TO HANDLE FORM BACK BUTTON
	const handleFormBack = () => {
		setShowFormState(false);
	};

	return (
		<Section>
			{/* TITLE */}
			<h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
				ShowCalendar (WIP)
				<ShowInfo
					title={"ShowCalendar"}
					description={"WORK IN PROGRESS - FAKE DATA"}
					icon={<AlertTriangle className="text-red-500" />}
				/>
			</h2>

			{/* TABS */}
			<Tabs
				value={currentView}
				className="w-full bg-neutral-50 dark:bg-neutral-900 px-8 py-6 rounded-xl max-w-max mx-auto shadow-lg"
			>
				{/* TABS CONTENT */}
				<div className="flex gap-6">
					<LeftPanel
						showForm={showFormState}
						currentView={currentView}
						onViewChange={handleViewChange}
						selectedDateTime={selectedDateTime}
					/>

					{/* SHOW FORM OR CALENDAR */}
					{showFormState ? (
						<FormPanel onBack={handleFormBack} />
					) : (
						// SHOW CENTER PANEL AND RIGHT PANEL
						<>
							<CenterPanel
								date={date}
								focusedDate={focusedDate}
								calendarData={calendarData}
								handleChangeDate={handleChangeDate}
								setFocusedDate={setFocusedDate}
								setSelectedPlatform={setSelectedPlatform}
								currentView={currentView}
							/>
							<RightPanel
								timeZone={getLocalTimeZone()}
								date={date}
								calendarData={calendarData}
								onTimeSelect={handleTimeSelection}
								onDateTimeChange={setSelectedDateTime}
							/>
						</>
					)}
				</div>
			</Tabs>
		</Section>
	);
}
