"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DurationSelect } from "./duration-select";
import { BreakOption } from "./break-option";
import { DelayOption } from "./delay-option";
import { BufferOption } from "./buffer-option";
import { FlexibleOption } from "./flexible-option";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import {
	durationSchema,
	defaultDurationValues,
	type DurationValues,
} from "@/features/show-calendar/utils/schema";
import { useSearchParams } from "next/navigation";

export function Duration() {
	const searchParams = useSearchParams();

	// INITIALIZE DEFAULT VALUES FROM URL PARAMS
	const defaultValues: DurationValues = React.useMemo(
		() => ({
			duration: searchParams.get("duration") ?? defaultDurationValues.duration,
			break: {
				hasBreak: searchParams.get("hasBreak") === "true",
				breakDuration:
					Number(searchParams.get("breakDuration")) ??
					defaultDurationValues.break.breakDuration,
			},
			buffer: {
				hasBuffer: searchParams.get("hasBuffer") === "true",
				bufferDuration:
					Number(searchParams.get("bufferDuration")) ||
					defaultDurationValues.buffer.bufferDuration,
			},
			delay: {
				hasDelay: searchParams.get("hasDelay") === "true",
				delayDuration:
					Number(searchParams.get("delayDuration")) ||
					defaultDurationValues.delay.delayDuration,
			},
			flexible: {
				isFlexible: searchParams.get("isFlexible") === "true",
			},
		}),
		[searchParams]
	);

	const form = useForm<DurationValues>({
		resolver: zodResolver(durationSchema),
		defaultValues,
	});

	// UPDATE FORM WHEN URL PARAMS CHANGE
	React.useEffect(() => {
		form.reset(defaultValues);
	}, [defaultValues, form]);

	// DISPATCH EVENT WHEN FORM VALUES CHANGE
	React.useEffect(() => {
		const subscription = form.watch((values) => {
			const event = new CustomEvent("durationChanged", {
				detail: values,
			});
			window.dispatchEvent(event);
		});
		return () => subscription.unsubscribe();
	}, [form, form.watch]);

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
			<Form {...form}>
				<form className="space-y-6">
					<CardContent className="space-y-6">
						<DurationSelect
							value={form.watch("duration")}
							setValue={(value) => form.setValue("duration", value)}
						/>
						<BreakOption
							value={form.watch("break")}
							onBreakOptionChange={(values) => form.setValue("break", values)}
						/>
						<DelayOption
							value={form.watch("delay")}
							onDelayOptionChange={(values) => form.setValue("delay", values)}
						/>
						<BufferOption
							value={form.watch("buffer")}
							onBufferOptionChange={(values) => form.setValue("buffer", values)}
						/>
						<FlexibleOption
							value={form.watch("flexible")}
							onFlexibleOptionChange={(values) => form.setValue("flexible", values)}
						/>
					</CardContent>
				</form>
			</Form>
		</Card>
	);
}
