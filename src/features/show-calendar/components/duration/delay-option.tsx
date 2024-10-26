import * as React from "react";
import { AlertCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

export function DelayOption() {
	const [isDelayChecked, setIsDelayChecked] = React.useState(false); // STATE FOR DELAY CHECKBOX

	return (
		<div className="space-y-4">
			{/* DELAY CHECKBOX */}
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-2">
					<AlertCircle className="w-4 h-4" />
					<label
						htmlFor="delay"
						className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						Allow for delay
					</label>
				</div>
				<Switch id="delay" checked={isDelayChecked} onCheckedChange={setIsDelayChecked} />
			</div>

			{/* MAXIMUM DELAY */}
			{isDelayChecked && (
				<div className="ml-6">
					<label htmlFor="max-delay" className="text-sm font-medium mb-1 block">
						Maximum delay
					</label>
					<div className="relative">
						<Input
							id="max-delay"
							type="number"
							placeholder="10"
							defaultValue="10"
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
