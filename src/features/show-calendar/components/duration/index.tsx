"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DurationSelect } from "./duration-select";
import { BreakOption } from "./break-option";
import { DelayOption } from "./delay-option";
import { BufferOption } from "./buffer-option";
import { FlexibleOption } from "./flexible-option";

export function Duration() {
	const [value, setValue] = React.useState("15"); // STATE FOR DURATION

	// FUNCTION TO DISPATCH CUSTOM EVENT
	const dispatchDurationChange = (duration: string) => {
		const event = new CustomEvent("durationChanged", { detail: { duration } });
		window.dispatchEvent(event);
	};

	// EFFECT TO DISPATCH EVENT WHEN VALUE CHANGES
	React.useEffect(() => {
		dispatchDurationChange(value);
	}, [value]);

	return (
		<Card className="w-[420px] bg-transparent border-none shadow-none">
			{/* CARD HEADER */}
			<CardHeader>
				<CardTitle className="text-lg font-semibold flex items-center gap-2">
					<Clock className="w-5 h-5" />
					Meeting Duration
				</CardTitle>
			</CardHeader>

			{/* CARD CONTENT */}
			<CardContent className="space-y-6">
				<DurationSelect value={value} setValue={setValue} />
				<BreakOption />
				<DelayOption />
				<BufferOption />
				<FlexibleOption />
			</CardContent>
		</Card>
	);
}
