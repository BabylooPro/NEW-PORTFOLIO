import React from "react";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PhysicalLocationOption() {
	return (
		<div className="space-y-4">
			{/* LABEL */}
			<div className="flex items-center space-x-2">
				<MapPin className="w-4 h-4" />
				<Label className="text-sm font-medium">Physical Location</Label>
			</div>

			{/* INPUT */}
			<Input
				type="text"
				placeholder="Enter meeting location"
				className="w-full bg-neutral-100 dark:bg-neutral-900"
			/>
		</div>
	);
}
