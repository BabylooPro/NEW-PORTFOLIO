import * as React from "react";
import { ClockArrowUp } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

export function BufferOption() {
	const [isBufferChecked, setIsBufferChecked] = React.useState(false); // STATE FOR BUFFER CHECKBOX

	return (
		<div className="space-y-4">
			{/* BUFFER CHECKBOX */}
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-2">
					<ClockArrowUp className="w-4 h-4" />
					<label
						htmlFor="buffer"
						className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						Add buffer time
					</label>
				</div>
				<Switch
					id="buffer"
					checked={isBufferChecked}
					onCheckedChange={setIsBufferChecked}
				/>
			</div>

			{/* BUFFER DURATION */}
			{isBufferChecked && (
				<div className="ml-6">
					<label htmlFor="buffer-time" className="text-sm font-medium mb-1 block">
						Buffer time
					</label>
					<div className="relative">
						<Input
							id="buffer-time"
							type="number"
							placeholder="15"
							defaultValue="15"
							max={30}
							min={5}
							step={5}
							className="w-full pr-20 bg-neutral-100 dark:bg-neutral-900"
						/>
						<span className="absolute top-0 right-3 h-full flex items-center text-sm text-neutral-500">
							minutes
						</span>
					</div>
				</div>
			)}
		</div>
	);
}
