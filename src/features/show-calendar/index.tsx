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

interface FormData {
	name: string;
	email: string;
	phone: string;
	notes: string;
	guests: { email: string }[];
}

export function ShowCalendarIndex() {
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
	const [showFormState, setShowFormState] = useState(false); // STATE FOR SHOW FORM

	// STATE FOR SELECTED DATE TIME
	const [selectedDateTime, setSelectedDateTime] = useState(() => {
		const now = new Date();
		now.setMinutes(Math.round(now.getMinutes() / 30) * 30);
		now.setSeconds(0);
		now.setMilliseconds(0);
		return now;
	});

	// STATE FOR FORM DATA
	const [formData, setFormData] = useState<FormData>({
		name: "",
		email: "",
		phone: "",
		notes: "",
		guests: [],
	});

	// FUNCTION TO HANDLE TIME SELECT
	const handleTimeSelect = () => {
		setShowFormState(true);
	};

	// FUNCTION TO HANDLE DATE TIME CHANGE
	const handleDateTimeChange = (newDateTime: Date) => {
		setSelectedDateTime(newDateTime);
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

					{/* SHOW FORM */}
					{showFormState ? (
						<FormPanel
							formData={formData}
							setFormData={setFormData}
							onBack={handleFormBack}
						/>
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
								onTimeSelect={handleTimeSelect}
								onDateTimeChange={handleDateTimeChange}
							/>
						</>
					)}
				</div>
			</Tabs>
		</Section>
	);
}
