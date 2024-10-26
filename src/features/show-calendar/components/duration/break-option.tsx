import * as React from "react";
import { Coffee } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

export function BreakOption() {
	const [isBreakChecked, setIsBreakChecked] = React.useState(false); // STATE FOR BREAK CHECKBOX

	return (
		<div className="space-y-4">
			{/* BREAK CHECKBOX */}
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-2">
					<Coffee className="w-4 h-4" />
					<label
						htmlFor="break"
						className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						Add a break
					</label>
				</div>
				<Switch id="break" checked={isBreakChecked} onCheckedChange={setIsBreakChecked} />
			</div>

			{/* BREAK DURATION */}
			{isBreakChecked && (
				<div className="ml-6">
					<label htmlFor="break-duration" className="text-sm font-medium mb-1 block">
						Break duration
					</label>
					<div className="relative">
						<Input
							id="break-duration"
							type="number"
							placeholder="5"
							defaultValue="5"
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
