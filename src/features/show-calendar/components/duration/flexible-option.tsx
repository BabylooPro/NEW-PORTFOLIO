import * as React from "react";
import { CalendarClock } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function FlexibleOption() {
	const [isFlexibleChecked, setIsFlexibleChecked] = React.useState(false); // STATE FOR FLEXIBLE CHECKBOX

	return (
		<div className="flex items-center justify-between">
			{/* FLEXIBLE CHECKBOX */}
			<div className="flex items-center space-x-2">
				<CalendarClock className="w-4 h-4" />
				<label
					htmlFor="flexible"
					className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					Flexible duration
				</label>
			</div>

			{/* FLEXIBLE SWITCH */}
			<Switch
				id="flexible"
				checked={isFlexibleChecked}
				onCheckedChange={setIsFlexibleChecked}
			/>
		</div>
	);
}
